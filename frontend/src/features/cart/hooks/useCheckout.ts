import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { CartItem, FormCardData } from "../../../types/cartItem";
import { postCheckout } from "../services/checkoutService";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { selecTotalItems } from "../slices/selectors";

export function useCheckout() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    const items: CartItem[] = useAppSelector(selecTotalItems);
    const navigate = useNavigate();

    const checkout = async (formData: FormCardData) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await postCheckout(items, formData);
            if (response?.ok) {
                setSuccess(true);
                setTimeout(() => {navigate('/')}, 2000);
            }
            else if (response?.error) {
                setError(response.error.message ?? "Error desconocido en la compra");
            }
        } catch (err) {
            setError(`Ocurrió un error al procesar el pago. ${(err)}`);
        } finally {
            setTimeout(() => { setLoading(false) }, 2000);
        }
    };

    useEffect(() => {
        if (success) {
            setStatus('success');
        } else if (error) {
            setStatus('error');
        } else if (loading) {
            setStatus('loading');
        }
    }, [loading, error, success]);

    return { checkout, loading, status };
}
