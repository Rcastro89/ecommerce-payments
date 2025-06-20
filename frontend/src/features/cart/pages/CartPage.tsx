import { useState } from 'react';
import { CartCard } from '../components/CartCard';
import { useCart } from '../hooks/useCart';

import { useProductCart } from '../../../hooks/useProductCart';
import { PaymentModal } from '../../payment/modals/PaymentModal';

import './CartPage.scss';

const CartPage = () => {
    const [showPaymentModalModal, setShowPaymentModalModal] = useState(false);
    const { cartItemsList, subtotalPayment, handleDeleteToCart, handleDeleteOneItem, handleDeleteToCartAll} = useCart();
    const { handleAddToCart } = useProductCart();

    const handlecontinue = () => {
        if (cartItemsList.length === 0) {
            return;
        }
        setShowPaymentModalModal(true);
    }

    return (
        <main className="cart-page">
            <header className="cart-page-title"><span>🛒 Tu Carrito</span><button onClick={handleDeleteToCartAll}>🗑️</button></header>

            <section className="cart-page-content">
                {cartItemsList.length === 0 ? (
                    <p>No tienes productos en el carrito.</p>
                ) : (
                    <CartCard
                        cartItems={cartItemsList}
                        deleteAllItem={handleDeleteToCart}
                        deleteOneItem={handleDeleteOneItem}
                        addOneItem={handleAddToCart}
                    />
                )}
            </section>

            <footer className="cart-footer">
                <section>
                    <p className="cart-footer-text">
                        Total de productos: {cartItemsList.reduce((total, item) => total + item.quantity, 0)}
                    </p>
                    <p className="cart-footer-text">
                        Total a pagar: <span>${subtotalPayment.toLocaleString()}</span>
                    </p>
                </section>
                <button
                    className='cart-footer-payment-button'
                    onClick={handlecontinue}
                >
                    Pagar con tarjeta de crédito
                </button>
            </footer>
            {showPaymentModalModal && (
                <PaymentModal onClose={() => {setShowPaymentModalModal(false)}}/>
            )}
        </main>
    );
};

export default CartPage;
