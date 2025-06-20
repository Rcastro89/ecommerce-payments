import { render, screen } from '@testing-library/react';
import { Backdrop } from '../../src/components/Backdrop';

describe('Backdrop', () => {
  it('debería renderizar el contenido hijo correctamente', () => {
    render(
      <Backdrop>
        <p>Contenido dentro del backdrop</p>
      </Backdrop>
    );

    expect(screen.getByText(/Contenido dentro del backdrop/i)).toBeInTheDocument();
  });

  it('debería tener la clase CSS "backdrop"', () => {
    render(
      <Backdrop>
        <span>Test</span>
      </Backdrop>
    );

    const backdropElement = screen.getByText('Test').parentElement;
    expect(backdropElement).toHaveClass('backdrop');
  });
});
