import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { PaymentSummary } from "../../../../src/features/payment/components/PaymentSummary";

// Mock del hook useCart
jest.mock("../../../../src/features/cart/hooks/useCart", () => ({
  useCart: () => ({
    subtotalPayment: 50000,
    baseFee: 5000,
    deliveryFee: 2000,
    totalPayment: 57000,
    totalItems: 3,
  }),
}));

describe("PaymentSummary", () => {
  const goBack = jest.fn();
  const sendPayment = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debe renderizar los totales correctamente", () => {
    render(<PaymentSummary goBack={goBack} sendPayment={sendPayment} />);

    expect(screen.getByText("Resumen del pago")).toBeInTheDocument();
    expect(screen.getByText("Total de articulos:")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("Subtotal:")).toBeInTheDocument();
    expect(screen.getByText("$50.000")).toBeInTheDocument();
    expect(screen.getByText("Tarifa base fija:")).toBeInTheDocument();
    expect(screen.getByText("$5.000")).toBeInTheDocument();
    expect(screen.getByText("Tarifa de entrega:")).toBeInTheDocument();
    expect(screen.getByText("$2.000")).toBeInTheDocument();
    expect(screen.getByText("Total del pedido:")).toBeInTheDocument();
    expect(screen.getByText("$57.000")).toBeInTheDocument();
  });

  it("debe ejecutar sendPayment al hacer clic en 'Pagar ahora'", () => {
    render(<PaymentSummary goBack={goBack} sendPayment={sendPayment} />);

    fireEvent.click(screen.getByText("Pagar ahora"));
    expect(sendPayment).toHaveBeenCalled();
  });

  it("debe ejecutar goBack al hacer clic en 'Volver'", () => {
    render(<PaymentSummary goBack={goBack} sendPayment={sendPayment} />);

    fireEvent.click(screen.getByText("Volver"));
    expect(goBack).toHaveBeenCalled();
  });
});
