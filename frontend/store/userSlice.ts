// start of frontend/store/userSlice.ts
import { createSlice } from '@reduxjs/toolkit';

export interface IUser {
    id: string;
    username: string;
    email: string;
    role: 'SUPER_ADMIN' | 'ADMIN_BANI' | 'ADMIN_KELUARGA' | 'MEMBER';
    person?: {
        id: string;
        fullName: string;
        baniId: string;
    };
}

interface UserState {
    user: IUser | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: UserState = {
    user: null,
    isLoading: false,
    error: null
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isLoading = false;
            state.error = null;
        },
        clearUser: (state) => {
            state.user = null;
            state.isLoading = false;
            state.error = null;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        }
    }
});

export const { setUser, clearUser, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;
// end of frontend/store/userSlice.ts