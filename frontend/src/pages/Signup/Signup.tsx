import React from 'react';
import {Box} from '@mui/material';
import SignUpForm from './SignUpForm';
import AppName from "../../components/AppName";

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
  return (
    <Box sx={styles.container}>
      <Box>
        <AppName styles={{marginBottom: '5vh', textAlign: 'center'}}/>
        <SignUpForm/>
      </Box>
    </Box>
  );
}

export default Signup;
