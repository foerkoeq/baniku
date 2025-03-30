// start of frontend/store/index.tsx
import { configureStore } from '@reduxjs/toolkit';
import themeConfigReducer from './themeConfigSlice';
import userReducer, { UserState } from './userSlice';

export const store = configureStore({
    reducer: {
        themeConfig: themeConfigReducer,
        user: userReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export interface IRootState {
    themeConfig: ReturnType<typeof themeConfigReducer>;
    user: UserState;
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
// end of frontend/store/index.tsx