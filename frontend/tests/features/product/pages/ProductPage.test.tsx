import { render, screen } from "@testing-library/react";
import ProductPage from "../../../../src/features/product/pages/ProductPage";
import * as useFetchProductsHook from "../../../../src/features/product/hooks/useFetchProducts";

// Mock del componente ProductCard
jest.mock("../../../../src/features/product/components/ProductCard", () => ({
  ProductCard: ({ product }: any) => (
    <div data-testid="mock-product-card">{product.name}</div>
  ),
}));

describe("ProductPage", () => {
  const mockProducts = [
    {
      idProduct: 1,
      name: "Producto 1",
      price: 10000,
      stock: 10,
      description: "Descripción 1",
      imageUrl: "https://fakeurl.com/1.jpg",
    },
    {
      idProduct: 2,
      name: "Producto 2",
      price: 20000,
      stock: 5,
      description: "Descripción 2",
      imageUrl: "https://fakeurl.com/2.jpg",
    },
  ];

  it("muestra el mensaje de carga cuando isLoading es true", () => {
    jest
      .spyOn(useFetchProductsHook, "useFetchProducts")
      .mockReturnValue({
        isLoading: true,
        productsItems: [],
        error: null,
      });

    render(<ProductPage />);
    expect(screen.getByText(/cargando productos/i)).toBeInTheDocument();
  });

  it("muestra el mensaje de error cuando hay un error", () => {
    jest
      .spyOn(useFetchProductsHook, "useFetchProducts")
      .mockReturnValue({
        isLoading: false,
        productsItems: [],
        error: "Ocurrió un error",
      });

    render(<ProductPage />);
    expect(screen.getByText(/error: ocurr.*error/i)).toBeInTheDocument();
  });

  it("renderiza la lista de productos correctamente", () => {
    jest
      .spyOn(useFetchProductsHook, "useFetchProducts")
      .mockReturnValue({
        isLoading: false,
        productsItems: mockProducts,
        error: null,
      });

    render(<ProductPage />);
    expect(screen.getByText(/tecstore/i)).toBeInTheDocument();
    expect(screen.getAllByTestId("mock-product-card")).toHaveLength(2);
    expect(screen.getByText("Producto 1")).toBeInTheDocument();
    expect(screen.getByText("Producto 2")).toBeInTheDocument();
  });
});
