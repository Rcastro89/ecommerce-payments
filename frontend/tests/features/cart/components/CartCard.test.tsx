// tests/features/cart/components/CartCard.test.tsx

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CartCard } from "../../../../src/features/cart/components/CartCard";
import type { CartItem } from "../../../../src/types/cartItem";

// Mocks
jest.mock("../../../../../src/assets/products/test1.jpg", () => "test1.jpg");

const mockCartItems: CartItem[] = [
  {
    idProduct: 1,
    name: "Producto de prueba",
    price: 10000,
    quantity: 2,
    description: "Descripción del producto de prueba",
    stock: 10,
    imageUrl: "https://example.com/test1.jpg",
  },
  {
    idProduct: 2,
    name: "Otro producto",
    price: 25000,
    quantity: 1,
    description: "Descripción del producto de prueba 2",
    stock: 5,
    imageUrl: "https://example.com/test1.jpg",
  },
];

const deleteAllItem = jest.fn();
const deleteOneItem = jest.fn();
const addOneItem = jest.fn();

const setup = () =>
  render(
    <CartCard
      cartItems={mockCartItems}
      deleteAllItem={deleteAllItem}
      deleteOneItem={deleteOneItem}
      addOneItem={addOneItem}
    />
  );

describe("CartCard component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza todos los items correctamente", () => {
    setup();

    mockCartItems.forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
      expect(
        screen.getByText(`Precio: $${(item.price * item.quantity).toLocaleString()}`)
      ).toBeInTheDocument();
      expect(screen.getByText(`Cantidad: ${item.quantity}`)).toBeInTheDocument();
    });
  });

  it("llama a addOneItem cuando se hace clic en ➕", () => {
    setup();
    const addButtons = screen.getAllByText("➕");

    fireEvent.click(addButtons[0]);
    expect(addOneItem).toHaveBeenCalledWith(mockCartItems[0]);

    fireEvent.click(addButtons[1]);
    expect(addOneItem).toHaveBeenCalledWith(mockCartItems[1]);
  });

  it("llama a deleteOneItem cuando se hace clic en ➖", () => {
    setup();
    const deleteButtons = screen.getAllByText("➖");

    fireEvent.click(deleteButtons[0]);
    expect(deleteOneItem).toHaveBeenCalledWith(mockCartItems[0]);

    fireEvent.click(deleteButtons[1]);
    expect(deleteOneItem).toHaveBeenCalledWith(mockCartItems[1]);
  });

  it("llama a deleteAllItem cuando se hace clic en 🗑️", () => {
    setup();
    const trashButtons = screen.getAllByText("🗑️");

    fireEvent.click(trashButtons[0]);
    expect(deleteAllItem).toHaveBeenCalledWith(mockCartItems[0]);

    fireEvent.click(trashButtons[1]);
    expect(deleteAllItem).toHaveBeenCalledWith(mockCartItems[1]);
  });

  it("renderiza correctamente las imágenes con alt", () => {
    setup();
    const images = screen.getAllByRole("img");

    expect(images.length).toBe(mockCartItems.length);
    expect(images[0]).toHaveAttribute("alt", mockCartItems[0].name);
    expect(images[1]).toHaveAttribute("alt", mockCartItems[1].name);
  });
});
