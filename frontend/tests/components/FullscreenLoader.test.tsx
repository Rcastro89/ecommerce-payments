import { render, screen } from '@testing-library/react';
import { FullscreenLoader } from '../../src/components/FullscreenLoader';

describe('FullscreenLoader', () => {
  it('debería mostrar el spinner si el estado es "loading"', () => {
    render(<FullscreenLoader status="loading" />);
    expect(screen.getByRole('status')).toHaveClass('spinner');
  });

  it('debería mostrar el checkmark si el estado es "success"', () => {
    render(<FullscreenLoader status="success" />);
    expect(screen.getByText('✓')).toBeInTheDocument();
    expect(screen.getByText('✓')).toHaveClass('checkmark');
  });

  it('debería mostrar el mensaje de error si el estado es "error"', () => {
    render(<FullscreenLoader status="error" />);
    expect(screen.getByText('✕')).toBeInTheDocument();
    expect(screen.getByText(/Ocurrió un error/i)).toBeInTheDocument();
  });
});
