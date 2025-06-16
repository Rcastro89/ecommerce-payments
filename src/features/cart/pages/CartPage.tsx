import { CartCard } from '../components/CartCard';
import { useCart } from '../hooks/useCart';

import './CartPage.scss';

const CartPage = () => {
    const { cartItems, totalPayment, handleDeleteToCart} = useCart();

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
