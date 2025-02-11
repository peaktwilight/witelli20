import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { resolve } from 'path';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if all required environment variables are present
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars.join(', '));
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrateMessages() {
  try {
    console.log('Starting message migration...');
    
    // Get all messages
    const messagesRef = collection(db, 'messages');
    const snapshot = await getDocs(messagesRef);
    
    console.log(`Found ${snapshot.size} messages to migrate`);
    let migratedCount = 0;
    let skippedCount = 0;
    
    // Update each message
    for (const docSnapshot of snapshot.docs) {
      const data = docSnapshot.data();
      
      // Skip if already migrated
      if ('parentId' in data) {
        console.log(`Skipping already migrated message ${docSnapshot.id}`);
        skippedCount++;
        continue;
      }
      
      console.log(`Migrating message ${docSnapshot.id}...`);
      
      // Update the message with new fields
      await updateDoc(doc(db, 'messages', docSnapshot.id), {
        parentId: null, // Mark as top-level message
        upvotes: data.upvotes || 0,
        downvotes: data.downvotes || 0,
      });
      
      console.log(`Successfully migrated message ${docSnapshot.id}`);
      migratedCount++;
    }
    
    console.log('\nMigration Summary:');
    console.log(`Total messages: ${snapshot.size}`);
    console.log(`Migrated: ${migratedCount}`);
    console.log(`Skipped (already migrated): ${skippedCount}`);
    console.log('\nMigration completed successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

// Run the migration
migrateMessages();
