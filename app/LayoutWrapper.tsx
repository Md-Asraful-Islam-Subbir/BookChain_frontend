'use client'
import { persistor, store } from '../store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import BookLoader from '@/lib/BookLoader';
import { Toaster } from 'react-hot-toast';
import AuthCheck from '@/store/Provider/AuthProvider';
export const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <Provider store={store}>
            <PersistGate loading={<BookLoader />} persistor={persistor}>
                <Toaster />
                <AuthCheck>
                    {children}
                </AuthCheck>
            </PersistGate>
        </Provider>
    );
};
