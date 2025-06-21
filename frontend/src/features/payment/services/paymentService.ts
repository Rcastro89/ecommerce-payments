import type { CartItem } from "../../../types/cartItem";
import type { FormCustomerData } from "../../../types/customer";
import type { FormCardData } from "../../../types/payment";

const API_URL = " https://optimum-joint-whale.ngrok-free.app";

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

interface PaymentPayload {
    card: CardPayload,
    products: ProductPayload[];
    customer: FormCustomerData;
}

export async function postCheckout(cartItems: CartItem[], formCardData: FormCardData, formCustomerData: FormCustomerData) {
    const cardPayload: CardPayload = {
        number: formCardData.cardNumber.replace(/\s/g, ""),
        cvc: formCardData.cvv,
        exp_month: formCardData.expiry.slice(0, 2),
        exp_year: formCardData.expiry.slice(3, 5),
        card_holder: formCardData.cardHolder,
        installments: formCardData.installments,
    }
    const checkoutItems: ProductPayload[] = cartItems.map(item => ({
        idProduct: item.idProduct,
        quantity: item.quantity,
        unitPrice: item.price,
    }));

    const payload: PaymentPayload = {
        card: cardPayload,
        products: checkoutItems,
        customer: formCustomerData,
    };

    try {
        const response = await fetch(`${API_URL}/payment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'ngrok-skip-browser-warning': 'true',
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
