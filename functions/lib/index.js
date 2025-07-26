"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAllUsers = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
admin.initializeApp();
const ensureAdmin = (context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }
    const userEmail = context.auth.token.email;
    if (userEmail !== 'jitin@smartslate.io') {
        throw new functions.https.HttpsError('permission-denied', 'Only the designated admin can access this function.');
    }
};
exports.listAllUsers = functions.https.onCall(async (data, context) => {
    try {
        ensureAdmin(context);
        const nextPageToken = data === null || data === void 0 ? void 0 : data.nextPageToken;
        const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
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
    }
    catch (error) {
        console.error('Error listing users:', error);
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }
        throw new functions.https.HttpsError('internal', 'An error occurred while listing users.');
    }
});
//# sourceMappingURL=index.js.map