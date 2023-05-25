import React from 'react';
import {Box, Link as MuiLink, TextField, Typography} from '@mui/material';
import {styled} from '@mui/system';
import PrimaryButton from "../../components/PrimaryButton";
import {Link as RouterLink} from 'react-router-dom';
import InforMessageBox from "../../components/InforMessageBox";

const Container = styled(Box)(({theme}) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  mt: 2,
}));

function SignUpForm() {
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
        <TextField label="Username" type="text" variant="outlined" fullWidth/>
        <TextField label="Password" type="password" variant="outlined" fullWidth/>
        <PrimaryButton variant="contained" color="primary" fullWidth>
          Sign in
        </PrimaryButton>
      </Box>
      <InforMessageBox>
        <Typography variant="body2">
          Already have an account? {' '}
          <MuiLink to="/login" component={RouterLink} underline="hover">
            Sign up
          </MuiLink>.
        </Typography>
      </InforMessageBox>
    </Container>
  )
}

export default SignUpForm;
