import { getAllProducts } from "../../../../src/features/product/slices/selectors";
import type { RootState } from "../../../../src/app/store";
import type { Product } from "../../../../src/types/product";

describe("getAllProducts selector", () => {
  it("debe retornar la lista de productos desde el estado", () => {
    const mockProducts: Product[] = [
      {
        idProduct: 1,
        name: "Laptop",
        price: 3000000,
        stock: 5,
        description: "Laptop de alto rendimiento",
        imageUrl: "https://fakeurl.com/laptop.jpg",
      },
      {
        idProduct: 2,
        name: "Mouse",
        price: 50000,
        stock: 20,
        description: "Mouse inalámbrico",
        imageUrl: "https://fakeurl.com/mouse.jpg",
      },
    ];

    const mockState = {
      products: {
        items: mockProducts,
        isLoading: false,
        isLoaded: true,
        error: null,
      },
    } as RootState;

    const result = getAllProducts(mockState);
    expect(result).toEqual(mockProducts);
  });
});
