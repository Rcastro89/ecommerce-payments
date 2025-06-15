import { useDispatch, useSelector } from 'react-redux';
import { selecTotalItems } from '../../../slices/cart/selectors';
import { useState } from 'react';

import './CartPage.scss';
import { CartCard } from '../components/CartCard';
import { decreaseStock, increaseStock } from '../../../slices/products/productsSlice';
import type { CartItem } from '../../../types/cartItem';
import { removeFromCart } from '../../../slices/cart/cartSlice';

const CartPage = () => {
    const cartItems = useSelector(selecTotalItems);
    const dispatch = useDispatch();
    const [paymentType, setPaymentType] = useState<'efectivo' | 'tarjeta'>('efectivo');

    const handlePaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPaymentType(event.target.value as 'efectivo' | 'tarjeta');
    };

    const handleDeleteToCart = (product: CartItem) => {
            dispatch(removeFromCart(product.idProduct));
            for (let i = 0; i < product.quantity; i++){
                dispatch(increaseStock(product.idProduct));
            }
        };

    return (
        <main className="cart-page">
            <header className="cart-page-title">🛒 Tu Carrito</header>

            {cartItems.length === 0 ? (
                <p>No tienes productos en el carrito.</p>
            ) : (
                <CartCard 
                    cartItems={cartItems} 
                    deleteItem={handleDeleteToCart}
                    />
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
        </main>
    );
};

export default CartPage;
