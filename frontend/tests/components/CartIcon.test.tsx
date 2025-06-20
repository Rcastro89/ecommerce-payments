import { render, screen } from '@testing-library/react';
import CartIcon from '../../src/components/CartIcon';
import { useSelector } from 'react-redux';


jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

describe('CartIcon', () => {
  it('debería mostrar contador cuando hay productos', () => {
    (useSelector as unknown as jest.Mock).mockReturnValue(5);

    render(<CartIcon />);
    expect(screen.getByText(/🛒 Carrito/)).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('no debería mostrar contador si está vacío', () => {
    (useSelector as unknown as jest.Mock).mockReturnValue(0);

    render(<CartIcon />);
    expect(screen.getByText(/🛒 Carrito/)).toBeInTheDocument();
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });
});
