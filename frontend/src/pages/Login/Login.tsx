import { Box } from '@mui/material';
import React from 'react';

import AppName from '../../components/AppName';

import LoginForm from './LoginForm';


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

function Login() {
  return (
    <Box sx={styles.container}>
      <Box>
        <AppName animate styles={{ marginBottom: '5vh', textAlign: 'center' }}/>
        <LoginForm/>
      </Box>
    </Box>
  );
}

export default Login;
