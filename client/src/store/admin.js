import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAdmin : false
}

const admin = createSlice({
    name:'admin',
    initialState,
    reducers : {
        adminStore : (state, action) => {
            state.admin = action.payload;
        }
    }
})

export const {adminStore} = admin.actions
export default admin.reducer