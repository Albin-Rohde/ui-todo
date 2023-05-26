import { Box, ButtonProps } from '@mui/material';
import { styled } from '@mui/system';
import React from 'react';


const CustomBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#f5f5f5',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(2),
  width: 320,
  maxWidht: '90vw'
}));

interface PrimaryButtonProps extends ButtonProps {
  children: React.ReactNode;
}

const InforMessageBox: React.FC<PrimaryButtonProps> = ({ children }) => {
  return (
    <CustomBox>
      {children}
    </CustomBox>
  );
};

export default InforMessageBox;