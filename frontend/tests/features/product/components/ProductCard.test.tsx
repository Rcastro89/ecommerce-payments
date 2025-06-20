import { render, screen, fireEvent } from "@testing-library/react";
import { ProductCard } from "../../../../src/features/product/components/ProductCard";
import type { Product } from "../../../../src/types/product";
import * as useProductsModule from "../../../../src/features/product/hooks/useProducts";

// Variables para mocks dinámicos
let mockUseProductsReturnValue: any = {};
let mockHandleAddToCart: jest.Mock;

jest.mock("../../../../src/hooks/useProductCart", () => ({
    useProductCart: () => ({
        handleAddToCart: mockHandleAddToCart,
    }),
}));

jest.mock("../../../../src/features/product/hooks/useProducts", () => ({
    useProducts: (product: Product) => ({
        ...mockUseProductsReturnValue,
        name: product.name,
        price: product.price,
        stock: product.stock,
        description: product.description,
        imageUrl: product.imageUrl,
    }),
}));

const mockProduct: Product = {
    idProduct: 1,
    name: "Producto de prueba",
    price: 20000,
    stock: 10,
    description: "Descripción de prueba",
    imageUrl: "https://fakeurl.com/product.jpg",
};

describe("ProductCard", () => {
    beforeEach(() => {
        mockHandleAddToCart = jest.fn();
        mockUseProductsReturnValue = {
            cardRef: { current: null },
            showTooltip: false,
            handleMouseEnter: jest.fn(),
            handleMouseLeave: jest.fn(),
            handleTouchStart: jest.fn(),
        };
    });

    it("renderiza nombre, precio y stock del producto", () => {
        render(<ProductCard product={mockProduct} />);
        expect(screen.getByText("Producto de prueba")).toBeInTheDocument();
        expect(screen.getByText("COP 20.000")).toBeInTheDocument();
        expect(screen.getByText("Stock: 10")).toBeInTheDocument();
    });

    it("deshabilita el botón cuando no hay stock", () => {
        render(<ProductCard product={{ ...mockProduct, stock: 0 }} />);
        expect(screen.getByRole("button")).toBeDisabled();
    });

    it("llama a handleAddToCart al hacer click en el botón", () => {
        render(<ProductCard product={mockProduct} />);
        fireEvent.click(screen.getByRole("button"));
        expect(mockHandleAddToCart).toHaveBeenCalledWith(mockProduct);
    });

    it("detiene propagación en onTouchStart del botón", () => {
        render(<ProductCard product={mockProduct} />);
        const button = screen.getByRole("button");

        const touchEvent = new Event("touchstart", { bubbles: true, cancelable: true });
        touchEvent.stopPropagation = jest.fn();

        button.dispatchEvent(touchEvent);

        expect(touchEvent.stopPropagation).toHaveBeenCalled();
    });

    it("ejecuta eventos de mouse y touch sobre el artículo", () => {
        render(<ProductCard product={mockProduct} />);
        const article = screen.getByRole("article");

        fireEvent.mouseEnter(article);
        expect(mockUseProductsReturnValue.handleMouseEnter).toHaveBeenCalled();

        fireEvent.mouseLeave(article);
        expect(mockUseProductsReturnValue.handleMouseLeave).toHaveBeenCalled();

        fireEvent.touchStart(article);
        expect(mockUseProductsReturnValue.handleTouchStart).toHaveBeenCalled();
    });

    it("muestra tooltip si showTooltip es true", () => {
        mockUseProductsReturnValue.showTooltip = true;
        render(<ProductCard product={mockProduct} />);
        expect(screen.getByText("Descripción de prueba")).toBeInTheDocument();
    });
});
