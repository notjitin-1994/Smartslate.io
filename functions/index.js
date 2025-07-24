const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");
const cors = require("cors")({ 
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
});

initializeApp();

const functionOptions = {
    runtime: { nodejs: '18' },
    labels: { "redeploy": "202507241825" } // Updated timestamp
};

// Helper to get the authenticated user from the request headers
const getAuthenticatedUser = async (req) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        return null;
    }
    const idToken = req.headers.authorization.split('Bearer ')[1];
    try {
        return await getAuth().verifyIdToken(idToken);
    } catch (error) {
        console.error('Error verifying auth token:', error);
        return null;
    }
};

// Helper to check for admin privileges
const ensureAdmin = async (decodedToken) => {
    if (!decodedToken) {
        return { hasPermission: false, message: 'Authentication token is missing or invalid.' };
    }
    const db = getFirestore();
    const callerDoc = await db.collection("users").doc(decodedToken.uid).get();
    if (!callerDoc.exists() || callerDoc.data().role !== 'smartslate-admin') {
        return { hasPermission: false, message: 'You do not have permission to perform this action.' };
    }
    return { hasPermission: true };
};

// Wrapper for creating an admin-only HTTPS endpoint
const createAdminEndpoint = (handler) => onRequest(functionOptions, (req, res) => {
    cors(req, res, async () => {
        // Handle CORS pre-flight request
        if (req.method === 'OPTIONS') {
            res.status(204).send('');
            return;
        }

        // All other requests should be POST
        if (req.method !== 'POST') {
            res.status(405).json({ error: 'Method Not Allowed' });
            return;
        }

        const decodedToken = await getAuthenticatedUser(req);
        const adminCheck = await ensureAdmin(decodedToken);

        if (!adminCheck.hasPermission) {
            res.status(403).json({ error: adminCheck.message });
            return;
        }

        try {
            await handler(req, res);
        } catch (error) {
            console.error('Unhandled error in function execution:', error);
            res.status(500).json({ error: 'An unexpected internal error occurred.' });
        }
    });
});

// --- Admin Functions ---

exports.createUser = createAdminEndpoint(async (req, res) => {
    const { email, password, displayName, role } = req.body.data;
    if (!email || !password || !displayName || !role) {
        return res.status(400).json({ error: 'Missing required fields: email, password, displayName, role.' });
    }

    const auth = getAuth();
    const db = getFirestore();
    const userRecord = await auth.createUser({ email, password, displayName });
    await auth.setCustomUserClaims(userRecord.uid, { role });
    const now = new Date();
    await db.collection("users").doc(userRecord.uid).set({ 
        email, displayName, role, createdAt: now.toISOString(), updatedAt: now.toISOString(),
    });

    res.status(200).json({ data: { status: 'success', uid: userRecord.uid } });
});

exports.setUserRole = createAdminEndpoint(async (req, res) => {
    const { email, role } = req.body.data;
    if (!email || !role) {
        return res.status(400).json({ error: 'Missing required fields: email, role.' });
    }

    const auth = getAuth();
    const db = getFirestore();
    const targetUser = await auth.getUserByEmail(email);
    await auth.setCustomUserClaims(targetUser.uid, { role });
    await db.collection("users").doc(targetUser.uid).update({ role });

    res.status(200).json({ data: { status: 'success' } });
});

exports.listUsers = createAdminEndpoint(async (req, res) => {
    const auth = getAuth();
    const listUsersResult = await auth.listUsers(1000);
    const users = listUsersResult.users.map((user) => ({
        uid: user.uid, email: user.email, displayName: user.displayName, customClaims: user.customClaims,
    }));
    res.status(200).json({ data: { users } });
});

exports.updateUser = createAdminEndpoint(async (req, res) => {
    const { uid, role } = req.body.data;
    if (!uid || !role) {
        return res.status(400).json({ error: 'Missing required fields: uid, role.' });
    }

    const auth = getAuth();
    const db = getFirestore();
    await auth.setCustomUserClaims(uid, { role });
    await db.collection("users").doc(uid).update({ role });

    const updatedUser = await auth.getUser(uid);
    res.status(200).json({ data: { uid: updatedUser.uid, customClaims: updatedUser.customClaims } });
});

exports.deleteUser = createAdminEndpoint(async (req, res) => {
    const { uid } = req.body.data;
    if (!uid) {
        return res.status(400).json({ error: 'Missing required field: uid.' });
    }

    const auth = getAuth();
    const db = getFirestore();
    await auth.deleteUser(uid);
    await db.collection("users").doc(uid).delete();

    res.status(200).json({ data: { status: 'success' } });
});
