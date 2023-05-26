import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { Router } from './router';

describe('correctly renders component based on route', () => {
  it('renders login page when path is "/login"', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
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
