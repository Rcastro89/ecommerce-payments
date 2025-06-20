import cartReducer, {
  addToCart,
  removeFromCart,
  removeOneFromCart,
  clearCart,
} from "../../../../src/features/cart/slices/cartSlice";
import type { CartState } from "../../../../src/features/cart/slices/cartSlice";
import type { Product } from "../../../../src/types/product";

const testProduct: Product = {
  idProduct: 1,
  name: "Producto Test",
  price: 10000,
  description: "Descripción de prueba",
  stock: 5,
  imageUrl: "imagen.jpg",
};

describe("cartSlice", () => {
  const initialState: CartState = {
    items: [],
  };

  it("debe agregar un producto nuevo al carrito", () => {
    const nextState = cartReducer(initialState, addToCart(testProduct));
    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0]).toMatchObject({
      ...testProduct,
      quantity: 1,
    });
  });

  it("debe incrementar la cantidad si el producto ya existe", () => {
    const preState: CartState = {
      items: [{ ...testProduct, quantity: 1 }],
    };
    const nextState = cartReducer(preState, addToCart(testProduct));
    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0].quantity).toBe(2);
  });

  it("debe eliminar completamente un producto del carrito", () => {
    const preState: CartState = {
      items: [{ ...testProduct, quantity: 2 }],
    };
    const nextState = cartReducer(preState, removeFromCart(1));
    expect(nextState.items).toHaveLength(0);
  });

  it("debe reducir la cantidad en 1 si hay más de una unidad", () => {
    const preState: CartState = {
      items: [{ ...testProduct, quantity: 2 }],
    };
    const nextState = cartReducer(preState, removeOneFromCart(1));
    expect(nextState.items[0].quantity).toBe(1);
  });

  it("debe eliminar el producto si su cantidad era 1", () => {
    const preState: CartState = {
      items: [{ ...testProduct, quantity: 1 }],
    };
    const nextState = cartReducer(preState, removeOneFromCart(1));
    expect(nextState.items).toHaveLength(0);
  });

  it("debe limpiar completamente el carrito", () => {
    const preState: CartState = {
      items: [
        { ...testProduct, quantity: 2 },
        { ...testProduct, idProduct: 2, quantity: 1 },
      ],
    };
    const nextState = cartReducer(preState, clearCart());
    expect(nextState.items).toHaveLength(0);
  });
});
