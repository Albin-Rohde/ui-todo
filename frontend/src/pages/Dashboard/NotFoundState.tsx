import { Box, Typography } from '@mui/material';
import React from 'react';

import { useAuth } from '../../hooks/useAuth';


function NotFoundState({ isMobile }: { isMobile: boolean }) {
  const { loading } = useAuth({ redirectTo: '/signin' });

  if (loading) {
    return <></>;
  }

  return (
    <Box sx={{
      backgroundColor: '#eaeaea',
      flex: '1 1 auto',
      minHeight: isMobile ? 'calc(100dvh - 65px)' : 'inherit',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ color: '#007afe', mb: 2, textAlign: 'center' }}>
          It seems like the list you are trying to view does not exist.
        </Typography>
      </Box>
    </Box>
  );
}

export default NotFoundState;
