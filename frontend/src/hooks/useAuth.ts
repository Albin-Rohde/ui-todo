import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useHttp from './useHttp';

interface RedirectOptions {
  redirectTo: string;
  redirectOn?: 'loggedIn' | 'loggedOut';
}

export const useAuth = (redirect: RedirectOptions) => {
  if (redirect && !redirect.redirectOn) {
    redirect.redirectOn = 'loggedOut';
  }

  const { sendRequest } = useHttp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const response = await sendRequest({ path: '/user/session', method: 'GET' });

      if (response.ok && response.data === 'ok') {
        // User is logged in, allow access
        setLoading(false);
        redirect && redirect.redirectOn === 'loggedOut' && navigate(redirect.redirectTo);
      } else {
        // User is not logged in, redirect to sign-in page
        setLoading(false);
        redirect && redirect.redirectOn === 'loggedIn' && navigate(redirect.redirectTo);
      }
    };

    checkAuth();
  }, [navigate, sendRequest]);

  return { loading };
};
