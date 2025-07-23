const admin = require('firebase-admin');

// The SDK will automatically find the credentials from your gcloud login.
admin.initializeApp({
  projectId: 'smartslatesite-app'
});

const auth = admin.auth();
const db = admin.firestore();
const usersCollection = db.collection('users');

async function listAllUsers(nextPageToken) {
  try {
    const listUsersResult = await auth.listUsers(1000, nextPageToken);
    const users = listUsersResult.users;

    if (users.length === 0) {
      console.log('No users to process.');
      return;
    }

    const batch = db.batch();

    for (const userRecord of users) {
      const user = userRecord.toJSON();
      const userRef = usersCollection.doc(user.uid);

      const userData = {
        uid: user.uid,
        email: user.email || null,
        displayName: user.displayName || null,
        isAnonymous: false, // Existing users are not anonymous
        createdAt: user.metadata.creationTime, // Use existing creation time
      };

      batch.set(userRef, userData, { merge: true });
    }

    await batch.commit();
    console.log(`Successfully migrated ${users.length} users.`);

    if (listUsersResult.pageToken) {
      // List next batch of users.
      await listAllUsers(listUsersResult.pageToken);
    }
  } catch (error) {
    console.error('Error listing or migrating users:', error);
  }
}

async function main() {
  console.log('Starting user migration...');
  await listAllUsers();
  console.log('User migration finished.');
}

main();
