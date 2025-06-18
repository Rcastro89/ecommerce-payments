import type { Product } from "../../../types/product";
import testImage from "../../../assets/products/test1.jpg";
import { useProducts } from "../hooks/useProducts";

import "./ProductCard.scss";
import { useProductCart } from "../../../hooks/useProductCart";

interface ProductCardProps {
    product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
    const {
        cardRef,
        showTooltip,
        handleMouseEnter,
        handleMouseLeave,
        handleTouchStart,
        name,
        price,
        stock,
        description
    } = useProducts(product);

    const { handleAddToCart } = useProductCart();

    return (
        <article
            ref={cardRef}
            className="product-card"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
        >
            <div className="card-content">
                <img
                    src={testImage}
                    alt={name}
                    className="product-image"
                />

                <div className="product-title">{name}</div>
                <p className="product-price">COP {price.toLocaleString()}</p>

                <div className="product-button">
                    <p>Stock: {stock}</p>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product)
                        }}
                        onTouchStart={(e) => e.stopPropagation()}
                        disabled={stock === 0}>
                        +🛒
                    </button>
                </div>
            </div>

            {showTooltip && (
                <div
                    className="product-tooltip"
                >
                    <strong>{name}</strong>
                    <p>{description}</p>
                </div>
            )}
        </article>
    );
};
