/**
 * Central Firestore-backed state for the main app shell (anything under Layout).
 *
 * Pattern for new remote reads:
 * 1. Extend `AppDataState` + initial state.
 * 2. Load inside `initializeAppData` (parallelize with Promise.all when sensible).
 * 3. Read via `useAppSelector` in pages; avoid one-off Firestore calls for the same data.
 * 4. After writes, dispatch the matching setter (e.g. `setTodayPeriodLog`) or add a small refresh thunk.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { getLatestPeriodLogForLocalDay, type TodayPeriodLog } from '../utils/periodLogs';
import { whenAuthReady } from '../utils/firebaseAuth';
import { checkAuthState, logout } from './authSlice';

export type AppDataStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface AppDataState {
  status: AppDataStatus;
  error: string | null;
  /** Latest `period_logs` doc for the user for the current local calendar day, if any. */
  todayPeriodLog: TodayPeriodLog | null;
}

const initialState: AppDataState = {
  status: 'idle',
  error: null,
  todayPeriodLog: null,
};

export const initializeAppData = createAsyncThunk(
  'appData/initializeAppData',
  async (_, { rejectWithValue }) => {
    try {
      await whenAuthReady();
      const todayPeriodLog = await getLatestPeriodLogForLocalDay();
      return { todayPeriodLog };
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to load app data';
      return rejectWithValue(message);
    }
  }
);

const appDataSlice = createSlice({
  name: 'appData',
  initialState,
  reducers: {
    resetAppData: () => initialState,
    setTodayPeriodLog: (state, action: PayloadAction<TodayPeriodLog | null>) => {
      state.todayPeriodLog = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAppData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(initializeAppData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.todayPeriodLog = action.payload.todayPeriodLog;
      })
      .addCase(initializeAppData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) ?? 'Failed to load app data';
        state.todayPeriodLog = null;
      })
      .addCase(logout.fulfilled, () => initialState)
      .addCase(checkAuthState.fulfilled, (state, action) => {
        if (!action.payload) {
          return initialState;
        }
        return state;
      });
  },
});

export const { resetAppData, setTodayPeriodLog } = appDataSlice.actions;
export default appDataSlice.reducer;
