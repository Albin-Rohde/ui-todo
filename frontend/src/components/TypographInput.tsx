import { TextField } from '@mui/material';
import React from 'react';

interface TypographInputProps {
  text: string;
  fontSize: string;
  onChange: (text: string) => void;
  onBlur: () => void;
  textAlign: 'left' | 'center' | 'right';
  marginTop?: string;
}

const TypographInput = (props: TypographInputProps) => {
  return (
    <TextField
      variant="standard"
      value={props.text}
      onChange={(event) => props.onChange(event.target.value)}
      onBlur={props.onBlur}
      sx={{
        textAlign: props.textAlign,
        margin: 0,
        padding: 0,
        width: '100%',
      }}
      inputProps={{
        min: 0,
        style: {
          textAlign: props.textAlign,
          margin: 0,
          width: '100%',
        },
      }}
      InputProps={{
        disableUnderline: true,
        sx: {
          fontSize: props.fontSize || '2rem',
          fontWeight: '',
          marginTop: props.marginTop || '1.05rem',
          textAlign: props.textAlign,
          width: '100%',
        },
      }}
      fullWidth
    />
  )
}

export default TypographInput;