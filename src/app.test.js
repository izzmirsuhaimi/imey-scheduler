import { render, screen } from '@testing-library/react';
import App from './app';

test('renders landing page brand name', () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1, name: /scheduler-inator/i })).toBeInTheDocument();
});
