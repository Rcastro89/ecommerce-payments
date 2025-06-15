import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../slices/cart/cartSlice';
import productsReducer from '../slices/products/productsSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
