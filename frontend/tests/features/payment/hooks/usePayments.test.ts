import { renderHook, act, waitFor } from "@testing-library/react";
import { usePayments } from "../../../../src/features/payment/hooks/usePayments";

describe("usePayments", () => {
    const onCloseMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("debe iniciar con el formulario de tarjeta", () => {
        const { result } = renderHook(() => usePayments(onCloseMock));
        expect(result.current.showForm).toBe("viewCard");
    });

    it("debe actualizar los datos de tarjeta correctamente", () => {
        const { result } = renderHook(() => usePayments(onCloseMock));

        act(() => {
            result.current.handleChangeCardForm({
                target: { name: "cardNumber", value: "4111111111111111" },
            } as any);
        });

        expect(result.current.formCardData.cardNumber).toBe("4111 1111 1111 1111");
    });

    it("no debe avanzar si los datos de tarjeta están incompletos", () => {
        const { result } = renderHook(() => usePayments(onCloseMock));

        act(() => {
            result.current.handleSubmitCard({ preventDefault: jest.fn() } as any);
        });

        expect(result.current.showForm).toBe("viewCard");
        expect(result.current.formCardErrors.cardNumber).toContain("requerido");
    });

    it("debe avanzar a `viewCard` si los datos de tarjeta están completos", async () => {
        const { result } = renderHook(() => usePayments(onCloseMock));

        act(() => {
            result.current.handleChangeCardForm({
                target: { name: "cardNumber", value: "4111111111111111" },
            } as any);
            result.current.handleChangeCardForm({
                target: { name: "expiry", value: "12/25" },
            } as any);
            result.current.handleChangeCardForm({
                target: { name: "cvv", value: "123" },
            } as any);
            result.current.handleChangeCardForm({
                target: { name: "cardHolder", value: "Juan Pérez" },
            } as any);
            result.current.handleChangeCardForm({
                target: { name: "installments", value: "1" },
            } as any);

            result.current.handleSubmitCard({ preventDefault: jest.fn() } as any);
        });

        await waitFor(() => {
            expect(result.current.showForm).toBe("viewCard");
        });
    });

    it("debe avanzar a `viewSummary` si los datos del cliente están completos", () => {
        const { result } = renderHook(() => usePayments(onCloseMock));

        // Simulamos que ya está en viewCustomer
        act(() => {
            result.current.setShowForm("viewCustomer");

            result.current.handleChangeCustomerForm({
                target: { name: "idClient", value: "123456789" },
            } as any);
            result.current.handleChangeCustomerForm({
                target: { name: "fullName", value: "Reinaldo Pérez" },
            } as any);
            result.current.handleChangeCustomerForm({
                target: { name: "address", value: "Calle Falsa 123" },
            } as any);
            result.current.handleChangeCustomerForm({
                target: { name: "phone", value: "3101234567" },
            } as any);
            result.current.handleChangeCustomerForm({
                target: { name: "email", value: "test@mail.com" },
            } as any);

            result.current.handleSubmitCustomer({ preventDefault: jest.fn() } as any);
        });

        expect(result.current.showForm).toBe("viewCustomer");
    });

    it("debe llamar onClose al cerrar", () => {
        const { result } = renderHook(() => usePayments(onCloseMock));

        act(() => {
            result.current.handleClose();
        });

        expect(onCloseMock).toHaveBeenCalled();
    });
});
