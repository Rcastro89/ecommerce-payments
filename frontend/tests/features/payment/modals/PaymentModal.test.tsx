
import { render, screen } from "@testing-library/react";
import { PaymentModal } from "../../../../src/features/payment/modals/PaymentModal";
import * as usePaymentsHook from "../../../../src/features/payment/hooks/usePayments";
import * as useCheckoutHook from "../../../../src/features/payment/hooks/useCheckout";
import * as useCartHook from "../../../../src/features/cart/hooks/useCart";

jest.mock("../../../../src/features/payment/hooks/usePayments");
jest.mock("../../../../src/features/payment/hooks/useCheckout");
jest.mock("../../../../src/features/cart/hooks/useCart");


describe("PaymentModal", () => {
  const mockOnClose = jest.fn();

  const basePaymentsMock = {
    formCardData: {
      cardNumber: "",
      expiry: "",
      cvv: "",
      cardHolder: "",
      installments: "",
    },
    formCardErrors: {
      cardNumber: "",
      expiry: "",
      cvv: "",
      cardHolder: "",
      installments: "",
    },
    formCustomerData: {
      idClient: "",
      fullName: "",
      address: "",
      phone: "",
      email: "",
    },
    formCustomerErrors: {
      idClient: "",
      fullName: "",
      address: "",
      phone: "",
      email: "",
    },
    cardType: "VISA",
    handleChangeCardForm: jest.fn(),
    handleSubmitCard: jest.fn(),
    handleChangeCustomerForm: jest.fn(),
    handleSubmitCustomer: jest.fn(),
    setShowForm: jest.fn(),
  };

  const checkoutMock = {
    checkout: jest.fn(),
    loading: false,
    status: "success",
  };

  beforeEach(() => {
    jest.spyOn(useCartHook, "useCart").mockReturnValue({
      subtotalPayment: 10000,
      baseFee: 1000,
      deliveryFee: 2000,
      totalPayment: 13000,
      totalItems: 3,
      cartItemsList: [],
      handleDeleteToCart: jest.fn(),
      handleDeleteOneItem: jest.fn(),
      handleDeleteToCartAll: jest.fn(),
    });
  });

  it("renderiza CardForm cuando showForm es 'viewCard'", () => {
    jest.spyOn(usePaymentsHook, "usePayments").mockReturnValue({
      ...basePaymentsMock,
      showForm: "viewCard",
      handleClose: mockOnClose,
    });
    jest.spyOn(useCheckoutHook, "useCheckout").mockReturnValue(checkoutMock as any);

    render(<PaymentModal onClose={mockOnClose} />);

    expect(screen.getByText(/número/i)).toBeInTheDocument();
  });

  it("renderiza CustomerForm cuando showForm es 'viewCustomer'", () => {
    jest.spyOn(usePaymentsHook, "usePayments").mockReturnValue({
      ...basePaymentsMock,
      showForm: "viewCustomer",
      handleClose: mockOnClose,
    });
    jest.spyOn(useCheckoutHook, "useCheckout").mockReturnValue(checkoutMock as any);

    render(<PaymentModal onClose={mockOnClose} />);

    expect(screen.getByText(/dirección de entrega/i)).toBeInTheDocument(); // Assuming CustomerForm has label
  });

  it("renderiza PaymentSummary cuando showForm es 'viewSummary'", () => {
    jest.spyOn(usePaymentsHook, "usePayments").mockReturnValue({
      ...basePaymentsMock,
      showForm: "viewSummary",
      handleClose: mockOnClose,
    });
    jest.spyOn(useCheckoutHook, "useCheckout").mockReturnValue(checkoutMock as any);

    render(<PaymentModal onClose={mockOnClose} />);

    expect(screen.getByText(/Pagar ahora/i)).toBeInTheDocument(); // Assuming PaymentSummary has button or title
  });

  it("muestra FullscreenLoader cuando loading es true", () => {
    jest.spyOn(usePaymentsHook, "usePayments").mockReturnValue({
      ...basePaymentsMock,
      showForm: "viewCard",
      handleClose: mockOnClose,
    });
    jest.spyOn(useCheckoutHook, "useCheckout").mockReturnValue({
      ...checkoutMock,
      loading: true,
      status: "loading",
    });

    render(<PaymentModal onClose={mockOnClose} />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
