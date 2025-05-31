import { configureStore } from '@reduxjs/toolkit';
import auth from './auth'
import admin from './admin';
import cart from './cart';

export const store = configureStore({
    reducer: {
        auth,
        admin,
        cart
    }
})

export default store