import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore,FLUSH,REHYDRATE,PAUSE,PURGE,PERSIST,REGISTER } from "redux-persist";
import userReducer from "./slice/userSlice";
import { api } from "./api";

//persist configuration for user
const userPersistConfig = {
    key: "user",
    storage,
    whitelist: ["user", "isEmailVerified", "isLoggedIn"],
};

//wrap reducer with persist config
const persistedUserReducer = persistReducer(
userPersistConfig,userReducer);

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        user: persistedUserReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(api.middleware),
});
//setup listeners for refetching on focus or reconnect
setupListeners(store.dispatch);

//create persistor
export const persistor = persistStore(store);
//types for state and dispatch
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
