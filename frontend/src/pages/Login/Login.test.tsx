import React from 'react';
import { render, screen } from '@testing-library/react';
import Login from "./Login";

test('renders Login page', () => {
  render(<Login />);
  const linkElement = screen.getByText(/Login page/i);
  expect(linkElement).toBeInTheDocument();
});