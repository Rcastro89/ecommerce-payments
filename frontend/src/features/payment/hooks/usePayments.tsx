import { useState } from "react";
import { formatCardNumber, formatExpireDate, formatNumber, getCardType } from "../utils/paymentUtils";
import type { FormCardData } from "../../../types/payment";
import type { FormCustomerData } from "../../../types/customer";

export const usePayments = (onClose: () => void) => {
    const [showForm, setShowForm] = useState<'viewCard' | 'viewCustomer' | 'viewSummary'>('viewCard');
    const [formCardData, setFormCardData] = useState<FormCardData>({
        cardNumber: '',
        expiry: '',
        cvv: '',
        cardHolder: '',
        installments: '',
    });
    const [formCardErrors, setFormCardErrors] = useState<FormCardData>({
        cardNumber: '',
        expiry: '',
        cvv: '',
        cardHolder: '',
        installments: '',
    });
    const [formCustomerData, setFormCustomerData] = useState<FormCustomerData>({
        idClient: '',
        fullName: '',
        address: '',
        phone: '',
        email: '',
    });
    const [formCustomerErrors, setFormCustomerErrors] = useState<FormCustomerData>({
        idClient: '',
        fullName: '',
        address: '',
        phone: '',
        email: '',
    });

    const cardType = getCardType(formCardData.cardNumber);

    const handleChangeCardForm = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

        setFormCardErrors(prev => ({ ...prev, [name]: '' }));
        setFormCardData(prev => ({ ...prev, [name]: formattedValue }));
    }

    const handleSubmitCard = (e: React.FormEvent) => {
        e.preventDefault();
        if (formCardData.cardNumber.length < 19 ||
            formCardData.expiry.length < 5 ||
            formCardData.cvv.length < 3 ||
            !formCardData.cardHolder ||
            !formCardData.installments) {
            setFormCardErrors({
                cardNumber: formCardData.cardNumber.length < 19 ? '* Número de tarjeta completo es requerido' : '',
                expiry: formCardData.expiry.length < 5 ? '* Fecha de expiración es requerida' : '',
                cvv: formCardData.cvv.length < 3 ? '* CVV es requerido' : '',
                cardHolder: !formCardData.cardHolder ? '* Nombre del titular es requerido' : '',
                installments: !formCardData.installments ? '* Cantidad de cuotas es requerido' : '',
            });
           return;
        }

        setShowForm("viewCustomer");
    };

    const handleChangeCustomerForm = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;
        if (name === 'idClient') {
            formattedValue = formatNumber(value);
        };

        setFormCustomerErrors(prev => ({ ...prev, [name]: '' }));
        setFormCustomerData(prev => ({ ...prev, [name]: formattedValue }));
    }

    const handleSubmitCustomer = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formCustomerData.idClient ||
            !formCustomerData.address ||
            !formCustomerData.email ||
            !formCustomerData.fullName ||
            !formCustomerData.phone) {
            setFormCustomerErrors({
                idClient: !formCustomerData.idClient ? '* Número de cédula requerido' : '',
                fullName: !formCustomerData.fullName ? '* Nombre destinatario requerido' : '',
                address: !formCustomerData.address ? '* Dirección de entrega es requerida' : '',
                email: !formCustomerData.email ? '* Correo eléctronico es requerido' : '',
                phone: !formCustomerData.phone ? '* Teléfono es requerido' : '',
            });
           return;
        }

        setShowForm("viewSummary");
    };

    const handleClose = () => {
        onClose();
    }

    return {
        formCardData,
        formCardErrors,
        formCustomerData,
        formCustomerErrors,
        cardType,
        showForm,
        handleChangeCardForm,
        handleSubmitCard,
        handleChangeCustomerForm,
        handleSubmitCustomer,
        handleClose,
        setShowForm
    }
}