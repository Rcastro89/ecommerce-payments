import type { Product } from "../../../types/product";

const API_URL = "http://3.149.8.187:3000";

export const getProducts = async (): Promise<Product[]> => {
    if (!API_URL) {
        console.error("API_URL is not defined");
        return [];
    }
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) throw new Error("Error al obtener productos");
    return await response.json();
  } catch (error) {
    console.error("Error en productService:", error);
    return [];
  }
};
