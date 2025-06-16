import { useState } from 'react';
import './CreditCardModal.scss';

interface Props {
    onClose: () => void;
}

const CreditCardModal = ({ onClose }: Props) => {
    const [formData, setFormData] = useState({
        cardNumber: '',
        expiry: '',
        cvv: '',
        cardHolder: '',
        address: '',
    });

    const getCardType = (number: string) => {
        const sanitized = number.replace(/\s/g, '');
        if (/^4/.test(sanitized)) return 'visa';
        if (/^5[1-5]/.test(sanitized)) return 'mastercard';
        return 'unknown';
    };

    const cardType = getCardType(formData.cardNumber);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('✅ Pago procesado correctamente.');
        onClose();
    };

    return (
        <dialog open className="credit-card-modal" aria-modal="true">
            <article>
                <header>
                    <h2>Formulario de Pago</h2>
                </header>

                <form onSubmit={handleSubmit}>
                    <fieldset>
                        <legend>Información de la tarjeta</legend>

                        <div className="input-group">
                            <label htmlFor="cardNumber">Número de tarjeta</label>
                            <input
                                id="cardNumber"
                                name="cardNumber"
                                type="text"
                                value={formData.cardNumber}
                                onChange={handleChange}
                                placeholder="#### #### #### ####"
                                required
                                maxLength={19}
                            />
                            {cardType !== 'unknown' && (
                                <img
                                    src={`/assets/${cardType}.png`}
                                    alt={`Logo ${cardType}`}
                                    className="card-logo"
                                />
                            )}
                        </div>

                        <div className="input-row">
                            <div className="input-group">
                                <label htmlFor="expiry">Expiración</label>
                                <input
                                    id="expiry"
                                    name="expiry"
                                    type="text"
                                    placeholder="MM/AA"
                                    value={formData.expiry}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="cvv">CVV</label>
                                <input
                                    id="cvv"
                                    name="cvv"
                                    type="text"
                                    maxLength={4}
                                    value={formData.cvv}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="cardHolder">Nombre del titular</label>
                            <input
                                id="cardHolder"
                                name="cardHolder"
                                type="text"
                                value={formData.cardHolder}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend>Dirección de entrega</legend>
                        <div className="input-group">
                            <label htmlFor="address">Dirección</label>
                            <textarea
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>
                    </fieldset>
                </form>
                <footer className="modal-buttons">
                    <button type="submit">Confirmar Pago</button>
                    <button type="button" onClick={onClose}>Cancelar</button>
                </footer>
            </article>
        </dialog>
    );
};

export default CreditCardModal;
