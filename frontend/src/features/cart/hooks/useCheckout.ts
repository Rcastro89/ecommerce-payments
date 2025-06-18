import { useState } from "react";
import type { CartItem } from "../../../types/cartItem";
import { postCheckout } from "../services/checkoutService";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { selecTotalItems } from "../slices/selectors";

export function useCheckout() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const items: CartItem[] = useAppSelector(selecTotalItems);

    const checkout = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await postCheckout(items);
            setSuccess(true);
        } catch (err) {
            setError(`Ocurrió un error al procesar el pago. ${(err)}`);
        } finally {
            setLoading(false);
        }
    };

    return { checkout, loading, error, success };
}
