import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { Router } from './router';

jest.mock('./hooks/useAuth', () => ({
  useAuth: () => ({ loading: false }),
}));

describe('correctly renders component based on route and session state', () => {

  it('renders signin page when path is "/signin"', () => {
    render(
      <MemoryRouter initialEntries={['/signin']}>
        <Router/>
      </MemoryRouter>
    );
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });

  it('renders signup page when path is "/signup"', () => {
    render(
      <MemoryRouter initialEntries={['/signup']}>
        <Router/>
      </MemoryRouter>
    );
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });
});
