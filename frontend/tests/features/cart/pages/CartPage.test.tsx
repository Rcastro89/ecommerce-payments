
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CartPage from "../../../../src/features/cart/pages/CartPage";
import * as useCartHook from "../../../../src/features/cart/hooks/useCart";
import * as useProductCartHook from "../../../../src/hooks/useProductCart";

jest.mock("../../../../src/features/product/slices/productsSlice", () => ({}));
jest.mock("../../../../src/features/product/services/productService");

jest.mock("../../../../src/features/cart/components/CartCard", () => ({
    CartCard: ({ cartItems }: any) => (
        <div data-testid="CartCardMock">
            {cartItems.map((item: any) => (
                <p key={item.idProduct}>{item.name}</p>
            ))}
        </div>
    ),
}));

jest.mock("../../../../src/features/payment/modals/PaymentModal", () => ({
    PaymentModal: ({ onClose }: any) => (
        <div data-testid="PaymentModalMock">
            <button onClick={onClose}>Cerrar modal</button>
        </div>
    ),
}));

describe("CartPage", () => {
    const mockCartItem = {
        idProduct: 1,
        name: "Producto de prueba",
        price: 10000,
        quantity: 2,
        description: "Descripción del producto de prueba",
        stock: 10,
        imageUrl: "https://example.com/test1.jpg",
    };

    const defaultCartValues = {
        cartItemsList: [mockCartItem],
        subtotalPayment: 20000,
        handleDeleteToCart: jest.fn(),
        handleDeleteOneItem: jest.fn(),
        handleDeleteToCartAll: jest.fn(),
    };

    const defaultProductCartValues = {
        handleAddToCart: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock hooks
        jest.spyOn(useCartHook, "useCart").mockReturnValue(defaultCartValues as any);
        jest
            .spyOn(useProductCartHook, "useProductCart")
            .mockReturnValue(defaultProductCartValues as any);
    });

    it("renderiza correctamente cuando el carrito está vacío", () => {
        (useCartHook.useCart as jest.Mock).mockReturnValue({
            ...defaultCartValues,
            cartItemsList: [],
        });

        render(<CartPage />);

        expect(
            screen.getByText("No tienes productos en el carrito.")
        ).toBeInTheDocument();
    });

    it("renderiza el CartCard y detalles del footer", () => {
        render(<CartPage />);

        expect(screen.getByTestId("CartCardMock")).toBeInTheDocument();
        expect(screen.getByText("Producto de prueba")).toBeInTheDocument();
        expect(screen.getByText("Total de productos: 2")).toBeInTheDocument();
        expect(screen.getByText("Total a pagar:")).toBeInTheDocument();
        expect(screen.getByText("$20.000")).toBeInTheDocument();
    });

    it("llama a handleDeleteToCartAll cuando se presiona el botón 🗑️ del header", () => {
        render(<CartPage />);
        const deleteAllButton = screen.getByText("🗑️");
        fireEvent.click(deleteAllButton);

        expect(defaultCartValues.handleDeleteToCartAll).toHaveBeenCalled();
    });

    it("no abre el modal si el carrito está vacío", () => {
        (useCartHook.useCart as jest.Mock).mockReturnValue({
            ...defaultCartValues,
            cartItemsList: [],
        });

        render(<CartPage />);
        const payButton = screen.getByText("Pagar con tarjeta de crédito");

        fireEvent.click(payButton);
        expect(screen.queryByTestId("PaymentModalMock")).not.toBeInTheDocument();
    });

    it("abre y cierra el PaymentModal correctamente", () => {
        render(<CartPage />);
        const payButton = screen.getByText("Pagar con tarjeta de crédito");

        fireEvent.click(payButton);
        expect(screen.getByTestId("PaymentModalMock")).toBeInTheDocument();

        const closeModalBtn = screen.getByText("Cerrar modal");
        fireEvent.click(closeModalBtn);
    });
});
