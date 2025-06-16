import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { selecTotalItems } from '../../../slices/cart/selectors';
import { CartCard } from '../components/CartCard';
import { increaseStock } from '../../../slices/products/productsSlice';
import type { CartItem } from '../../../types/cartItem';
import { removeFromCart } from '../../../slices/cart/cartSlice';

import './CartPage.scss';

const CartPage = () => {
    const cartItems = useSelector(selecTotalItems);
    const dispatch = useDispatch();
    const [totalPayment, setTotalPayment] = useState<number>(0);


    const handleDeleteToCart = (product: CartItem) => {
        dispatch(removeFromCart(product.idProduct));
        for (let i = 0; i < product.quantity; i++) {
            dispatch(increaseStock(product.idProduct));
        }
    };

    useEffect(() => {
        const total = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        setTotalPayment(total);
    }, [cartItems]);

    return (
        <main className="cart-page">
            <header className="cart-page-title">🛒 Tu Carrito</header>

            <section className="cart-page-content">
                {cartItems.length === 0 ? (
                    <p>No tienes productos en el carrito.</p>
                ) : (
                    <CartCard
                        cartItems={cartItems}
                        deleteItem={handleDeleteToCart}
                    />
                )}
            </section>

            <footer className="cart-footer">
                <section>
                    <p className="cart-footer-text">
                        Total de productos: {cartItems.reduce((total, item) => total + item.quantity, 0)}
                    </p>
                    <p className="cart-footer-text">
                        Total a pagar: <p>${totalPayment.toLocaleString()}</p>
                    </p>
                </section>
                <button
                    className='cart-footer-payment-button'
                    onClick={() => {}}
                >
                    Pagar con tarjeta de crédito
                </button>
            </footer>
        </main>
    );
};

export default CartPage;
