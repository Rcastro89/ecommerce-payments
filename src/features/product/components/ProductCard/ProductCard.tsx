import { useDispatch } from "react-redux";

import type { Product } from "../../../../types/product";
import { addToCart } from "../../../../slices/cart/cartSlice";
import { decreaseStock } from "../../../../slices/products/productsSlice";
import testImage from "../../../../assets/products/test1.jpg";

import "./ProductCard.scss";

interface ProductCardProps {
    product: Product;
}

export const ProductCard = ({
    product,
}: ProductCardProps) => {
    const dispatch = useDispatch();
    const { name, price, stock } = product;

    const handleAddToCart = () => {
        if (stock > 0) {
            dispatch(addToCart(product));
            dispatch(decreaseStock(product.idProduct));
        } else {
            alert("Producto sin stock");
        }
    };

    return (
        <article className="product-card">
            <img
                src={testImage}
                alt={name}
                className="product-image" />
            <div className="product-title">{name}</div>
            <p className="product-price">COP {price.toLocaleString()}</p>
            <div className="product-button">
                <p>Stock: {stock}</p>
                <button onClick={handleAddToCart} disabled={stock === 0}>
                    +🛒
                </button>
            </div>
        </article>
    );
};
