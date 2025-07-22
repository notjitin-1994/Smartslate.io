import { useState } from 'react';
import { Button } from './ui/button';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const FirestoreTest = () => {
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const testFirestore = async () => {
    setIsTesting(true);
    setTestResult('Testing Firestore connection...');
    
    try {
      // Test document reference
      const testDocRef = doc(db, 'test', 'connection-test');
      
      // Write a test document
      await setDoc(testDocRef, {
        message: 'Testing Firestore connection',
        timestamp: new Date().toISOString(),
        randomValue: Math.random()
      });
      
      // Read the document back
      const docSnap = await getDoc(testDocRef);
      
      if (docSnap.exists()) {
        setTestResult('✅ Firestore connection successful! Document data: ' + 
          JSON.stringify(docSnap.data(), null, 2));
      } else {
        setTestResult('❌ Document not found after writing');
      }
    } catch (error: any) {
      setTestResult(`❌ Error: ${error.message}\nCode: ${error.code}`);
      console.error('Firestore test error:', error);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={testFirestore}
        disabled={isTesting}
        className="bg-blue-500 text-white hover:bg-blue-600"
      >
        {isTesting ? 'Testing...' : 'Test Firestore'}
      </Button>
      {testResult && (
        <div className="mt-2 p-2 bg-white rounded shadow-lg max-w-xs text-sm">
          <pre className="whitespace-pre-wrap">{testResult}</pre>
        </div>
      )}
    </div>
  );
};
