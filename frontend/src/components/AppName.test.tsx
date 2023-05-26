import { render, screen, waitFor } from '@testing-library/react';

import AppName from './AppName';


describe('AppName', () => {
  it('Displays static name when animate is false', () => {
    render(<AppName animate={false}/>);
    expect(screen.getByText('Ubi-to-do')).toBeInTheDocument();
  });

  it('Animation start at "U"', async () => {
    render(<AppName animate={true}/>);
    await waitFor(
      () => expect(screen.getByText('U')).toBeInTheDocument(),
      { timeout: 100 }
    );
  });

  it('Animation spells out Ubiquiti after 1000ms', async () => {
    render(<AppName animate={true}/>);
    await waitFor(
      () => expect(screen.getByText('Ubiquiti')).toBeInTheDocument(),
      { timeout: 1000 }
    );
  });

  it('Animation spells out Ubi-to-do after 2500ms', async () => {
    render(<AppName animate={true}/>);
    await waitFor(
      () => expect(screen.getByText('Ubiquiti')).toBeInTheDocument(),
      { timeout: 2500 }
    );
  });
});
