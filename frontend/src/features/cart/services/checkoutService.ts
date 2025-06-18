import type { CartItem } from "../../../types/cartItem";

const API_URL = import.meta.env.VITE_API_PRODUCTS;

interface CheckoutItem {
    idProduct: number;
    quantity: number;
}

export async function postCheckout(cartItems: CartItem[]) {
    const checkoutItems: CheckoutItem[] = cartItems.map(item => ({
        idProduct: item.idProduct,
        quantity: item.quantity,
    }));

    try {
        const response = await fetch(`${API_URL}/checkout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ products: checkoutItems }),
        });

        if (!response.ok) {
            throw new Error("Error en el checkout");
        }

        return await response.json();
    } catch (error) {
        console.error("Error en checkoutService:", error);
        throw error;
    }
}
