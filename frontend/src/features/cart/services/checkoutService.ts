import type { CartItem, FormCardData } from "../../../types/cartItem";

const API_URL = import.meta.env.VITE_API_PRODUCTS;

interface ProductPayload {
    idProduct: number;
    quantity: number;
    unitPrice: number;
}

interface CardPayload {
    number: string
    cvc: string,
    exp_month: string,
    exp_year: string,
    card_holder: string
    installments: string;
}

interface CustomerPayload {
    address?: string;
    phone?: string;
    email?: string;
}

interface PaymentPayload {
    card: CardPayload,
    products: ProductPayload[];
    customer: CustomerPayload;
}

export async function postCheckout(cartItems: CartItem[], formData: FormCardData) {
    const customerPayload: CustomerPayload = {
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
    };
    const cardPayload: CardPayload = {
        number: formData.cardNumber.replace(/\s/g, ""),
        cvc: formData.cvv,
        exp_month: formData.expiry.slice(0, 2),
        exp_year: formData.expiry.slice(3, 5),
        card_holder: formData.cardHolder,
        installments: formData.installments,
    }
    const checkoutItems: ProductPayload[] = cartItems.map(item => ({
        idProduct: item.idProduct,
        quantity: item.quantity,
        unitPrice: item.price,
    }));

    const payload: PaymentPayload = {
        card: cardPayload,
        products: checkoutItems,
        customer: customerPayload,
    };

    try {
        const response = await fetch(`${API_URL}/payment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
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
