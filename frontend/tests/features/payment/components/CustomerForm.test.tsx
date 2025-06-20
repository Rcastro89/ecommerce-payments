import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CustomerForm } from "../../../../src/features/payment/components/CustomerForm";

jest.mock("../../../../src/features/payment/components/InputGroup", () => ({
  InputGroup: ({ nameInput, value, label, onChange }: any) => (
    <div data-testid={`input-${nameInput}`}>
      <label>{label}</label>
      <input
        data-testid={`input-${nameInput}-field`}
        name={nameInput}
        value={value}
        onChange={onChange}
      />
    </div>
  ),
}));

describe("CustomerForm", () => {
  const formCustomerData = {
    idClient: "1234567890",
    fullName: "Reinaldo Pérez",
    address: "Calle Falsa 123",
    phone: "3101234567",
    email: "reinaldo@mail.com",
  };

  const formErrors = {
    idClient: "",
    fullName: "",
    address: "",
    phone: "",
    email: "",
  };

  const handleSubmit = jest.fn((e) => e.preventDefault());
  const handleChange = jest.fn();
  const goBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debe renderizar todos los campos con sus valores iniciales", () => {
    render(
      <CustomerForm
        goBack={goBack}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        formCustomerData={formCustomerData}
        formErrors={formErrors}
      />
    );

    expect(screen.getByTestId("input-idClient-field")).toHaveValue("1234567890");
    expect(screen.getByTestId("input-fullName-field")).toHaveValue("Reinaldo Pérez");
    expect(screen.getByTestId("input-address-field")).toHaveValue("Calle Falsa 123");
    expect(screen.getByTestId("input-phone-field")).toHaveValue("3101234567");
    expect(screen.getByTestId("input-email-field")).toHaveValue("reinaldo@mail.com");
  });

  it("debe disparar el evento onChange cuando se modifica un input", () => {
    render(
      <CustomerForm
        goBack={goBack}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        formCustomerData={formCustomerData}
        formErrors={formErrors}
      />
    );

    fireEvent.change(screen.getByTestId("input-idClient-field"), {
      target: { value: "9876543210" },
    });

    expect(handleChange).toHaveBeenCalled();
  });

  it("debe ejecutar handleSubmit al enviar el formulario", () => {
    render(
      <CustomerForm
        goBack={goBack}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        formCustomerData={formCustomerData}
        formErrors={formErrors}
      />
    );

    fireEvent.submit(screen.getByTestId("input-idClient-field").closest("form")!);

    expect(handleSubmit).toHaveBeenCalled();
  });

  it("debe ejecutar goBack al hacer clic en el botón 'Volver'", () => {
    render(
      <CustomerForm
        goBack={goBack}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        formCustomerData={formCustomerData}
        formErrors={formErrors}
      />
    );

    fireEvent.click(screen.getByText("Volver"));
    expect(goBack).toHaveBeenCalled();
  });

  it("debe mostrar errores si existen en formErrors", () => {
    const formErrorsWithMessages = {
      ...formErrors,
      email: "Correo inválido",
    };

    render(
      <CustomerForm
        goBack={goBack}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        formCustomerData={formCustomerData}
        formErrors={formErrorsWithMessages}
      />
    );

    expect(screen.getByText("Correo inválido")).toBeInTheDocument();
  });
});
