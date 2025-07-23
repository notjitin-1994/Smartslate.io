const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");

initializeApp();

const functionOptions = {
  cors: ["https://www.smartslate.io", "https://smartslatesite-app.web.app"],
  runtime: { nodejs: '18' },
};

// Helper function to check for admin privileges
const ensureAdmin = async (request) => {
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "You must be logged in to call this function."
    );
  }
  const callerUid = request.auth.uid;
  const db = getFirestore();
  const callerDoc = await db.collection("users").doc(callerUid).get();
  if (!callerDoc.exists || callerDoc.data().role !== 'smartslate-admin') {
    throw new HttpsError(
      "permission-denied",
      "You do not have permission to perform this action."
    );
  }
};

exports.setUserRole = onCall(functionOptions, async (request) => {
  // 1. Check if the user is authenticated.
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "You must be logged in to call this function."
    );
  }

  // 2. Get the UID of the user calling the function.
  const { email, role } = request.data;

  if (!email || !role) {
    throw new HttpsError(
      "invalid-argument",
      'The function must be called with "email" and "role" arguments.'
    );
  }

  const validRoles = ['smartslate-admin', 'smartslate-manager', 'manager', 'learner'];
  if (!validRoles.includes(role)) {
      throw new HttpsError('invalid-argument', `Invalid role. Must be one of: ${validRoles.join(', ')}`);
  }

  try {
    await ensureAdmin(request);
    const db = getFirestore();
    const auth = getAuth();

    // 4. Get the target user's record and set their new role.
    const targetUser = await auth.getUserByEmail(email);
    await auth.setCustomUserClaims(targetUser.uid, { role });
    await db.collection("users").doc(targetUser.uid).update({ role });

    return { 
        status: 'success',
        message: `Successfully assigned the role '${role}' to ${email}.`
    };

  } catch (error) {
    if (error instanceof HttpsError) {
        throw error; // Re-throw HttpsError instances directly
    }
    console.error("Error in setUserRole function:", error);
    throw new HttpsError("internal", "An unexpected error occurred.");
  }
});

exports.listUsers = onCall(functionOptions, async (request) => {
  try {
    await ensureAdmin(request);
    const auth = getAuth();
    const listUsersResult = await auth.listUsers(1000);
    const users = listUsersResult.users.map((userRecord) => ({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      customClaims: userRecord.customClaims,
    }));
    return { users };
  } catch (error) {
    if (error instanceof HttpsError) {
      throw error;
    }
    console.error("Error in listUsers function:", error);
    throw new HttpsError("internal", "An unexpected error occurred while listing users.");
  }
});

exports.updateUser = onCall(functionOptions, async (request) => {
  try {
    await ensureAdmin(request);
    const { uid, role } = request.data;
    if (!uid || !role) {
      throw new HttpsError("invalid-argument", 'The function must be called with "uid" and "role" arguments.');
    }
    const auth = getAuth();
    const db = getFirestore();

    await auth.setCustomUserClaims(uid, { role });
    await db.collection("users").doc(uid).update({ role });

    const updatedUser = await auth.getUser(uid);
    return {
      uid: updatedUser.uid,
      email: updatedUser.email,
      displayName: updatedUser.displayName,
      customClaims: updatedUser.customClaims,
    };
  } catch (error) {
    if (error instanceof HttpsError) {
      throw error;
    }
    console.error("Error in updateUser function:", error);
    throw new HttpsError("internal", "An unexpected error occurred while updating the user.");
  }
});

exports.deleteUser = onCall(functionOptions, async (request) => {
  try {
    await ensureAdmin(request);
    const { uid } = request.data;
    if (!uid) {
      throw new HttpsError("invalid-argument", 'The function must be called with a "uid" argument.');
    }
    const auth = getAuth();
    const db = getFirestore();

    await auth.deleteUser(uid);
    await db.collection("users").doc(uid).delete();

    return { status: 'success', message: `Successfully deleted user ${uid}.` };
  } catch (error) {
    if (error instanceof HttpsError) {
      throw error;
    }
    console.error("Error in deleteUser function:", error);
    throw new HttpsError("internal", "An unexpected error occurred while deleting the user.");
  }
});
