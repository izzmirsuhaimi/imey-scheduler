import { render, screen } from '@testing-library/react';
import App from './App';

test('renders landing page brand name', () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1, name: /imey/i })).toBeInTheDocument();
});
