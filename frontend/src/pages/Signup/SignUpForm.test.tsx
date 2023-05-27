import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import SignUpForm from './SignUpForm';

test('renders sign up form with email, username, password fields and sign up button', () => {
  render(
    <MemoryRouter>
      <SignUpForm/>
    </MemoryRouter>
  );

  const emailField = screen.getByLabelText(/Email/i);
  expect(emailField).toBeInTheDocument();

  const usernameField = screen.getByLabelText(/Username/i);
  expect(usernameField).toBeInTheDocument();

  const passwordField = screen.getByLabelText(/Password/);
  expect(passwordField).toBeInTheDocument();

  const signInButton = screen.getByRole('button', { name: /Sign up/i });
  expect(signInButton).toBeInTheDocument();
});
