import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { CartItem } from "../../../types/cartItem";
import type { FormCardData } from "../../../types/payment";
import { postCheckout } from "../services/paymentService";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { selecTotalItems } from "../../cart/slices/selectors";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { resetProducts } from "../../product/slices/productsSlice";
import { clearCart } from "../../cart/slices/cartSlice";
import type { FormCustomerData } from "../../../types/customer";

export function useCheckout() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    const items: CartItem[] = useAppSelector(selecTotalItems);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const checkout = async (formData: FormCardData, formCustomerData: FormCustomerData) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await postCheckout(items, formData, formCustomerData);
            if (response?.ok) {
                setSuccess(true);
                dispatch(resetProducts());
                dispatch(clearCart());
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
