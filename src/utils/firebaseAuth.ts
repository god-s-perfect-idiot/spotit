import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  type User,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider, appleProvider } from './firebase';

export interface UserData {
  id: string;
  email: string;
  name: string;
  displayName?: string;
  photoURL?: string;
  birthdate?: Date | any; // Can be Date object or Firestore Timestamp
  lastPeriodStart?: Date | any; // Can be Date object or Firestore Timestamp
  cycleLength?: number | null; // Cycle length in days, null if user is not sure
  goal?: "track-cycle" | "get-pregnant" | "track-pregnancy" | "track-perimenopause";
  healthConditions?: {
    predefined: string[];
    custom: string[];
  };
  completedOnboarding?: boolean;
  onboardingStep?: number; // Current onboarding step (-1 for hero, 0-4 for steps)
  createdAt?: any;
  updatedAt?: any;
}

// Save user data to Firestore
export const saveUserToFirestore = async (user: User, additionalData?: any): Promise<UserData> => {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // New user - create document
      const userData: UserData = {
        id: user.uid,
        email: user.email || '',
        name: user.displayName || user.email?.split('@')[0] || 'User',
        displayName: user.displayName,
        photoURL: user.photoURL,
        completedOnboarding: false, // New users haven't completed onboarding
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...additionalData,
      };

      console.log('Creating user document in Firestore:', { uid: user.uid, email: user.email });
      await setDoc(userRef, userData);
      console.log('User document created successfully in Firestore');
      return userData;
    } else {
      // Existing user - update last login
      const existingData = userSnap.data() as UserData;
      console.log('Updating existing user document in Firestore:', { uid: user.uid });
      await setDoc(
        userRef,
        {
          updatedAt: serverTimestamp(),
          ...(additionalData || {}),
        },
        { merge: true }
      );
      console.log('User document updated successfully in Firestore');
      return { ...existingData, ...additionalData };
    }
  } catch (error: any) {
    // Log the full error for debugging
    console.error('Failed to save user to Firestore:', {
      error: error.message,
      code: error.code,
      uid: user.uid,
      email: user.email,
      fullError: error,
    });
    
    // Still return basic user data so the app doesn't break
    // But log a warning so developers know there's an issue
    console.warn('Returning basic user data without Firestore save. Check Firestore rules and connection.');
    return {
      id: user.uid,
      email: user.email || '',
      name: user.displayName || user.email?.split('@')[0] || 'User',
      displayName: user.displayName,
      photoURL: user.photoURL,
      ...additionalData,
    };
  }
};

// Email/Password Sign Up
export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName?: string
): Promise<{ user: UserData; firebaseUser: User }> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Update display name if provided
    if (displayName) {
      // Note: Firebase Auth doesn't allow updating displayName directly
      // We'll store it in Firestore instead
    }

    const userData = await saveUserToFirestore(firebaseUser, {
      name: displayName || email.split('@')[0],
    });

    return { user: userData, firebaseUser };
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code));
  }
};

// Email/Password Sign In
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<{ user: UserData; firebaseUser: User }> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    const userData = await saveUserToFirestore(firebaseUser);

    return { user: userData, firebaseUser };
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code));
  }
};

// Google Sign In
export const signInWithGoogle = async (): Promise<{ user: UserData; firebaseUser: User }> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const firebaseUser = result.user;

    const userData = await saveUserToFirestore(firebaseUser, {
      name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
    });

    return { user: userData, firebaseUser };
  } catch (error: any) {
    // Don't throw error if user intentionally closed the popup
    if (error.code === 'auth/popup-closed-by-user') {
      // Return a special error that can be handled silently
      throw new Error('POPUP_CLOSED');
    }
    throw new Error(getAuthErrorMessage(error.code || error.message));
  }
};

// Apple Sign In
export const signInWithApple = async (): Promise<{ user: UserData; firebaseUser: User }> => {
  try {
    const result = await signInWithPopup(auth, appleProvider);
    const firebaseUser = result.user;

    const userData = await saveUserToFirestore(firebaseUser, {
      name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
    });

    return { user: userData, firebaseUser };
  } catch (error: any) {
    // Don't throw error if user intentionally closed the popup
    if (error.code === 'auth/popup-closed-by-user') {
      // Return a special error that can be handled silently
      throw new Error('POPUP_CLOSED');
    }
    throw new Error(getAuthErrorMessage(error.code || error.message));
  }
};

// Sign Out
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  } catch (error: any) {
    throw new Error('Failed to sign out');
  }
};

// Get current user
export const getCurrentFirebaseUser = (): User | null => {
  return auth.currentUser;
};

// Auth state observer
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Password Reset
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code));
  }
};

// Helper function to convert Firestore Timestamp to Date
const convertTimestampToDate = (value: unknown): Date | unknown => {
  if (value && typeof value === 'object' && 'toDate' in value && typeof (value as { toDate: () => Date }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate();
  }
  return value;
};

// Get user data from Firestore
export const getUserData = async (uid: string): Promise<UserData | null> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const data = userSnap.data() as UserData;
      
      // Convert Firestore Timestamps to Date objects for Redux compatibility
      const convertedData: UserData = {
        ...data,
        birthdate: convertTimestampToDate(data.birthdate) as Date | undefined,
        lastPeriodStart: convertTimestampToDate(data.lastPeriodStart) as Date | undefined,
        createdAt: convertTimestampToDate(data.createdAt) as Date | undefined,
        updatedAt: convertTimestampToDate(data.updatedAt) as Date | undefined,
      };
      
      return convertedData;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

// Helper function to convert Firebase error codes to user-friendly messages
const getAuthErrorMessage = (errorCode?: string): string => {
  if (!errorCode) {
    return 'An error occurred during authentication. Please try again.';
  }
  
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please sign in instead.';
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/popup-closed-by-user':
      return 'POPUP_CLOSED'; // Special code for silent handling
    case 'auth/cancelled-popup-request':
      return 'Please wait for the current sign-in to complete.';
    case 'auth/popup-blocked':
      return 'Popup was blocked. Please allow popups for this site and try again.';
    default:
      return 'An error occurred during authentication. Please try again.';
  }
};

