import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CartItem } from '../../../types/cartItem';
import type { Product } from '../../../types/product';

export interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Product>) {
      const product = action.payload;
      const existing = state.items.find((item) => item.idProduct === product.idProduct);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter(item => item.idProduct !== action.payload);
    },
    removeOneFromCart(state, action: PayloadAction<number>) {
      const existing = state.items.find((item) => item.idProduct === action.payload);

      if (existing && existing.quantity > 1) {
        existing.quantity -= 1;
      } else if (existing) {
        state.items = state.items.filter(item => item.idProduct !== action.payload);
      }
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart, removeOneFromCart } = cartSlice.actions;
export default cartSlice.reducer;
