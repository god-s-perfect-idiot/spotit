// API utilities for authentication using Firebase
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signInWithApple,
  logout as firebaseLogout,
  getCurrentFirebaseUser,
  getUserData,
  type UserData,
} from './firebaseAuth';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: UserData;
  message?: string;
}

// Login API function using Firebase
export const loginAPI = async (credentials: LoginRequest): Promise<AuthResponse> => {
  try {
    const { user, firebaseUser } = await signInWithEmail(credentials.email, credentials.password);
    
    // Get Firebase ID token
    const token = await firebaseUser.getIdToken();
    
    // Store auth token and user data
    localStorage.setItem('authToken', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    return {
      success: true,
      token,
      user,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Login failed',
    };
  }
};

// Signup API function using Firebase
export const signupAPI = async (userData: SignupRequest): Promise<AuthResponse> => {
  try {
    if (userData.password !== userData.confirmPassword) {
      return {
        success: false,
        message: 'Passwords do not match',
      };
    }

    const { user, firebaseUser } = await signUpWithEmail(
      userData.email,
      userData.password
    );
    
    // Get Firebase ID token
    const token = await firebaseUser.getIdToken();
    
    // Store auth token and user data
    localStorage.setItem('authToken', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    return {
      success: true,
      token,
      user,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Signup failed',
    };
  }
};

// Google Sign In API function
export const googleSignInAPI = async (): Promise<AuthResponse> => {
  try {
    const { user, firebaseUser } = await signInWithGoogle();
    
    // Get Firebase ID token
    const token = await firebaseUser.getIdToken();
    
    // Store auth token and user data
    localStorage.setItem('authToken', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    return {
      success: true,
      token,
      user,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Google sign-in failed',
    };
  }
};

// Apple Sign In API function
export const appleSignInAPI = async (): Promise<AuthResponse> => {
  try {
    const { user, firebaseUser } = await signInWithApple();
    
    // Get Firebase ID token
    const token = await firebaseUser.getIdToken();
    
    // Store auth token and user data
    localStorage.setItem('authToken', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    return {
      success: true,
      token,
      user,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Apple sign-in failed',
    };
  }
};

// Logout function
export const logoutAPI = async (): Promise<{ success: boolean }> => {
  try {
    await firebaseLogout();
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const firebaseUser = getCurrentFirebaseUser();
  const token = localStorage.getItem('authToken');
  return !!firebaseUser || !!token;
};

// Get current user
export const getCurrentUser = async (): Promise<UserData | null> => {
  const firebaseUser = getCurrentFirebaseUser();
  if (firebaseUser) {
    const userData = await getUserData(firebaseUser.uid);
    if (userData) {
      localStorage.setItem('currentUser', JSON.stringify(userData));
      return userData;
    }
  }
  
  // Fallback to localStorage
  const storedUser = localStorage.getItem('currentUser');
  return storedUser ? JSON.parse(storedUser) : null;
};
