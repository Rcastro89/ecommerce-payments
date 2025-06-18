import type { RootState } from '../../../app/store';

export const getAllProducts = (state: RootState) =>
  state.products.items;