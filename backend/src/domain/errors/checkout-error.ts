// src/domain/errors/checkout-error.ts
export type CheckoutError =
  | { type: 'PRODUCT_NOT_FOUND'; id: number }
  | { type: 'OUT_OF_STOCK'; id: number };
