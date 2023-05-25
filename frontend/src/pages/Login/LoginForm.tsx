import { Box, Link as MuiLink, TextField, Typography } from '@mui/material';
import { styled } from '@mui/system';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import InforMessageBox from '../../components/InforMessageBox';
import PrimaryButton from '../../components/PrimaryButton';

const Container = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  mt: 2,
}));

function LoginForm() {
  return (
    <Container>
      <Box component="form" sx={{
        display: 'flex',
        width: '90vw',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 350
      }}>
        <TextField label="Email" type="email" variant="outlined" fullWidth/>
        <TextField label="Password" type="password" variant="outlined" fullWidth/>
        <PrimaryButton variant="contained" color="primary" fullWidth>
          Sign in
        </PrimaryButton>
      </Box>
      <InforMessageBox>
        <Typography variant="body2">
          {'Don\'t have an account? '}
          <MuiLink to="/signup" component={RouterLink} underline="hover">
            Create one
          </MuiLink>.
        </Typography>

      </InforMessageBox>
    </Container>
  );
}

export default LoginForm;
