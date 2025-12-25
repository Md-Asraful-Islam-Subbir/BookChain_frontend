'use client'
import {persistor, store} from '../store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import BookLoader from '@/lib/BookLoader';
import {Toaster} from 'react-hot-toast';
export const LayoutWrapper = ({children}: {children: React.ReactNode}) => {
    return (
        <Provider store={store}>
            <PersistGate loading={<BookLoader/>} persistor={persistor}>
            <Toaster/>
                {children}
            </PersistGate>
        </Provider>
    );
};
