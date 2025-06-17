import { InputGroup } from './InputGroup';
import { useCreditCardModal, type FormCardData } from '../hooks/useCreditCardModal';

import './CreditCardModal.scss';

interface Props {
    onClose: () => void;
}

const CreditCardModal = ({ onClose }: Props) => {
    const {handleSubmit, formData, handleChange, formErrors, cardType} = useCreditCardModal(onClose);

    return (
        <dialog open className="credit-card-modal" aria-modal="true">
            <article>
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
                            errorMessage={formErrors.cardNumber}
                        >
                            {cardType !== 'unknown' && (
                                <img
                                    src={`/assets/${cardType}.png`}
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
                                errorMessage={formErrors.expiry}
                            />
                            < InputGroup
                                nameInput="cvv"
                                value={formData.cvv}
                                onChange={handleChange}
                                placeholder="CVV"
                                type="text"
                                maxLength={4}
                                label="CVV"
                                errorMessage={formErrors.cvv}
                            />
                        </div>

                        < InputGroup
                            nameInput="cardHolder"
                            value={formData.cardHolder}
                            onChange={handleChange}
                            type="text"
                            maxLength={30}
                            label="Nombre del titular"
                            errorMessage={formErrors.cardHolder}
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
                            errorMessage={formErrors.address}
                        />
                    </fieldset>
                </form>
                <p>
                    {Object.keys(formErrors).map(key => {
                        const value = formErrors[key as keyof FormCardData];
                        return value ? <span key={key} className="error-message">{value}<br /></span> : null;
                    })}
                </p>
                <footer className="modal-buttons">
                    <button form="payment-form" type="submit">Confirmar Pago</button>
                    <button type="button" onClick={onClose}>Cancelar</button>
                </footer>
            </article>
        </dialog>
    );
};

export default CreditCardModal;
