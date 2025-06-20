import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../../types/product';
import { getProducts } from '../services/productService';

export interface ProductsState {
  items: Product[];
  isLoading: boolean;
  isLoaded: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  isLoading: false,
  isLoaded: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (_, thunkAPI) => {
    try {
      const products = await getProducts();
      return products;
    } catch (error) {
      return thunkAPI.rejectWithValue(`Error al cargar productos ${(error)}`);
    }
  }
);

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
      state.isLoaded = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.isLoading = false;
        state.isLoaded = true;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoaded = false;
        state.error = action.payload as string;
      });
  }
});

export const { decreaseStock, increaseStock, resetProducts } = productSlice.actions;
export default productSlice.reducer;
