import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState = {
    cart : []
}

const cart = createSlice({
    name : 'cart',
    initialState,
    reducers: {
        addCartStore : (state,action) => {
            if(!state.cart.includes(action.payload)){
                state.cart.push(action.payload);
                toast.success('Ürün sepete eklendi!');
            }else{
                toast.error('Ürün zaten sepette!');
            }
        },
        removeCartStore : (state, action) => {
            state.cart.pop(action.payload);
            toast.success('Ürün sepetten kaldırıldı!');
        },
        clearCartStore : (state, action) => {
            state.cart = [];
        }
    }
})

export const {addCartStore, removeCartStore, clearCartStore} = cart.actions
export default cart.reducer