import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore,FLUSH,REHYDRATE,PAUSE,PURGE,PERSIST,REGISTER } from "redux-persist";
import userReducer from "./slice/userSlice";
import cartReducer from './slice/cartSlice';
import wishlistReducer from './slice/wishlistSlice';
import checkoutReducer from './slice/checkoutSlice';

import { api } from "./api";

//persist configuration for user
const userPersistConfig = {
    key: "user",
    storage,
    whitelist: ["user", "isEmailVerified", "isLoggedIn"],
};
//persist configuration for user
const cartPersistConfig = {
    key: "cart",
    storage,
    whitelist: ["items"],
};
//persist configuration for user
const wishlistPersistConfig = {
    key: "wishlist",
    storage,
};
const checkoutPersistConfig = {
    key: "checkout",
    storage,
};
//wrap reducer with persist config
const persistedUserReducer = persistReducer(userPersistConfig,userReducer);
const persistedCartReducer = persistReducer(cartPersistConfig,cartReducer);
const persistedWishlistReducer = persistReducer(wishlistPersistConfig,wishlistReducer);
const persistedCheckoutReducer = persistReducer(checkoutPersistConfig,checkoutReducer);

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        user: persistedUserReducer,
        cart:persistedCartReducer,
        wishlist:persistedWishlistReducer,
        checkout:persistedCheckoutReducer
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
