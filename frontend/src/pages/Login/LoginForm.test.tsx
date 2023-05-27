import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import LoginForm from './LoginForm';

test('renders login form with email, username, password fields and sign in button', () => {
  render(
    <MemoryRouter>
      <LoginForm/>
    </MemoryRouter>
  );

  const emailField = screen.getByLabelText(/Email/i);
  expect(emailField).toBeInTheDocument();

  const passwordField = screen.getByLabelText(/Password/i);
  expect(passwordField).toBeInTheDocument();

  const signInButton = screen.getByRole('button', { name: /Sign in/i });
  expect(signInButton).toBeInTheDocument();
});
