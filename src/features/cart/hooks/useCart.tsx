import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { selecTotalItems } from "../../../slices/cart/selectors";
import type { CartItem } from "../../../types/cartItem";
import { removeFromCart, removeOneFromCart } from "../../../slices/cart/cartSlice";
import { increaseStock } from "../../../slices/products/productsSlice";

export const useCart = () => {
    const cartItems = useSelector(selecTotalItems);
    const dispatch = useDispatch();
    const [totalPayment, setTotalPayment] = useState<number>(0);
    const [cartItemsList, setCartItemsList] = useState<CartItem[]>([]);

    const handleDeleteToCart = (product: CartItem) => {
        dispatch(removeFromCart(product.idProduct));
        for (let i = 0; i < product.quantity; i++) {
            dispatch(increaseStock(product.idProduct));
        }
    };

    const handleDeleteOneItem = (product: CartItem) => {
        dispatch(removeOneFromCart(product.idProduct));
        dispatch(increaseStock(product.idProduct));
    };

    useEffect(() => {
        const total = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        setTotalPayment(total);
        setCartItemsList(cartItems);
    }, [cartItems]);

    return {
        cartItemsList,
        totalPayment,
        handleDeleteToCart,
        handleDeleteOneItem
    }
}