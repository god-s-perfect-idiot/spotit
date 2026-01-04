import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { getCurrentFirebaseUser } from './firebaseAuth';

// Mark onboarding as complete for the current user
export const completeOnboarding = async (): Promise<void> => {
  try {
    const firebaseUser = getCurrentFirebaseUser();
    if (!firebaseUser) {
      throw new Error('No authenticated user');
    }

    const userRef = doc(db, 'users', firebaseUser.uid);
    await updateDoc(userRef, {
      completedOnboarding: true,
      onboardingStep: null, // Clear onboarding step when complete
      updatedAt: serverTimestamp(),
    });
    
    console.log('Onboarding marked as complete');
  } catch (error) {
    console.error('Error completing onboarding:', error);
    throw error;
  }
};

