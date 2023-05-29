import { Box } from '@mui/material';
import React from 'react';

import AppName from '../../components/AppName';
import { useAuth } from '../../hooks/useAuth';

import SignUpForm from './SignUpForm';


const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
  },
  heading: {
    marginBottom: '1rem',
    textAlign: 'center',
  },
};

function Signup() {
  const { loading } = useAuth({ redirectTo: '/', redirectOn: 'loggedIn' });
  if (loading) {
    return <></>;
  }
  return (
    <Box sx={styles.container}>
      <Box>
        <AppName styles={{ marginBottom: '5vh', textAlign: 'center' }}/>
        <SignUpForm/>
      </Box>
    </Box>
  );
}

export default Signup;
