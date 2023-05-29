import { Button, ButtonProps, styled } from '@mui/material';
import React from 'react';


const StyledButton = styled(Button)(() => ({
  backgroundColor: '#f8f8f8',
  color: '#007afe',
  border: '2px solid #007afe',
  boxShadow: 'none',
  borderRadius: '6px',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#cde3fa',
    color: '#007afe',
    border: '2px solid #007afe',
    boxShadow: 'none',
  },
}));

interface SecondaryButtonProps extends ButtonProps {
  children: React.ReactNode;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({ children, ...props }) => (
  <StyledButton {...props}>
    {children}
  </StyledButton>
);

export default SecondaryButton;
