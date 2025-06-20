import { Backdrop } from "../../../components/Backdrop";
import { FullscreenLoader } from "../../../components/FullscreenLoader";
import { CardForm } from "../components/CardForm";
import { CustomerForm } from "../components/CustomerForm";
import { PaymentSummary } from "../components/PaymentSummary";
import { useCheckout } from "../hooks/useCheckout";
import { usePayments } from "../hooks/usePayments";

import "./PaymentModal.scss";

interface Props {
    onClose: () => void;
}

export const PaymentModal = ({ onClose }: Props) => {
    const {
        formCardData,
        formCardErrors,
        formCustomerData,
        formCustomerErrors,
        cardType,
        showForm,
        handleChangeCardForm,
        handleSubmitCard,
        handleChangeCustomerForm,
        handleSubmitCustomer,
        setShowForm
    } = usePayments(onClose);

    const { checkout, loading, status } = useCheckout();

    return (
        <Backdrop>
            {loading && <FullscreenLoader status={status} />}
            <dialog open className="payment-modal" aria-modal="true">
                <article>
                    {showForm === "viewCard" && (
                        <CardForm
                            formData={formCardData}
                            formErrors={formCardErrors}
                            cardType={cardType}
                            handleSubmit={handleSubmitCard}
                            handleChange={handleChangeCardForm}
                            onClose={onClose}
                        />
                    )}
                    {showForm === "viewCustomer" && (
                        <CustomerForm
                            goBack={() => { setShowForm('viewCard') }}
                            handleSubmit={handleSubmitCustomer}
                            formCustomerData={formCustomerData}
                            formErrors={formCustomerErrors}
                            handleChange={handleChangeCustomerForm}
                        />
                    )}
                    {showForm === "viewSummary" && (
                        <PaymentSummary
                            goBack={() => { setShowForm('viewCustomer') }}
                            sendPayment={() => { checkout(formCardData, formCustomerData) }}
                        />
                    )}
                </article>
            </dialog>
        </Backdrop>
    );
}