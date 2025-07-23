const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// Make sure your environment is authenticated, e.g., by running `gcloud auth application-default login`
admin.initializeApp({
  projectId: 'smartslatesite-app'
});

const db = admin.firestore();

async function addAILiteracyCourse() {
  console.log('Attempting to add "AI Literacy" course...');
  try {
    const coursesCollection = db.collection('courses');

    const courseData = {
      title: 'AI Literacy',
      description: 'A foundational course on understanding and utilizing Artificial Intelligence in various professional and personal contexts. Learn about the core concepts, ethical considerations, and practical applications of AI.',
      author: 'Smartslate.io Team',
      tags: ['AI', 'Artificial Intelligence', 'Machine Learning', 'Future of Work', 'Technology'],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Add the document and get the reference
    const docRef = await coursesCollection.add(courseData);

    // Update the document with its own ID
    await docRef.update({ id: docRef.id });

    console.log(`Successfully added 'AI Literacy' course with ID: ${docRef.id}`);

  } catch (error) {
    console.error('Error adding course:', error);
    process.exit(1);
  }
}

addAILiteracyCourse();
