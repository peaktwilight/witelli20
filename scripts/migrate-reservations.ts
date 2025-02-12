import { db } from './firebase-admin';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const OPEN_KEYWORDS = [
  'open for everyone',
  'everyone welcome',
  'welcome to join',
  'feel free to join',
  'open invitation',
  'open to all',
  'anyone can join',
];

async function migrateReservations() {
  try {
    // Get all reservations
    const querySnapshot = await getDocs(collection(db, 'reservations'));
    
    console.log(`Found ${querySnapshot.size} reservations to process`);
    
    for (const document of querySnapshot.docs) {
      const data = document.data();
      
      // Skip if already has the field
      if ('isOpenInvite' in data) {
        console.log(`Skipping ${document.id} - already has isOpenInvite field`);
        continue;
      }

      // Check if description contains any open invitation keywords
      const description = (data.description || '').toLowerCase();
      const isOpenInvite = OPEN_KEYWORDS.some(keyword => description.includes(keyword.toLowerCase()));

      // Update the document
      await updateDoc(doc(db, 'reservations', document.id), {
        isOpenInvite
      });

      console.log(`Updated ${document.id} - set isOpenInvite to ${isOpenInvite}`);
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

// Run migration
migrateReservations();
