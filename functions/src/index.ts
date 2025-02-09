import { onSchedule } from 'firebase-functions/v2/scheduler';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';

admin.initializeApp();

// Automatically delete expired messages every hour
export const cleanupExpiredMessages = onSchedule({
  schedule: '0 * * * *', // Every hour
  region: 'europe-west1',
  memory: '256MiB',
}, async () => {
  const now = admin.firestore.Timestamp.now();
  const db = admin.firestore();

  try {
    // Query for expired messages
    const snapshot = await db
      .collection('messages')
      .where('expiresAt', '<=', now)
      .get();

    // No expired messages
    if (snapshot.empty) {
      console.log('No expired messages found');
      return;
    }

    // Delete expired messages
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`Deleted ${snapshot.size} expired messages`);
  } catch (error) {
    console.error('Error cleaning up messages:', error);
  }
});

// Check and delete expired messages when a new message is created
export const onMessageCreate = onDocumentCreated({
  document: 'messages/{messageId}',
  region: 'europe-west1',
  memory: '256MiB',
}, async () => {
  const now = admin.firestore.Timestamp.now();
  const db = admin.firestore();

  try {
    // Query for expired messages
    const snapshot = await db
      .collection('messages')
      .where('expiresAt', '<=', now)
      .get();

    // No expired messages
    if (snapshot.empty) {
      return;
    }

    // Delete expired messages
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`Deleted ${snapshot.size} expired messages on new message creation`);
  } catch (error) {
    console.error('Error cleaning up messages:', error);
  }
});
