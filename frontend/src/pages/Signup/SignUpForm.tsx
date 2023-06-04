import {
  Box,
  CircularProgress,
  Link as MuiLink,
  TextField,
  Typography
} from '@mui/material';
import { styled } from '@mui/system';
import React, { MouseEvent, useContext, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import InforMessageBox from '../../components/InforMessageBox';
import PrimaryButton from '../../components/PrimaryButton';
import { UserContext } from '../../contexts/UserContext';
import useHttp from '../../hooks/useHttp';
import { isValidationError } from '../../typeguard';
import { User } from '../../types';

const Container = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  mt: 2,
}));

interface FormFieldError {
  email: string,
  username: string,
  password: string,
  confirmPassword: string,
}

function SignUpForm() {
  const { loading, sendRequest } = useHttp();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState<FormFieldError>({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const checkFormForError = (): { ok: boolean, errors: FormFieldError } => {
    let ok = true;
    const errors: FormFieldError = {
      email: email ? '' : 'Email is required.',
      username: username ? '' : 'Username is required.',
      password: password ? '' : 'Password is required.',
      confirmPassword: confirmPassword ? '' : 'Confirm password is required.',
    }
    if (!email || !username || !password || !confirmPassword) {
      ok = false;
    }
    if ((password && confirmPassword) && (password !== confirmPassword)) {
      errors['confirmPassword'] = 'Passwords do not match.';
      ok = false;
    }
    return { ok, errors };
  }

  const handleFormSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFormError({
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    })
    const { ok, errors } = checkFormForError();
    if (!ok) {
      setFormError(errors);
      return;
    }

    const responseData = await sendRequest<User>({
      path: '/user',
      method: 'POST',
      body: {
        email,
        username,
        password,
        passwordConfirmation: confirmPassword,
      }
    })
    if (!responseData.ok && isValidationError(responseData.err)) {
      const { field, message } = responseData.err.extra
      setFormError({
        ...errors,
        [field]: message,
      });
    }
    if (responseData.ok && responseData.data) {
      setUser(responseData.data);
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
          value={email}
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          helperText={formError.email}
          error={formError.email !== ''}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          value={username}
          label="Username"
          type="text"
          variant="outlined"
          fullWidth
          helperText={formError.username}
          error={formError.username !== ''}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          value={password}
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          helperText={formError.password}
          error={formError.password !== ''}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          value={confirmPassword}
          label="Confirm password"
          type="password"
          variant="outlined"
          fullWidth
          helperText={formError.confirmPassword}
          error={formError.confirmPassword !== ''}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <PrimaryButton
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleFormSubmit}
        >
          {loading ? <CircularProgress size={24} color="inherit"/> : 'Sign up'}
        </PrimaryButton>
      </Box>
      <InforMessageBox>
        <Typography variant="body2">
          Already have an account? {' '}
          <MuiLink to="/signin" component={RouterLink} underline="hover">
            Sign in
          </MuiLink>.
        </Typography>
      </InforMessageBox>
    </Container>
  );
}

export default SignUpForm;
