import './FullscreenLoader.scss';

interface Props {
    status: string;
}

export const FullscreenLoader = ({ status }: Props) => {
    return (
        <div className={`fullscreen-loader ${status}`}>
            {status === 'loading' && <div className="spinner" />}
            {status === 'success' && <div className="checkmark">✓</div>}
            {status === 'error' && (
                <>
                    <div className="cross">✕</div>
                    <div className="cross text-error">Ocurrió un error al procesar el pago</div>
                </>
            )}
        </div>
    );
};
