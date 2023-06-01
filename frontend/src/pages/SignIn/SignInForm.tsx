import { Box, Link as MuiLink, TextField, Typography } from '@mui/material';
import { styled } from '@mui/system';
import React, { useContext, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import InforMessageBox from '../../components/InforMessageBox';
import PrimaryButton from '../../components/PrimaryButton';
import { UserContext } from '../../contexts/UserContext';
import useHttp from '../../hooks/useHttp';
import { isValidationError } from '../../typeguard';

const Container = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  mt: 2,
}));

interface FormFieldError {
  email: string,
  password: string,
}

function SignInForm() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [formError, setFormError] = useState<FormFieldError>({
    email: '',
    password: '',
  });
  const { sendRequest } = useHttp();
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const checkFormForError = (): { ok: boolean, errors: FormFieldError } => {
    let ok = true;
    const errors: FormFieldError = {
      email: email ? '' : 'Email is required.',
      password: password ? '' : 'Password is required.',
    }
    if (!email || !password) {
      ok = false;
    }
    return { ok, errors };
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFormError({
      email: '',
      password: '',
    });
    const { ok, errors } = checkFormForError();
    if (!ok) {
      setFormError(errors);
      return;
    }

    const response = await sendRequest<{
      id: number,
      email: string,
      username: string,
    }>({
      path: '/user/signin',
      method: 'POST',
      body: {
        email,
        password,
      }
    })

    if (!response.ok && isValidationError(response.err)) {
      const { field, message } = response.err.extra
      setFormError({
        ...errors,
        [field]: message,
      });
      return;
    }
    if (response.data) {
      setUser(response.data);
      navigate('/');
    }
  }

  return (
    <Container>
      <Box component="form" sx={{
        display: 'flex',
        width: '90vw',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 350
      }}>
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          error={formError.email !== ''}
          helperText={formError.email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          error={formError.password !== ''}
          helperText={formError.password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <PrimaryButton variant="contained" color="primary" fullWidth
                       onClick={handleSubmit}>
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

export default SignInForm;
