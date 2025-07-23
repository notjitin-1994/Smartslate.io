const admin = require('firebase-admin');

// IMPORTANT: You must download your own service account key file from the
// Firebase console and place it in the '.firebase' directory.
// Go to Project settings > Service accounts > Generate new private key
// Rename the downloaded file to 'serviceAccountKey.json'.
// Make sure this file is NOT committed to your version control (it's in .gitignore by default).
const serviceAccount = require('../.firebase/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const [email, role] = process.argv.slice(2);

if (!email || !role) {
  console.error('Usage: node scripts/set-user-role.cjs <email> <role>');
  process.exit(1);
}

const validRoles = ['smartslate-admin', 'smartslate-manager', 'manager', 'learner'];
if (!validRoles.includes(role)) {
    console.error(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
    process.exit(1);
}

(async () => {
  try {
    // Get user by email from Firebase Authentication
    const userRecord = await admin.auth().getUserByEmail(email);
    const uid = userRecord.uid;

    // Get Firestore instance
    const db = admin.firestore();

    // Update the 'role' field in the user's document in the 'users' collection
    await db.collection('users').doc(uid).update({ role });

    console.log(`Successfully set role '${role}' for user ${email} (UID: ${uid}).`);
    console.log('The new role is now active in Firestore and will be enforced by security rules.');

  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.error(`Error: No user found with the email '${email}'.`);
    } else {
      console.error('Error setting user role:', error.message);
    }
    process.exit(1);
  }
})();
