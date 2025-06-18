import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { removeFromCart, removeOneFromCart } from "../slices/cartSlice";
import { selecTotalItems } from "../slices/selectors";
import type { CartItem } from "../../../types/cartItem";
import { increaseStock } from "../../product/slice/productsSlice";

export const useCart = () => {
    const cartItems = useSelector(selecTotalItems);
    const dispatch = useDispatch();
    const [subtotalPayment, setSubtotalPayment] = useState<number>(0);
    const [totalPayment, settotalPayment] = useState<number>(0);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [cartItemsList, setCartItemsList] = useState<CartItem[]>([]);
    const baseFee = 5000; 
    const deliveryFee = 2000;

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
        const calculeTotalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
        setSubtotalPayment(total);
        setCartItemsList(cartItems);
        settotalPayment(total + baseFee + deliveryFee);
        setTotalItems(calculeTotalItems);
    }, [cartItems]);

    return {
        cartItemsList,
        subtotalPayment,
        totalPayment,
        baseFee,
        deliveryFee,
        totalItems,
        handleDeleteToCart,
        handleDeleteOneItem
    }
}