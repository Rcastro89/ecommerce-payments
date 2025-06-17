import './InputGroup.scss';

interface Props {
    nameInput: string;
    value: string;
    customClass?: string;
    inputMode?: 'numeric' | 'text';
    placeholder?: string;
    required?: boolean;
    type?: 'text' | 'password' | 'email' | 'number';
    children?: React.ReactNode; // para insertar nodos como íconos, etc.
    label?: string;
    maxLength?: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const InputGroup = ({ 
    value, 
    customClass, 
    onChange, 
    nameInput, 
    inputMode, 
    placeholder, 
    required = false, 
    type,
    children,
    label,
    maxLength,
 }: Props) => {
    return (
        <div className={`input-group ${customClass ?? ""}`}>
            <label htmlFor={nameInput}>{label ?? ""}</label>
            <input
                id={nameInput}
                name={nameInput}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                maxLength={maxLength}
                inputMode={inputMode ?? 'text'}
            />
            {children}
        </div>
    )
}