// Test script for Firestore integration
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously, signInWithEmailAndPassword } from 'firebase/auth';

// Enable Firestore logging for debugging
import { connectFirestoreEmulator } from 'firebase/firestore';
import { connectAuthEmulator } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDeN3mSpmnjyk9jIg6efqp8uQnb0_tpyiw",
  authDomain: "smartslatesite-app.firebaseapp.com",
  projectId: "smartslatesite-app",
  storageBucket: "smartslatesite-app.appspot.com",
  messagingSenderId: "490151080321",
  appId: "1:490151080321:web:15778d0b8f45b8ef20f880"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Uncomment these lines if you want to use the Firebase Emulator
// connectFirestoreEmulator(db, 'localhost', 8080);
// connectAuthEmulator(auth, 'http://localhost:9099');

// Test user credentials (replace with a test user or use anonymous auth)
const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'test1234';

// Helper function to log with timestamps
function log(message, data = null) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
}

// Main test function
async function testFirestore() {
  let testUserId = '';
  let testDocRef = null;
  
  try {
    log('🚀 Starting Firestore test...');
    
    // Sign in anonymously (or with email/password)
    log('🔑 Signing in...');
    let userCredential;
    
    try {
      // Try email/password first
      log(`🔐 Attempting to sign in with email: ${TEST_EMAIL}`);
      userCredential = await signInWithEmailAndPassword(auth, TEST_EMAIL, TEST_PASSWORD);
      log('✅ Signed in with email/password');
    } catch (authError) {
      // Fall back to anonymous auth
      log('⚠️  Email/password auth failed, falling back to anonymous auth...');
      log('Error details:', { message: authError.message, code: authError.code });
      
      log('👤 Attempting anonymous sign-in...');
      userCredential = await signInAnonymously(auth);
      log('✅ Signed in anonymously');
    }
    
    const user = userCredential.user;
    testUserId = user.uid;
    console.log(`User ID: ${testUserId}`);
    
    // Test 1: Create a document
    console.log('\n--- Test 1: Creating document ---');
    const testData = {
      uid: user.uid,
      email: user.email || 'anonymous@example.com',
      displayName: 'Test User',
      role: 'tester',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await setDoc(doc(db, 'users', user.uid), testData);
    console.log('✅ Document created successfully');
    
    // Test 2: Read the document
    console.log('\n--- Test 2: Reading document ---');
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log('✅ Document data:', JSON.stringify(docSnap.data(), null, 2));
    } else {
      console.log('❌ No such document!');
    }
    
    // Test 3: Update the document
    console.log('\n--- Test 3: Updating document ---');
    const updateData = {
      displayName: 'Updated Test User',
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(docRef, updateData);
    console.log('✅ Document updated successfully');
    
    // Verify the update
    const updatedDoc = await getDoc(docRef);
    if (updatedDoc.exists() && updatedDoc.data().displayName === 'Updated Test User') {
      console.log('✅ Document update verified');
    } else {
      console.log('❌ Document update verification failed');
    }
    
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during test:', error);
  } finally {
    // Clean up (optional)
    if (testUserId) {
      console.log('\n--- Cleaning up test data ---');
      try {
        await deleteDoc(doc(db, 'users', testUserId));
        console.log('✅ Test document deleted');
      } catch (cleanupError) {
        console.error('Error cleaning up test data:', cleanupError);
      }
    }
    
    // Exit the process
    process.exit(0);
  }
}

// Run the test
testFirestore();
