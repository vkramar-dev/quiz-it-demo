import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { appSlice } from './appSlice';
import { testSlice } from './testSlice';
import { topStatisticsSlice } from './topStatisticsSlice';
import { mistakesSlice } from './mistakesSlice';
import { profileSlice } from './profileSlice';

export const store = configureStore({
  reducer: {
    appState: appSlice.reducer,
    testState: testSlice.reducer,
    statState: topStatisticsSlice.reducer,
    mistakesState: mistakesSlice.reducer,
    profileState: profileSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;