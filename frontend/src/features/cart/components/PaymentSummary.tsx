import type { FormCardData } from "../../../types/cartItem";
import { useCart } from "../hooks/useCart";
import { InputGroup } from "./InputGroup";

interface Props {
    goBack: () => void;
    sendPayment: () => void;
    formData: FormCardData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const PaymentSummary = ({
    goBack,
    sendPayment,
    formData,
    handleChange
}: Props) => {
    const { subtotalPayment, baseFee, deliveryFee, totalPayment, totalItems } = useCart();

    return (
        <>
            <header>
                <h2>Resumen del pago</h2>
            </header>
            <div className="body-data">
                <fieldset>
                    <legend>Dirección de entrega</legend>

                    < InputGroup
                        nameInput="address"
                        value={formData.address ?? ''}
                        onChange={handleChange}
                        type="text"
                        label="Dirección"
                    />
                    < InputGroup
                        nameInput="phone"
                        value={formData.phone ?? ''}
                        onChange={handleChange}
                        type="text"
                        label="Teléfono"
                    />
                    < InputGroup
                        nameInput="email"
                        value={formData.email ?? ''}
                        onChange={handleChange}
                        type="text"
                        label="Correo electrónico"
                    />
                </fieldset>
                <fieldset>
                    <legend>Totales</legend>
                    <ul>
                        <li><span>Total de articulos:</span> <strong>{totalItems}</strong></li>
                        <li className="subtotal-li"><span>Subtotal: </span><strong>${subtotalPayment.toLocaleString('es-CO')}</strong></li>
                        <li><span>Tarifa base fija:</span> <strong>${baseFee.toLocaleString('es-CO')}</strong></li>
                        <li><span>Tarifa de entrega:</span> <strong>${deliveryFee.toLocaleString('es-CO')}</strong></li>
                        <li className="total-li"><span>Total del pedido:</span> <strong>${totalPayment.toLocaleString('es-CO')}</strong></li>
                    </ul>
                </fieldset>
            </div>
            <footer className="modal-buttons">
                <button type="button" onClick={() => {
                    sendPayment();
                }}>Pagar ahora</button>

                <button type="button" onClick={goBack}>Volver</button>
            </footer>
        </>
    )
}