const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");

initializeApp();

exports.setUserRole = onCall(async (request) => {
  // 1. Check if the user is authenticated.
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "You must be logged in to call this function."
    );
  }

  // 2. Get the UID of the user calling the function.
  const callerUid = request.auth.uid;
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
    const db = getFirestore();
    const auth = getAuth();

    // 3. Verify the calling user is a 'smartslate-admin'.
    const callerDoc = await db.collection("users").doc(callerUid).get();
    if (!callerDoc.exists || callerDoc.data().role !== 'smartslate-admin') {
      throw new HttpsError(
        "permission-denied",
        "You do not have permission to perform this action."
      );
    }

    // 4. Get the target user's record and set their new role.
    const targetUser = await auth.getUserByEmail(email);
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
