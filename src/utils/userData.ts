import { doc, updateDoc, serverTimestamp, Timestamp, type FieldValue } from 'firebase/firestore';
import { db } from './firebase';
import { getCurrentFirebaseUser } from './firebaseAuth';

// Update user data in Firestore
export const updateUserData = async (data: { birthdate?: Date; lastPeriodStart?: Date; [key: string]: unknown }): Promise<void> => {
  try {
    const firebaseUser = getCurrentFirebaseUser();
    if (!firebaseUser) {
      throw new Error('No authenticated user');
    }

    const userRef = doc(db, 'users', firebaseUser.uid);
    
    // Convert Date objects to Firestore Timestamp if needed
    const updateData: { [key: string]: unknown | FieldValue } = {
      ...data,
      updatedAt: serverTimestamp(),
    };

    // Convert birthdate Date to Firestore Timestamp
    if (data.birthdate instanceof Date) {
      updateData.birthdate = Timestamp.fromDate(data.birthdate);
    }

    // Convert lastPeriodStart Date to Firestore Timestamp
    if (data.lastPeriodStart instanceof Date) {
      updateData.lastPeriodStart = Timestamp.fromDate(data.lastPeriodStart);
    }

    // Type assertion needed due to Firestore's complex type system
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await updateDoc(userRef, updateData as any);
    
    console.log('User data updated successfully');
  } catch (error) {
    console.error('Error updating user data:', error);
    throw error;
  }
};

