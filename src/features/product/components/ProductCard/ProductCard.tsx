import { useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";

import type { Product } from "../../../../types/product";
import { addToCart } from "../../../../slices/cart/cartSlice";
import { decreaseStock } from "../../../../slices/products/productsSlice";
import testImage from "../../../../assets/products/test1.jpg";

import "./ProductCard.scss";

interface ProductCardProps {
    product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
    const dispatch = useDispatch();
    const { name, price, stock, description } = product;

    const [showTooltip, setShowTooltip] = useState(false);
    const cardRef = useRef<HTMLElement>(null);
    const isTouchDevice = typeof window !== "undefined" &&
        ("ontouchstart" in window || navigator.maxTouchPoints > 0);

    const handleAddToCart = () => {
        if (stock > 0) {
            dispatch(addToCart(product));
            dispatch(decreaseStock(product.idProduct));
        } else {
            alert("Producto agotado");
        }
    };

    const handleMouseEnter = () => {
        if (!isTouchDevice) setShowTooltip(true);
    };

    const handleMouseLeave = () => {
        if (!isTouchDevice) setShowTooltip(false);
    };

    const handleTouchStart = () => {
        if (isTouchDevice) { setShowTooltip(prev => !prev) }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                cardRef.current &&
                !cardRef.current.contains(event.target as Node)
            ) {
                setShowTooltip(false);
            }
        };

        const handleTouchMove = () => {
            setShowTooltip(false);
        };

        if (showTooltip && isTouchDevice) {
            document.addEventListener("click", handleClickOutside);
            document.addEventListener("touchmove", handleTouchMove);
        }

        return () => {
            if (isTouchDevice) {
                document.removeEventListener("click", handleClickOutside);
                document.removeEventListener("touchmove", handleTouchMove);
            }
        };
    }, [showTooltip, isTouchDevice]);

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
                    <button onClick={handleAddToCart} disabled={stock === 0}>
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
