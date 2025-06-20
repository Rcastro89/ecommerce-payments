import { renderHook, act } from "@testing-library/react";
import { useCheckout } from "../../../../src/features/payment/hooks/useCheckout";
import * as reduxHooks from "../../../../src/hooks/useAppDispatch";
import * as selectorHooks from "../../../../src/hooks/useAppSelector";
import { BrowserRouter } from "react-router-dom";

const mockNavigate = jest.fn();

// Mock useNavigate
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

describe("useCheckout", () => {
    const mockDispatch = jest.fn();

    const sampleItems = [
        {
            idProduct: 1,
            name: "Test",
            price: 10000,
            quantity: 1,
            description: "",
            stock: 5,
            imageUrl: "",
        },
    ];

    const mockCardData = {
        cardNumber: "4111111111111111",
        expiry: "12/25",
        cvv: "123",
        cardHolder: "Test Holder",
        installments: "1",
    };

    const mockCustomerData = {
        idClient: "12345678",
        fullName: "Reinaldo",
        address: "Calle Falsa",
        phone: "3001234567",
        email: "test@mail.com",
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(reduxHooks, "useAppDispatch").mockReturnValue(mockDispatch);
        jest.spyOn(selectorHooks, "useAppSelector").mockReturnValue(sampleItems);
        global.fetch = jest.fn();
    });

    it("debe manejar error si la respuesta contiene un error", async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                ok: false,
                error: {
                    step: "ACCEPTANCE_TOKEN",
                    message: "Error obteniendo acceptance token",
                },
            }),
        });

        const { result } = renderHook(() => useCheckout(), { wrapper: BrowserRouter });

        await act(async () => {
            await result.current.checkout(mockCardData, mockCustomerData);
        });

        expect(result.current.status).toBe("error");
    });

    it("debe actualizar el estado `status` correctamente", async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ ok: true }),
        });

        const { result } = renderHook(() => useCheckout(), { wrapper: BrowserRouter });

        await act(async () => {
            await result.current.checkout(mockCardData, mockCustomerData);
        });

        expect(["loading", "success"]).toContain(result.current.status);
    });
});
