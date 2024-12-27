import { createSlice } from "@reduxjs/toolkit";
import {jwtDecode} from 'jwt-decode'

const initialState = {
    user: localStorage.getItem('token') ? jwtDecode(JSON.parse(localStorage.getItem('token'))) : null,
    comp: localStorage.getItem('stoken') ? jwtDecode(JSON.parse(localStorage.getItem('stoken'))) : null,
}

const auth = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStore : (state, action) => {
            localStorage.setItem('token', JSON.stringify(action.payload));
            const userToken = action.payload;
            const decodedToken = jwtDecode(userToken);
            state.user = decodedToken;
        },

        logoutStore : (state, action) => {
            localStorage.removeItem('token');
            state.user = null;
        },

        sellerLoginStore : (state, action) => {
            localStorage.setItem('stoken', JSON.stringify(action.payload));
            const compToken = action.payload;
            const decodedToken = jwtDecode(compToken);
            state.user = false;
            state.comp = decodedToken
        },

        sellerLogoutStore : (state,action) => {
            localStorage.removeItem('stoken');
            state.comp = false;
        }
    }
})

export const {loginStore, logoutStore, sellerLoginStore, sellerLogoutStore} = auth.actions
export default auth.reducer