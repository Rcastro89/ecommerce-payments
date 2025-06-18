import './Backdrop.scss';

interface BackdropProps {
  children: React.ReactNode;
}

export const Backdrop = ({ children }: BackdropProps) => {
  return <div className="backdrop">{children}</div>;
};