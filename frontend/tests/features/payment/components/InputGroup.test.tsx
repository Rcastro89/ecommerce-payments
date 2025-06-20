import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { InputGroup } from "../../../../src/features/payment/components/InputGroup";

describe("InputGroup", () => {
  const defaultProps = {
    nameInput: "email",
    value: "test@mail.com",
    onChange: jest.fn(),
    type: "email" as const,
    label: "Correo Electrónico",
    placeholder: "Ingresa tu correo",
    maxLength: 30,
    inputMode: "text" as const,
  };

  it("debe renderizar el label e input correctamente", () => {
    render(<InputGroup {...defaultProps} />);
    
    const input = screen.getByLabelText("Correo Electrónico");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("placeholder", "Ingresa tu correo");
    expect(input).toHaveValue("test@mail.com");
  });

  it("debe llamar a onChange al modificar el valor", () => {
    render(<InputGroup {...defaultProps} />);

    const input = screen.getByLabelText("Correo Electrónico");
    fireEvent.change(input, { target: { value: "nuevo@mail.com" } });

    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  it("debe renderizar el contenido children si se pasa", () => {
    render(
      <InputGroup {...defaultProps}>
        <span data-testid="icon">🔒</span>
      </InputGroup>
    );

    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });
});
