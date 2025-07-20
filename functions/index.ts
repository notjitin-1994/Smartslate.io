import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
import axios from 'axios';

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Enable CORS
const corsHandler = cors({ origin: true });

export const trackVisit = functions.https.onRequest(async (request, response) => {
  // Enable CORS
  return corsHandler(request, response, async () => {
    try {
      // Get visitor information
      const ipAddress = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
      const userAgent = request.headers['user-agent'] || '';
      
      // Get location data from ip-api.com
      let location = {};
      try {
        const ipToCheck = Array.isArray(ipAddress) ? ipAddress[0] : (ipAddress || '').split(',')[0].trim();
        if (ipToCheck && ipToCheck !== '::1' && !ipToCheck.startsWith('192.168.') && !ipToCheck.startsWith('10.') && !ipToCheck.startsWith('172.') && ipToCheck !== '127.0.0.1') {
          const response = await axios.get(`http://ip-api.com/json/${ipToCheck}`);
          if (response.data && response.data.status === 'success') {
            const { status, query, ...locationData } = response.data;
            location = locationData;
          }
        }
      } catch (error) {
        console.error('Error getting location data:', error);
      }

      // Create visit document
      const visitData = {
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        ipAddress,
        userAgent,
        location,
      };

      // Save to Firestore
      await db.collection('visits').add(visitData);

      // Return success response
      response.status(200).json({
        success: true,
        message: 'Visit tracked successfully',
        data: {
          timestamp: new Date().toISOString(),
          ...visitData
        }
      });
    } catch (error) {
      console.error('Error tracking visit:', error);
      response.status(500).json({
        success: false,
        message: 'Failed to track visit',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
});
