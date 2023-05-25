import { Button, ButtonProps, styled } from '@mui/material';
import React from 'react';


const StyledButton = styled(Button)(() => ({
  backgroundColor: '#007afe',
  color: '#f8f8f8',
  border: '2px solid #007afe',
  boxShadow: 'none',
  borderRadius: '6px',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#f8f8f8',
    color: '#007afe',
    border: '2px solid #007afe',
    boxShadow: 'none',
  },
}));

interface PrimaryButtonProps extends ButtonProps {
  children: React.ReactNode;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ children, ...props }) => (
  <StyledButton {...props}>
    {children}
  </StyledButton>
);

export default PrimaryButton;
