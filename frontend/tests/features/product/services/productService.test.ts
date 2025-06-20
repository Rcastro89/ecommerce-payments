import { getProducts } from "../../../../src/features/product/services/productService";
import type { Product } from "../../../../src/types/product";

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

describe("getProducts", () => {
  const mockProducts: Product[] = [
    {
      idProduct: 1,
      name: "Producto 1",
      price: 10000,
      stock: 5,
      description: "Producto de prueba",
      imageUrl: "https://fakeurl.com/1.jpg",
    },
  ];

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("retorna productos si la respuesta es exitosa", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockProducts,
    });

    const result = await getProducts();

    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/products");
    expect(result).toEqual(mockProducts);
  });

  it("retorna array vacío si response.ok es false", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    const result = await getProducts();

    expect(console.error).toHaveBeenCalledWith(
      "Error en productService:",
      new Error("Error al obtener productos")
    );
    expect(result).toEqual([]);
  });

  it("retorna array vacío si fetch lanza un error", async () => {
    const error = new Error("Network error");
    (fetch as jest.Mock).mockRejectedValue(error);

    const result = await getProducts();

    expect(console.error).toHaveBeenCalledWith("Error en productService:", error);
    expect(result).toEqual([]);
  });
});
