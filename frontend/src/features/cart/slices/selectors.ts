import type { RootState } from "../../../app/store";

export const selectCartTotalItems = (state: RootState) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

export const selecTotalItems = (state: RootState) =>
  state.cart.items;