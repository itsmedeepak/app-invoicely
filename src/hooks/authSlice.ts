import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    walkThrough:boolean;
}

interface AuthState {
    user: User | null;
    refreshToken: string | null;
    authToken: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    refreshToken: null,
    authToken: null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        signInSuccess: (state, action: PayloadAction<{ user: User; refreshToken: string; authToken: string }>) => {
            state.user = action.payload.user;
            state.refreshToken = action.payload.refreshToken;
            state.authToken = action.payload.authToken;
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.refreshToken = null;
            state.authToken = null;
            state.loading = false;
            state.error = null;
        },
    },
});

export const { signInStart, signInSuccess, signInFailure, logout } = authSlice.actions;
export default authSlice.reducer;
