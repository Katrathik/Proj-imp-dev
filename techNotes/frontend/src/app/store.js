import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from './api/apiSlice';
import { setupListeners } from "@reduxjs/toolkit/query"; // this refreshes screen if multiple ppl see the same screen to see updates if any at a controlled interval
import authReducer from "../features/auth/authSlice";

// create a store
export const store = configureStore({
    reducer: {
        // we are dynamically referring to the api slice here with the reducerPath
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth:authReducer,
    },
    middleware: getDefaultMiddleware =>
        // adding the api middleware here to default mware
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true // to enable redux dev tools for debugging redux errors in console
})

setupListeners(store.dispatch)