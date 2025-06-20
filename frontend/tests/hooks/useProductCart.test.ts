import { renderHook } from "@testing-library/react";
import { useProductCart } from "../../src/hooks/useProductCart";
import { addToCart, clearCart } from "../../src/features/cart/slices/cartSlice";
import { decreaseStock, resetProducts } from "../../src/features/product/slices/productsSlice";
import type { Product } from "../../src/types/product";
import type { RootState } from "../../src/app/store";
import { useDispatch, useSelector } from "react-redux";

jest.mock("react-redux", () => ({
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
}));

jest.mock("../../src/features/cart/slices/cartSlice", () => ({
    addToCart: jest.fn((product) => ({ type: "cart/addToCart", payload: product })),
    clearCart: jest.fn(() => ({ type: "cart/clearCart" })),
}));

jest.mock("../../src/features/product/slices/productsSlice", () => ({
    decreaseStock: jest.fn((id: number) => ({ type: "products/decreaseStock", payload: id })),
    resetProducts: jest.fn(() => ({ type: "products/resetProducts" })),
}));

describe("useProductCart", () => {
    const mockDispatch = jest.fn();

    const product: Product = {
        idProduct: 1,
        name: "Monitor",
        price: 800000,
        stock: 5,
        description: "Monitor HD",
        imageUrl: "https://fake.com/monitor.jpg"
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    });

    it("agrega al carrito si el producto tiene stock", () => {
        (useSelector as unknown as jest.Mock).mockImplementation((selectorFn: any) =>
            selectorFn({
                products: {
                    items: [product],
                },
            } as RootState)
        );

        const { result } = renderHook(() => useProductCart());

        result.current.handleAddToCart(product);

        expect(addToCart).toHaveBeenCalledWith(product);
        expect(decreaseStock).toHaveBeenCalledWith(product.idProduct);
        expect(mockDispatch).toHaveBeenCalledTimes(2);
    });

    it("no hace nada si el producto no existe", () => {
        (useSelector as unknown as jest.Mock).mockImplementation((selectorFn: any) =>
            selectorFn({
                products: {
                    items: [],
                },
                cart: {
                    items: [],
                    total: 0,
                    totalItems: 0,
                },
            })
        );

        const { result } = renderHook(() => useProductCart());

        result.current.handleAddToCart(product);

        expect(mockDispatch).not.toHaveBeenCalled();
    });

    it("muestra alerta si no hay stock", () => {
        window.alert = jest.fn();

        (useSelector as unknown as jest.Mock).mockImplementation((selectorFn: any) =>
            selectorFn({
                products: {
                    items: [{ ...product, stock: 0 }],
                },
            } as RootState)
        );

        const { result } = renderHook(() => useProductCart());

        result.current.handleAddToCart(product);

        expect(window.alert).toHaveBeenCalledWith("Producto agotado");
        expect(mockDispatch).not.toHaveBeenCalled();
    });

    it("limpia el carrito y reinicia productos", () => {
        (useSelector as unknown as jest.Mock).mockImplementation(() =>
            ({
                products: { items: [product] }
            }) as RootState
        );

        const { result } = renderHook(() => useProductCart());

        result.current.handleClearAllProductCart();

        expect(clearCart).toHaveBeenCalled();
        expect(resetProducts).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalledTimes(2);
    });
});
