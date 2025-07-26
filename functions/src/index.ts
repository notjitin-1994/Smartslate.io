import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const ensureAdmin = (context: functions.https.CallableContext): void => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.'
    );
  }

  const userEmail = context.auth.token.email;
  if (userEmail !== 'jitin@smartslate.io') {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only the designated admin can access this function.'
    );
  }
};

export const listAllUsers = functions.https.onCall(async (data, context) => {
  try {
    ensureAdmin(context);

    const nextPageToken = data?.nextPageToken;

    const listUsersResult = nextPageToken && typeof nextPageToken === 'string' && nextPageToken.trim() !== ''
      ? await admin.auth().listUsers(1000, nextPageToken)
      : await admin.auth().listUsers(1000);

    return {
      users: listUsersResult.users.map(user => ({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
        disabled: user.disabled,
        metadata: {
          creationTime: user.metadata.creationTime,
          lastSignInTime: user.metadata.lastSignInTime,
        },
        providerData: user.providerData,
        customClaims: user.customClaims,
      })),
      nextPageToken: listUsersResult.pageToken,
    };
  } catch (error) {
    console.error('Error listing users:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError(
      'internal',
      'An error occurred while listing users.'
    );
  }
});
