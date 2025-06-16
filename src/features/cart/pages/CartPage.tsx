import { useState } from 'react';
import { CartCard } from '../components/CartCard';
import { useCart } from '../hooks/useCart';

import './CartPage.scss';
import CreditCardModal from '../components/CreditCardModal';
import { useProductCart } from '../../../hooks/useProductCart';

const CartPage = () => {
    const [showCreditCardModal, setShowCreditCardModal] = useState(false);
    const { cartItemsList, totalPayment, handleDeleteToCart, handleDeleteOneItem} = useCart();
    const { handleAddToCart } = useProductCart();

    return (
        <main className="cart-page">
            <header className="cart-page-title">🛒 Tu Carrito</header>

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
                        Total a pagar: <span>${totalPayment.toLocaleString()}</span>
                    </p>
                </section>
                <button
                    className='cart-footer-payment-button'
                    onClick={() => {setShowCreditCardModal(true)}}
                >
                    Pagar con tarjeta de crédito
                </button>
            </footer>
            {showCreditCardModal && (
                <CreditCardModal onClose={() => {setShowCreditCardModal(false)}}/>
            )}
        </main>
    );
};

export default CartPage;
