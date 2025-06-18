import { InputGroup } from './InputGroup';
import { useCreditCardModal, type FormCardData } from '../hooks/useCreditCardModal';
import { Backdrop } from '../../../components/Backdrop';
import { PaymentSummary } from './PaymentSummary';

import './CreditCardModal.scss';
import { useCheckout } from '../hooks/useCheckout';

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

    const { checkout, loading, error, success } = useCheckout();

    return (
        <Backdrop>
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
                                </fieldset>

                                <fieldset>
                                    <legend>Dirección de entrega</legend>

                                    < InputGroup
                                        nameInput="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        type="text"
                                        label="Dirección"
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
                            onClose={onClose}
                            goBack={() => {
                                setShowSummary(false); // Reset state to go back to the form
                            }}
                            sendPayment={checkout}
                        />
                    )}
                </article>
            </dialog>
        </Backdrop>
    );
};

export default CreditCardModal;
