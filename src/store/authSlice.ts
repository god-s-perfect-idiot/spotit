import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signInWithApple,
  logout as firebaseLogout,
  getUserData,
  saveUserToFirestore,
  getCurrentFirebaseUser,
  type UserData,
} from '../utils/firebaseAuth';
import { updateUserData } from '../utils/userData';
import type { User } from 'firebase/auth';

export interface AuthState {
  user: UserData | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
};

// Async thunk for email/password login
export const loginWithEmail = createAsyncThunk(
  'auth/loginWithEmail',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const { user, firebaseUser } = await signInWithEmail(email, password);
      const token = await firebaseUser.getIdToken();
      return { user, token };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      return rejectWithValue(message);
    }
  }
);

// Async thunk for email/password signup
export const signupWithEmail = createAsyncThunk(
  'auth/signupWithEmail',
  async (
    { email, password, displayName }: { email: string; password: string; displayName?: string },
    { rejectWithValue }
  ) => {
    try {
      const { user, firebaseUser } = await signUpWithEmail(email, password, displayName);
      const token = await firebaseUser.getIdToken();
      return { user, token };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed';
      return rejectWithValue(message);
    }
  }
);

// Async thunk for Google sign in
export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      const { user, firebaseUser } = await signInWithGoogle();
      const token = await firebaseUser.getIdToken();
      return { user, token };
    } catch (error) {
      // Don't reject if popup was closed or redirect was initiated
      const message = error instanceof Error ? error.message : 'Google sign-in failed';
      if (message === 'POPUP_CLOSED' || message === 'REDIRECT_INITIATED') {
        return rejectWithValue(message);
      }
      return rejectWithValue(message);
    }
  }
);

// Async thunk for Apple sign in
export const loginWithApple = createAsyncThunk(
  'auth/loginWithApple',
  async (_, { rejectWithValue }) => {
    try {
      const { user, firebaseUser } = await signInWithApple();
      const token = await firebaseUser.getIdToken();
      return { user, token };
    } catch (error) {
      // Don't reject if popup was closed or redirect was initiated
      const message = error instanceof Error ? error.message : 'Apple sign-in failed';
      if (message === 'POPUP_CLOSED' || message === 'REDIRECT_INITIATED') {
        return rejectWithValue(message);
      }
      return rejectWithValue(message);
    }
  }
);

// Async thunk for logout
export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await firebaseLogout();
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Logout failed';
    return rejectWithValue(message);
  }
});

// Async thunk for checking auth state
export const checkAuthState = createAsyncThunk(
  'auth/checkAuthState',
  async (firebaseUser: User | null, { rejectWithValue }) => {
    if (!firebaseUser) {
      return null;
    }

    try {
      const token = await firebaseUser.getIdToken();
      let userData = await getUserData(firebaseUser.uid);
      
      if (!userData) {
        // If user data doesn't exist in Firestore, create it
        console.log('User document not found in Firestore, creating...');
        userData = await saveUserToFirestore(firebaseUser);
        console.log('User document created in Firestore:', userData);
      }

      return { user: userData, token };
    } catch (error) {
      console.error('Error in checkAuthState:', error);
      const message = error instanceof Error ? error.message : 'Failed to check auth state';
      return rejectWithValue(message);
    }
  }
);

// Async thunk for updating user data
export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (data: { birthdate?: Date; lastPeriodStart?: Date; cycleLength?: number | null; goal?: "track-cycle" | "get-pregnant" | "track-pregnancy" | "track-perimenopause"; healthConditions?: { predefined: string[]; custom: string[] }; [key: string]: unknown }, { rejectWithValue }) => {
    try {
      await updateUserData(data);
      
      // Fetch updated user data from Firestore
      const firebaseUser = getCurrentFirebaseUser();
      if (!firebaseUser) {
        throw new Error('No authenticated user');
      }

      const updatedUserData = await getUserData(firebaseUser.uid);
      if (!updatedUserData) {
        throw new Error('Failed to fetch updated user data');
      }

      return { user: updatedUserData };
    } catch (error) {
      console.error('Error updating user:', error);
      const message = error instanceof Error ? error.message : 'Failed to update user';
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setOnboardingComplete: (state) => {
      if (state.user) {
        state.user.completedOnboarding = true;
      }
    },
  },
  extraReducers: (builder) => {
    // Login with email
    builder
      .addCase(loginWithEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Signup with email
    builder
      .addCase(signupWithEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupWithEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signupWithEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Login with Google
    builder
      .addCase(loginWithGoogle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.isLoading = false;
        // Only set error if it's not a popup closed or redirect initiated message
        if (action.payload !== 'POPUP_CLOSED' && action.payload !== 'REDIRECT_INITIATED') {
          state.error = action.payload as string;
        }
      });

    // Login with Apple
    builder
      .addCase(loginWithApple.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithApple.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginWithApple.rejected, (state, action) => {
        state.isLoading = false;
        // Only set error if it's not a popup closed or redirect initiated message
        if (action.payload !== 'POPUP_CLOSED' && action.payload !== 'REDIRECT_INITIATED') {
          state.error = action.payload as string;
        }
      });

    // Logout
    builder
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Check auth state - don't set loading if we already have auth state (background refresh)
    builder
      .addCase(checkAuthState.pending, (state) => {
        // Only set loading if we don't have any auth state yet (initial load)
        if (!state.user && !state.isAuthenticated) {
          state.isLoading = true;
        }
      })
      .addCase(checkAuthState.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
        }
        state.error = null;
      })
      .addCase(checkAuthState.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });

    // Update user - don't show loading for background updates
    builder
      .addCase(updateUser.pending, (state) => {
        // Don't set loading for user updates - they're background operations
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setLoading, setOnboardingComplete } = authSlice.actions;
export default authSlice.reducer;

