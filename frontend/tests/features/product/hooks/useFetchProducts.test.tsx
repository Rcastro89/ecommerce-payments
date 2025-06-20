import { renderHook } from "@testing-library/react";
import { useFetchProducts } from "../../../../src/features/product/hooks/useFetchProducts";
import { useAppDispatch } from "../../../../src/hooks/useAppDispatch";
import { useAppSelector } from "../../../../src/hooks/useAppSelector";

jest.mock("../../../../src/hooks/useAppDispatch");
jest.mock("../../../../src/hooks/useAppSelector");
jest.mock("../../../../src/features/product/slices/productsSlice", () => ({
  fetchProducts: jest.fn(() => ({ type: "FETCH_PRODUCTS" })),
}));

describe("useFetchProducts", () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
  });

  it("debe disparar fetchProducts si isLoaded es false", () => {
    (useAppSelector as jest.Mock).mockImplementation((selectorFn) => {
      return selectorFn({
        products: {
          items: [],
          isLoaded: false,
          isLoading: true,
          error: null,
        },
      });
    });

    renderHook(() => useFetchProducts());

    expect(mockDispatch).toHaveBeenCalledWith({ type: "FETCH_PRODUCTS" });
  });

  it("NO debe disparar fetchProducts si isLoaded es true", () => {
    (useAppSelector as jest.Mock).mockImplementation((selectorFn) => {
      return selectorFn({
        products: {
          items: [],
          isLoaded: true,
          isLoading: false,
          error: null,
        },
      });
    });

    renderHook(() => useFetchProducts());

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it("retorna correctamente los valores del estado", () => {
    const mockedState = {
      products: {
        items: [{ idProduct: 1, name: "Mock", price: 1000, stock: 2, description: "", imageUrl: "" }],
        isLoaded: true,
        isLoading: false,
        error: null,
      },
    };

    (useAppSelector as jest.Mock).mockImplementation((selectorFn) => selectorFn(mockedState));

    const { result } = renderHook(() => useFetchProducts());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.productsItems).toEqual(mockedState.products.items);
    expect(result.current.error).toBeNull();
  });
});
