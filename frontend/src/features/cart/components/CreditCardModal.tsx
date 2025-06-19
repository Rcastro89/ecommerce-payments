import { InputGroup } from './InputGroup';
import { useCreditCardModal } from '../hooks/useCreditCardModal';
import type { FormCardData } from '../../../types/cartItem';
import { Backdrop } from '../../../components/Backdrop';
import { PaymentSummary } from './PaymentSummary';

import './CreditCardModal.scss';
import { useCheckout } from '../hooks/useCheckout';
import { FullscreenLoader } from '../../../components/FullscreenLoader';
import { useEffect } from 'react';

interface Props {
    onClose: () => void;
}

const CreditCardModal = ({ onClose }: Props) => {
    const { 
        formData, 
        formErrors, 
        cardType, 
        showSummary, 
        handleSubmit, 
        handleChange, 
        setShowSummary 
    } = useCreditCardModal(onClose);

    const { checkout, loading, status } = useCheckout();
    useEffect(() => {
        if (status === 'success' && !loading) {
            onClose();
        }
    }, [status, loading])

    return (
        <Backdrop>
            {loading && <FullscreenLoader status={status} />}
            <dialog open className="credit-card-modal" aria-modal="true">
                <article>
                    {!showSummary ? (
                        <>
                            <header>
                                <h2>Formulario de Pago</h2>
                            </header>

                            <form id="payment-form" onSubmit={handleSubmit}>
                                <fieldset>
                                    <legend>Información de la tarjeta</legend>

                                    <InputGroup
                                        nameInput="cardNumber"
                                        value={formData.cardNumber}
                                        onChange={handleChange}
                                        inputMode="numeric"
                                        placeholder="#### #### #### ####"
                                        type="text"
                                        label="Número de tarjeta"
                                        maxLength={19}
                                    >
                                        {cardType !== 'unknown' && (
                                            <img
                                                src={`/assets/cardIcons/${cardType}.png`}
                                                alt={`Logo ${cardType}`}
                                                className="card-logo"
                                            />
                                        )}
                                    </InputGroup>

                                    <div className="input-row">
                                        < InputGroup
                                            nameInput="expiry"
                                            value={formData.expiry}
                                            onChange={handleChange}
                                            placeholder="MM/AA"
                                            type="text"
                                            label="Expiración"
                                            inputMode='text'
                                            maxLength={5}
                                        />
                                        < InputGroup
                                            nameInput="cvv"
                                            value={formData.cvv}
                                            onChange={handleChange}
                                            placeholder="CVV"
                                            type="text"
                                            maxLength={4}
                                            label="CVV"
                                        />
                                    </div>

                                    < InputGroup
                                        nameInput="cardHolder"
                                        value={formData.cardHolder}
                                        onChange={handleChange}
                                        type="text"
                                        maxLength={30}
                                        label="Nombre del titular"
                                    />
                                    < InputGroup
                                        nameInput="installments"
                                        value={formData.installments}
                                        onChange={handleChange}
                                        type="text"
                                        maxLength={2}
                                        label="Cuotas"
                                    />
                                </fieldset>

                                <p>
                                    {Object.keys(formErrors).map(key => {
                                        const value = formErrors[key as keyof FormCardData];
                                        return value ? <span key={key} className="error-message">{value}<br /></span> : null;
                                    })}
                                </p>
                            </form>
                            <footer className="modal-buttons">
                                <button form="payment-form" type="submit">Confirmar Pago</button>
                                <button type="button" onClick={onClose}>Cancelar</button>
                            </footer>
                        </>
                    ) : (
                        <PaymentSummary
                            goBack={() => {
                                setShowSummary(false);
                            }}
                            sendPayment={() => {checkout(formData)}}
                            formData={formData}
                            handleChange={handleChange}
                        />
                    )}
                </article>
            </dialog>
        </Backdrop>
    );
};

export default CreditCardModal;
