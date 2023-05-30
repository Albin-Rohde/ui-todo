import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserContext } from '../contexts/UserContext';
import { User } from '../types';

import useHttp from './useHttp';

interface RedirectOptions {
  redirectTo: string;
  redirectOn?: 'loggedIn' | 'loggedOut';
}

export const useAuth = (redirect: RedirectOptions) => {
  if (redirect && !redirect.redirectOn) {
    redirect.redirectOn = 'loggedOut';
  }

  const { user, setUser } = useContext(UserContext);
  const { sendRequest, error } = useHttp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(false)
      redirect && redirect.redirectOn === 'loggedIn' && navigate(redirect.redirectTo);
      return;
    }
    const checkAuth = async () => {
      const { ok, data } = await sendRequest<User>({
        path: '/user/session',
        method: 'GET'
      });

      if (ok && data) {
        // User is logged in, allow access
        setUser(data);
        setLoading(false);
        redirect && redirect.redirectOn === 'loggedIn' && navigate(redirect.redirectTo);
      } else {
        // User is not logged in, redirect to sign-in page
        setLoading(false);
        redirect && redirect.redirectOn === 'loggedOut' && navigate(redirect.redirectTo);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (error) {
      navigate('/signin');
    }
  }, [error]);

  return { loading };
};
