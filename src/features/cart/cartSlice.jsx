import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    cart: []
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem(state, action) {
            state.cart.push({ ...action.payload, totalPrice: action.payload.quantity * action.payload.total });
        },
        deleteItem(state, action) {
            state.cart = state.cart.filter(item => item.pizzaId !== action.payload);
        },
        increaseItemQuantity(state, action) {
            const item = state.cart.find(item => item.pizzaId === action.payload)

            item.quantity++;
            item.totalPrice = item.quantity * item.total;
        },
        decreaseItemQuantity(state, action) {
            const item = state.cart.find(item => item.pizzaId === action.payload)

            item.quantity--;
            item.totalPrice = item.quantity * item.total;

            if (item.quantity === 0) cartSlice.caseReducers.deleteItem(state, action)
        },
        clearCart(state) {
            state.cart = [];
        }
    }
})

export const { addItem, deleteItem, increaseItemQuantity, decreaseItemQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;

export const getCart = (state) => state.cart.cart;

export const getCurrenQuantityById = id => state => state.cart.cart.find(item => item.pizzaId === id)?.quantity ?? 0;