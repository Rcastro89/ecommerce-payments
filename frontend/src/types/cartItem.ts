import type { Product } from "./product";

export interface CartItem extends Product {
  quantity: number;
}

export interface FormCardData {
    cardNumber: string;
    expiry: string;
    cvv: string;
    cardHolder: string;
    address?: string;
    installments: string;
    phone?: string;
    email?: string;
}