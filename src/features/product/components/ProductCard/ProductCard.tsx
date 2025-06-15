import { useDispatch } from "react-redux";

import type { Product } from "../../../../types/product";
import { addToCart } from "../../../../slices/cart/cartSlice";

import "./ProductCard.scss";
import { decreaseStock } from "../../../../slices/products/productsSlice";

interface ProductCardProps {
    product: Product;
}

export const ProductCard = ({
    product,
}: ProductCardProps) => {
    const dispatch = useDispatch();
    const { name, description, price, stock} = product;

    const handleAddToCart = () => {
        if (stock > 0) {
            dispatch(addToCart(product));
            dispatch(decreaseStock(product.idProduct));
        } else {
            alert("Producto sin stock");
        }
    };

    return (
        <div className="card">
            <h2>{name}</h2>
            <p>{description}</p>
            <p className="price">COP {price.toLocaleString()}</p>
            <p>Stock: {stock}</p>
            <button onClick={handleAddToCart } disabled={stock === 0}>
                + Agregar al carrito
            </button>
        </div>
    );
};
