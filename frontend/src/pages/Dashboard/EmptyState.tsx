import { Box } from '@mui/material';
import React from 'react';

import SidePanel from '../../components/SidePanel';
import { useAuth } from '../../hooks/useAuth';


function EmptyState() {
  const { loading } = useAuth({ redirectTo: '/signin' });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box display="flex">
      <SidePanel/>
      <Box>
        Create a new list today! :)
      </Box>
    </Box>
  );
}

export default EmptyState;
