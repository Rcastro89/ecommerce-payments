import type { Product } from "../../../types/product";
import { useEffect, useRef, useState } from "react";

export const useProducts = (product: Product) => {
    const { name, price, stock, description } = product;

    const [showTooltip, setShowTooltip] = useState(false);
    const cardRef = useRef<HTMLElement>(null);
    const isTouchDevice = typeof window !== "undefined" &&
        ("ontouchstart" in window || navigator.maxTouchPoints > 0);

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

    return {
        cardRef,
        showTooltip,
        handleMouseEnter,
        handleMouseLeave,
        handleTouchStart,
        name,
        price,
        stock,
        description
    };
}