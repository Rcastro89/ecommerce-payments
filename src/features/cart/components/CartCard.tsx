import type { CartItem } from "../../../types/cartItem";
import testImage from "../../../assets/products/test1.jpg";

import "./CartCard.scss"
import { calculateTotalForProduct } from "../utils/cartUtils";

interface CartCardProps {
    cartItems: CartItem[];
    deleteItem: (product: CartItem) => void;
}

export const CartCard = ({ cartItems, deleteItem }: CartCardProps) => {
    return (
        <ul className="cart-items">
            {cartItems.map((item) => (
                <li key={item.idProduct} className="cart-item">
                    <img
                        src={testImage}
                        alt={item.name}
                        className="cart-item-image"
                    />
                    <div className="cart-item-description">
                        <strong className="cart-item-title">{item.name}</strong>
                        <section>
                            <p className="cart-item-price">Precio: ${calculateTotalForProduct(item.price, item.quantity).toLocaleString()}</p>
                            <p>Cantidad: {item.quantity}</p>
                        </section>
                    </div>
                    <button className="cart-trash" onClick={() => deleteItem(item)}>🗑️</button>
                </li>
            ))}
        </ul>
    )
}