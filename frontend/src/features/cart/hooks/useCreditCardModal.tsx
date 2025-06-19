import { useState } from "react";
import { formatCardNumber, formatExpireDate, getCardType } from "../utils/cartUtils";
import type { FormCardData } from "../../../types/cartItem";

export const useCreditCardModal = (onClose: () => void) => {
    const [showSummary, setShowSummary] = useState(false);
    const [formData, setFormData] = useState<FormCardData>({
        cardNumber: '',
        expiry: '',
        cvv: '',
        cardHolder: '',
        address: '',
        installments: '',
    });
    const [formErrors, setFormErrors] = useState<FormCardData>({
        cardNumber: '',
        expiry: '',
        cvv: '',
        cardHolder: '',
        address: '',
        installments: '',
    });

    const cardType = getCardType(formData.cardNumber);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let formattedValue: string;
        switch (name) {
            case 'expiry':
                formattedValue = formatExpireDate(value);
                break;
            case 'cardNumber':
                formattedValue = formatCardNumber(value);
                break;
            case 'cvv':
                formattedValue = value.replace(/\D/g, '');
                break;
            case 'cardHolder':
                formattedValue = value.replace(/[^a-zA-Z\s]/g, '').toUpperCase();
                break;
            default:
                formattedValue = value;
                break
        };

        setFormErrors(prev => ({ ...prev, [name]: '' }));
        setFormData(prev => ({ ...prev, [name]: formattedValue }));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.cardNumber.length < 19 ||
            formData.expiry.length < 5 ||
            formData.cvv.length < 3 ||
            !formData.cardHolder ||
            !formData.installments) {
            setFormErrors({
                cardNumber: formData.cardNumber.length < 19 ? '* Número de tarjeta completo es requerido' : '',
                expiry: formData.expiry.length < 5 ? '* Fecha de expiración es requerida' : '',
                cvv: formData.cvv.length < 3 ? '* CVV es requerido' : '',
                cardHolder: !formData.cardHolder ? '* Nombre del titular es requerido' : '',
                installments: formData.installments ? '' : '* Cantidad de cuotas es requerido',
            });
           return;
        }

        setShowSummary(true);
    };

    const handleClose = () => {
        onClose();
    }

    return {
        formData,
        formErrors,
        cardType,
        showSummary,
        handleChange,
        handleSubmit,
        handleClose,
        setShowSummary
    }
}