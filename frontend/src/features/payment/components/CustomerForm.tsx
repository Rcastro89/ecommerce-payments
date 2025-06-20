import type { FormCustomerData } from "../../../types/customer";
import { InputGroup } from "./InputGroup";

interface Props {
    goBack: () => void;
    handleSubmit: (e: React.FormEvent) => void;
    formCustomerData: FormCustomerData;
    formErrors: FormCustomerData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const CustomerForm = ({
    goBack,
    handleSubmit,
    formCustomerData,
    formErrors,
    handleChange
}: Props) => {
    return (
        <>
            <header>
                <h2>Destinatario</h2>
            </header>
            <form id="payment-customer-form" onSubmit={handleSubmit}>
                <fieldset>
                    <legend>Datos de entrega</legend>
                    < InputGroup
                        nameInput="idClient"
                        value={formCustomerData.idClient ?? ''}
                        onChange={handleChange}
                        type="text"
                        label="Cédula"
                    />
                    < InputGroup
                        nameInput="fullName"
                        value={formCustomerData.fullName ?? ''}
                        onChange={handleChange}
                        type="text"
                        label="Nombre del destinatario"
                    />

                    < InputGroup
                        nameInput="address"
                        value={formCustomerData.address ?? ''}
                        onChange={handleChange}
                        type="text"
                        label="Dirección de entrega"
                    />
                    < InputGroup
                        nameInput="phone"
                        value={formCustomerData.phone ?? ''}
                        onChange={handleChange}
                        type="text"
                        label="Teléfono"
                    />
                    < InputGroup
                        nameInput="email"
                        value={formCustomerData.email ?? ''}
                        onChange={handleChange}
                        type="text"
                        label="Correo electrónico"
                    />
                </fieldset>
                <p>
                    {Object.keys(formErrors).map(key => {
                        const value = formErrors[key as keyof FormCustomerData];
                        return value ? <span key={key} className="error-message">{value}<br /></span> : null;
                    })}
                </p>
            </form>
            <footer className="modal-buttons">
                <button form="payment-customer-form" type="submit">Confirmar datos</button>

                <button type="button" onClick={goBack}>Volver</button>
            </footer>
        </>
    )
}