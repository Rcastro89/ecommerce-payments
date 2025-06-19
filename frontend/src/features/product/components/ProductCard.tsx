import type { Product } from "../../../types/product";
import notFound from "../../../assets/products/notFound.png";
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
        description,
        imageUrl
    } = useProducts(product);

    const { handleAddToCart } = useProductCart();

    console.log("ProductCard render", imageUrl);
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
                    src={imageUrl}
                    alt={name}
                    className="product-image"
                    onError={(e) => {
                        const target = e.currentTarget;
                        target.onerror = null;
                        target.src = notFound;
                    }}
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
