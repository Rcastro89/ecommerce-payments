import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../types/product';
import { products } from '../../data/products';

interface ProductsState {
  items: Product[];
}

const initialState: ProductsState = {
  items: products
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    decreaseStock(state, action: PayloadAction<number>) {
      const product = state.items.find(p => p.idProduct === action.payload);
      if (product && product.stock > 0) {
        product.stock -= 1;
      }
    },

    increaseStock(state, action: PayloadAction<number>) {
      const product = state.items.find(p => p.idProduct === action.payload);
      if (product) {
        product.stock += 1;
      }
    },

    resetProducts(state) {
      state.items = [...products];
    }
  },
});

export const { decreaseStock, increaseStock, resetProducts } = productSlice.actions;
export default productSlice.reducer;
