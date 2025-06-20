import { renderHook, act } from "@testing-library/react";
import { useProducts } from "../../../../src/features/product/hooks/useProducts";
import type { Product } from "../../../../src/types/product";

const mockProduct: Product = {
  idProduct: 1,
  name: "Producto Prueba",
  price: 1000,
  stock: 5,
  description: "Descripción",
  imageUrl: "https://fake.com/image.jpg",
};

// Simulación de entorno touch o no-touch
const mockDeviceEnvironment = (isTouch: boolean) => {
  Object.defineProperty(window, "ontouchstart", {
    value: isTouch ? () => true : undefined,
    configurable: true,
  });
  Object.defineProperty(navigator, "maxTouchPoints", {
    value: isTouch ? 1 : 0,
    configurable: true,
  });
};

describe("useProducts", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.skip("activa tooltip con mouse si no es touch", () => {
    mockDeviceEnvironment(false);

    const { result } = renderHook(() => useProducts(mockProduct));

    act(() => {
      result.current.handleMouseEnter();
    });

    expect(result.current.showTooltip).toBe(true);

    act(() => {
      result.current.handleMouseLeave();
    });

    expect(result.current.showTooltip).toBe(false);
  });

  it("activa y desactiva tooltip con touch", () => {
    mockDeviceEnvironment(true);

    const { result } = renderHook(() => useProducts(mockProduct));

    expect(result.current.showTooltip).toBe(false);

    act(() => {
      result.current.handleTouchStart();
    });

    expect(result.current.showTooltip).toBe(true);

    act(() => {
      result.current.handleTouchStart();
    });

    expect(result.current.showTooltip).toBe(false);
  });

  it("oculta tooltip al hacer click fuera del componente", () => {
    mockDeviceEnvironment(true);

    const { result } = renderHook(() => useProducts(mockProduct));

    const mockElement = document.createElement("article");
    document.body.appendChild(mockElement);

    act(() => {
      result.current.cardRef.current = mockElement;
      result.current.handleTouchStart(); // activa tooltip
    });

    expect(result.current.showTooltip).toBe(true);

    act(() => {
      document.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(result.current.showTooltip).toBe(false);
  });

  it("oculta tooltip al hacer touchmove", () => {
    mockDeviceEnvironment(true);

    const { result } = renderHook(() => useProducts(mockProduct));

    act(() => {
      result.current.handleTouchStart(); // activa tooltip
    });

    expect(result.current.showTooltip).toBe(true);

    act(() => {
      document.dispatchEvent(new Event("touchmove"));
    });

    expect(result.current.showTooltip).toBe(false);
  });

  it("retorna correctamente todas las propiedades", () => {
    const { result } = renderHook(() => useProducts(mockProduct));
    expect(result.current.name).toBe(mockProduct.name);
    expect(result.current.price).toBe(mockProduct.price);
    expect(result.current.stock).toBe(mockProduct.stock);
    expect(result.current.description).toBe(mockProduct.description);
    expect(result.current.imageUrl).toBe(mockProduct.imageUrl);
    expect(result.current.cardRef).toBeDefined();
  });
});
