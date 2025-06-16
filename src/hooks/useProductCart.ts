import { useDispatch, useSelector } from "react-redux";
import type { Product } from "../types/product";
import { addToCart } from "../slices/cart/cartSlice";
import { decreaseStock } from "../slices/products/productsSlice";
import type { RootState } from "../app/store";

export const useProductCart = () => {
    const dispatch = useDispatch();
    const products = useSelector((state: RootState) => state.products.items);

    const handleAddToCart = (product: Product) => {
        const currentProduct = products.find(p => p.idProduct === product.idProduct);

        if (!currentProduct) {
            return;
        }

        if (currentProduct.stock > 0) {
            dispatch(addToCart(product));
            dispatch(decreaseStock(product.idProduct));
        } else {
            alert("Producto agotado");
        }
    };

    return {
        handleAddToCart,
    }
}