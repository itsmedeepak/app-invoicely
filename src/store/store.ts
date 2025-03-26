import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../hooks/authSlice"

// Load auth state from localStorage
const loadState = () => {
    try {
        const serializedState = localStorage.getItem("authState");
        if (serializedState === null) return undefined;
        return { auth: JSON.parse(serializedState) };
    } catch (e) {
        console.warn("Could not load state", e);
        return undefined;
    }
};

// Save auth state to localStorage (only specific fields)
const saveState = (state: RootState) => {
    try {
        const { user, authToken, refreshToken } = state.auth;
        const serializedState = JSON.stringify({ user, authToken, refreshToken });
        localStorage.setItem("authState", serializedState);
    } catch (e) {
        console.warn("Could not save state", e);
    }
};

const preloadedState = loadState();

export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
    preloadedState,
});

store.subscribe(() => {
    saveState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
