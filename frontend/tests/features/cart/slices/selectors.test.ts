import {
    selectCartTotalItems,
    selecTotalItems,
} from "../../../../src/features/cart/slices/selectors";
import type { RootState } from "../../../../src/app/store";

describe("selectores del carrito", () => {
    const mockState: RootState = {
        cart: {
            items: [
                {
                    idProduct: 1,
                    name: "Prod 1",
                    price: 10000,
                    quantity: 2,
                    description: "",
                    stock: 5,
                    imageUrl: "",
                },
                {
                    idProduct: 2,
                    name: "Prod 2",
                    price: 5000,
                    quantity: 4,
                    description: "",
                    stock: 5,
                    imageUrl: "",
                },
            ],
        },
        products: {
            items: [],
            isLoading: false,
            isLoaded: true,
            error: null,
        },
        _persist: {
            version: 1,
            rehydrated: true,
        },
    };

    it("selectCartTotalItems debe retornar la suma total de cantidades", () => {
        const total = selectCartTotalItems(mockState);
        expect(total).toBe(6);
    });

    it("selecTotalItems debe retornar el array completo de ítems", () => {
        const items = selecTotalItems(mockState);
        expect(items).toHaveLength(2);
        expect(items[0].idProduct).toBe(1);
        expect(items[1].quantity).toBe(4);
    });
});
