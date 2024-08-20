import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    cart: [
        {
            pizzaId: 12,
            name: 'Pepperoni',
            quantity: 2, 
            unitPrice: 16, 
            total: 32
        }
    ]
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem(state, action) {
            state.cart.push(action.payload);
        },
        deleteItem(state, action) {
            state.cart = state.cart.filter(item => item.pizzaId !== action.payload);
        },
        increaseItemQuantity(state, action) {
            const item = state.cart.find(item => item.pizzaId === action.payload)

            item.quantity++;
            item.totalPrice = item.quantity * item.totalPrice;
        },
        decreaseItemQuantity(state, action) {
            const item = state.cart.find(item => item.pizzaId === action.payload)

            item.quantity--;
            item.totalPrice = item.quantity * item.totalPrice;
        },
        clearCart(state) {
            state.cart = [];
        }
    }
})

export const { addItem, deleteItem, increaseItemQuantity, decreaseItemQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;