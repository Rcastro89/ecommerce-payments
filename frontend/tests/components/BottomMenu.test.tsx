import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BottomMenu from '../../src/components/BottomMenu';

jest.mock('../../src/components/CartIcon', () => () => <span>🛒 Carrito</span>);

describe('BottomMenu', () => {
  it('debería renderizar los enlaces del menú inferior', () => {
    render(
      <MemoryRouter>
        <BottomMenu />
      </MemoryRouter>
    );

    expect(screen.getByText('🧸 Productos')).toBeInTheDocument();
    expect(screen.getByText('🛒 Carrito')).toBeInTheDocument();
  });

  it('debería contener enlaces con las rutas correctas', () => {
    render(
      <MemoryRouter>
        <BottomMenu />
      </MemoryRouter>
    );

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', '/');
    expect(links[1]).toHaveAttribute('href', '/cart');
  });
});
