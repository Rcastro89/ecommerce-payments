import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CardForm } from "../../../../src/features/payment/components/CardForm";
import type { FormCardData } from "../../../../src/types/payment";

// 🔧 Mocks
jest.mock(
  "../../../../src/features/payment/components/InputGroup",
  () => ({
    InputGroup: ({ label, value, nameInput, onChange, children }: any) => (
      <div data-testid={`input-${nameInput}`}>
        <label>{label}</label>
        <input
          name={nameInput}
          value={value}
          onChange={onChange}
          data-testid={`input-${nameInput}-field`}
        />
        {children}
      </div>
    ),
  })
);

describe("CardForm", () => {
  const defaultData: FormCardData = {
    cardNumber: "4111 1111 1111 1111",
    expiry: "12/25",
    cvv: "123",
    cardHolder: "Juan Pérez",
    installments: "1",
  };

  const mockErrors: FormCardData = {
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardHolder: "",
    installments: "",
  };

  const handleChange = jest.fn();
  const handleSubmit = jest.fn((e) => e.preventDefault());
  const handleClose = jest.fn();

  const renderComponent = (errors: FormCardData = mockErrors, cardType = "visa") =>
    render(
      <CardForm
        formData={defaultData}
        formErrors={errors}
        cardType={cardType}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        onClose={handleClose}
      />
    );

  it("renderiza el formulario con campos y valores iniciales", () => {
    renderComponent();

    expect(screen.getByText("Formulario de Pago")).toBeInTheDocument();
    expect(screen.getByText("Número de tarjeta")).toBeInTheDocument();
    expect(screen.getByTestId("input-cardNumber-field")).toHaveValue("4111 1111 1111 1111");
    expect(screen.getByText("Expiración")).toBeInTheDocument();
    expect(screen.getByTestId("input-expiry-field")).toHaveValue("12/25");
    expect(screen.getByText("CVV")).toBeInTheDocument();
    expect(screen.getByTestId("input-cvv-field")).toHaveValue("123");
    expect(screen.getByText("Nombre del titular")).toBeInTheDocument();
    expect(screen.getByTestId("input-cardHolder-field")).toHaveValue("Juan Pérez");
    expect(screen.getByText("Cuotas")).toBeInTheDocument();
    expect(screen.getByTestId("input-installments-field")).toHaveValue("1");
  });

  it("muestra el logo si cardType no es 'unknown'", () => {
    renderComponent();

    const logo = screen.getByAltText("Logo visa");
    expect(logo).toBeInTheDocument();
    expect(logo.getAttribute("src")).toContain("/assets/cardIcons/visa.png");
  });

  it("no muestra el logo si cardType es 'unknown'", () => {
    renderComponent(mockErrors, "unknown");

    expect(screen.queryByAltText(/Logo/)).not.toBeInTheDocument();
  });

  it("ejecuta handleChange cuando se cambia un valor", () => {
    renderComponent();

    const cardHolderInput = screen.getByTestId("input-cardHolder-field");
    fireEvent.change(cardHolderInput, { target: { value: "Ana Gómez" } });

    expect(handleChange).toHaveBeenCalled();
  });

  it("ejecuta handleSubmit al confirmar el formulario", () => {
    renderComponent();

    const submitBtn = screen.getByText("Confirmar Pago");
    fireEvent.click(submitBtn);

    expect(handleSubmit).toHaveBeenCalled();
  });

  it("ejecuta onClose al hacer clic en Cancelar", () => {
    renderComponent();

    const cancelBtn = screen.getByText("Cancelar");
    fireEvent.click(cancelBtn);

    expect(handleClose).toHaveBeenCalled();
  });

  it("muestra mensajes de error si existen errores en formErrors", () => {
    const errorData: FormCardData = {
      ...mockErrors,
      cardNumber: "Número inválido",
      cvv: "CVV requerido",
    };

    renderComponent(errorData);

    expect(screen.getByText("Número inválido")).toBeInTheDocument();
    expect(screen.getByText("CVV requerido")).toBeInTheDocument();
  });
});
