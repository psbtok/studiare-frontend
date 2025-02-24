import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Lesson } from '@/models/models';

interface AppState {
  refreshListItem: boolean;
  updatedLesson: Lesson | null; // Nullable in case no lesson is set initially
}

const initialState: AppState = {
  refreshListItem: false,
  updatedLesson: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleRefresh: (state) => {
      state.refreshListItem = !state.refreshListItem;
    },
    setUpdateLesson: (state, action: PayloadAction<Lesson>) => {
      state.updatedLesson = action.payload; // Update lesson with the provided value
    },
    clearUpdateLesson: (state) => {
      state.updatedLesson = null; // Clear lesson when needed
    },
  },
});

export const { toggleRefresh, setUpdateLesson, clearUpdateLesson } = appSlice.actions;

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
  },
});

// Infer RootState and AppDispatch from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
