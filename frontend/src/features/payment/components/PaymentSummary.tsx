import { useCart } from "../../cart/hooks/useCart";

interface Props {
    goBack: () => void;
    sendPayment: () => void;
}

export const PaymentSummary = ({
    goBack,
    sendPayment,
}: Props) => {
    const { subtotalPayment, baseFee, deliveryFee, totalPayment, totalItems } = useCart();

    return (
        <>
            <header>
                <h2>Resumen del pago</h2>
            </header>
            <div className="body-data">
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