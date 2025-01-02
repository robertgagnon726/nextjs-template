// import { GetUsersResponseDtoUser } from '@/generated/api-client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AppState {
  // user: GetUsersResponseDtoUser | null;
  user: unknown | null;
  drawerOpen: boolean;
  loadingCount: number;
}

const initialState: AppState = {
  user: null,
  drawerOpen: true,
  loadingCount: 0,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    incrementLoading: (state) => {
      state.loadingCount += 1;
    },
    decrementLoading: (state) => {
      state.loadingCount = Math.max(0, state.loadingCount - 1); // Prevent negative count
    },
    // setUser: (state, action: PayloadAction<GetUsersResponseDtoUser>) => {
    setUser: (state, action: PayloadAction<unknown>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null; // Clear user on logout
    },
    setDrawerOpen: (state, { payload }: PayloadAction<boolean>) => {
      state.drawerOpen = payload;
    },
  },
});

export const appActions = appSlice.actions;
export const appReducer = appSlice.reducer;
