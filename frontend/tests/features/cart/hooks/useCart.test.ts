import { renderHook, act } from "@testing-library/react";
import { useCart } from "../../../../src/features/cart/hooks/useCart";
import * as reactRedux from "react-redux";
import * as productCartHook from "../../../../src/hooks/useProductCart";
import { CartItem } from "../../../../src/types/cartItem";
import { removeFromCart, removeOneFromCart } from "../../../../src/features/cart/slices/cartSlice";
import { increaseStock } from "../../../../src/features/product/slices/productsSlice";

const mockDispatch = jest.fn();
jest.mock("../../../../src/features/product/slices/productsSlice", () => ({
  increaseStock: (payload: number) => ({
    type: "product/increaseStock",
    payload,
  }),
}));

jest.mock("react-redux", () => ({
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
}));

jest.mock("../../../../src/hooks/useProductCart", () => ({
    useProductCart: jest.fn(),
}));

describe("useCart hook", () => {
    const sampleCart: CartItem[] = [
        {
            idProduct: 1,
            name: "Test Product",
            price: 10000,
            quantity: 2,
            description: "test",
            stock: 10,
            imageUrl: "test.jpg",
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        (reactRedux.useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
        (reactRedux.useSelector as unknown as jest.Mock).mockImplementation(cb => cb({ cart: { items: sampleCart } }));
        (productCartHook.useProductCart as jest.Mock).mockReturnValue({
            handleClearAllProductCart: jest.fn(),
        });
    });

    it("debe calcular correctamente subtotal, total a pagar y total de productos", () => {
        const { result } = renderHook(() => useCart());

        expect(result.current.subtotalPayment).toBe(20000);
        expect(result.current.totalPayment).toBe(20000 + 5000 + 2000);
        expect(result.current.totalItems).toBe(2);
        expect(result.current.cartItemsList).toEqual(sampleCart);
    });

    it("debe ejecutar removeFromCart e increaseStock al eliminar un producto completo del carrito", () => {
        const { result } = renderHook(() => useCart());

        act(() => {
            result.current.handleDeleteToCart(sampleCart[0]);
        });

        expect(mockDispatch).toHaveBeenCalledWith(removeFromCart(1));
        expect(mockDispatch).toHaveBeenCalledTimes(3);
        expect(mockDispatch).toHaveBeenCalledWith(increaseStock(1));
    });

    it("debe ejecutar removeOneFromCart e increaseStock al eliminar una unidad del producto", () => {
        const { result } = renderHook(() => useCart());

        act(() => {
            result.current.handleDeleteOneItem(sampleCart[0]);
        });

        expect(mockDispatch).toHaveBeenCalledWith(removeOneFromCart(1));
        expect(mockDispatch).toHaveBeenCalledWith(increaseStock(1));
    });

    it("debe ejecutar handleClearAllProductCart al vaciar todo el carrito", () => {
        const mockClearAll = jest.fn();
        (productCartHook.useProductCart as jest.Mock).mockReturnValue({
            handleClearAllProductCart: mockClearAll,
        });

        const { result } = renderHook(() => useCart());

        act(() => {
            result.current.handleDeleteToCartAll();
        });

        expect(mockClearAll).toHaveBeenCalled();
    });
});
