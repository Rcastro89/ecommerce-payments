import { useSelector } from 'react-redux';
import { selecTotalItems } from '../../slices/cart/selectors';
import { useState } from 'react';

const CartPage = () => {
    const cartItems = useSelector(selecTotalItems);
    const [paymentType, setPaymentType] = useState<'efectivo' | 'tarjeta'>('efectivo');

    const handlePaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPaymentType(event.target.value as 'efectivo' | 'tarjeta');
    };

    return (
        <div className="cart-page">
            <h2>🛒 Tu Carrito</h2>

            {cartItems.length === 0 ? (
                <p>No tienes productos en el carrito.</p>
            ) : (
                <ul className="cart-items">
                    {cartItems.map((item) => (
                        <li key={item.idProduct} className="cart-item">
                            <div>
                                <strong>{item.name}</strong>
                            </div>
                            <div>
                                <p>Precio: ${item.price.toLocaleString()}</p>
                                <p>Cantidad: {item.quantity}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <hr />

            <div className="payment-options">
                <h3>Selecciona el método de pago:</h3>
                <label>
                    <input
                        type="radio"
                        name="paymentType"
                        value="efectivo"
                        checked={paymentType === 'efectivo'}
                        onChange={handlePaymentChange}
                    />{" "}
                    Efectivo
                </label>
                <label>
                    <input
                        type="radio"
                        name="paymentType"
                        value="tarjeta"
                        checked={paymentType === 'tarjeta'}
                        onChange={handlePaymentChange}
                    />{" "}
                    Tarjeta de crédito
                </label>
            </div>
        </div>
    );
};

export default CartPage;
