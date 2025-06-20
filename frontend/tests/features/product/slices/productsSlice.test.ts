import reducer, {
    increaseStock,
    decreaseStock,
    resetProducts,
    fetchProducts,
    type ProductsState
} from "../../../../src/features/product/slices/productsSlice";

import * as service from "../../../../src/features/product/services/productService";
import type { Product } from "../../../../src/types/product";
import { configureStore } from "@reduxjs/toolkit";
import thunk from 'redux-thunk';

jest.mock("../../../../src/features/product/services/productService");

const initialState: ProductsState = {
    items: [],
    isLoading: false,
    isLoaded: false,
    error: null,
};

const mockProducts: Product[] = [
    {
        idProduct: 1,
        name: "Producto 1",
        price: 10000,
        stock: 5,
        description: "desc",
        imageUrl: "https://image.test",
    },
];

describe("productsSlice", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("debería manejar increaseStock", () => {
        const state = {
            ...initialState,
            items: [...mockProducts],
        };

        const newState = reducer(state, increaseStock(1));
        expect(newState.items[0].stock).toBe(6);
    });

    it("debería manejar decreaseStock", () => {
        const state = {
            ...initialState,
            items: [...mockProducts],
        };

        const newState = reducer(state, decreaseStock(1));
        expect(newState.items[0].stock).toBe(4);
    });

    it("no debería disminuir el stock si ya está en 0", () => {
        const productZeroStock = { ...mockProducts[0], stock: 0 };
        const state = {
            ...initialState,
            items: [productZeroStock],
        };

        const newState = reducer(state, decreaseStock(1));
        expect(newState.items[0].stock).toBe(0);
    });

    it("debería manejar resetProducts", () => {
        const state = {
            ...initialState,
            isLoaded: true,
        };

        const newState = reducer(state, resetProducts());
        expect(newState.isLoaded).toBe(false);
    });

    it("debería manejar fetchProducts.fulfilled", () => {
        const state = { ...initialState };
        const action = {
            type: fetchProducts.fulfilled.type,
            payload: mockProducts,
        };

        const newState = reducer(state, action);
        expect(newState.items).toEqual(mockProducts);
        expect(newState.isLoading).toBe(false);
        expect(newState.isLoaded).toBe(true);
    });

    it("debería manejar fetchProducts.pending", () => {
        const action = { type: fetchProducts.pending.type };
        const newState = reducer(initialState, action);
        expect(newState.isLoading).toBe(true);
        expect(newState.error).toBeNull();
    });

    it("debería manejar fetchProducts.rejected", () => {
        const action = {
            type: fetchProducts.rejected.type,
            payload: "Error al cargar productos",
        };
        const newState = reducer(initialState, action);
        expect(newState.error).toBe("Error al cargar productos");
        expect(newState.isLoading).toBe(false);
        expect(newState.isLoaded).toBe(false);
    });

    it("debería ejecutar fetchProducts correctamente", async () => {
        (service.getProducts as jest.Mock).mockResolvedValue(mockProducts);

        const store = configureStore({
            reducer: reducer,
            middleware: (getDefaultMiddleware) =>
                getDefaultMiddleware({
                    thunk: true, // ya lo incluye
                    serializableCheck: false,
                }),
        });

        await store.dispatch<any>(fetchProducts());

        const state = store.getState();
        expect(state.items.length).toBe(1);
        expect(state.isLoaded).toBe(true);
    });

    it("debería manejar error en fetchProducts", async () => {
        (service.getProducts as jest.Mock).mockImplementation(() => {
            throw new Error("fallo");
        });
        
        const store = configureStore({
            reducer: reducer,
            middleware: (getDefaultMiddleware) =>
                getDefaultMiddleware({
                    thunk: true, // ya lo incluye
                    serializableCheck: false,
                }),
        });

        await store.dispatch<any>(fetchProducts());

        const state = store.getState();
        expect(state.error).toContain("Error al cargar productos");
        expect(state.isLoaded).toBe(false);
    });
});
