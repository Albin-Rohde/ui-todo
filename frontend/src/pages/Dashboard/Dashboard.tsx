import { Box, useMediaQuery, useTheme } from '@mui/material';
import React, { useState } from 'react';

import SidePanel from './SidePanel/SidePanel';
import { TopBar } from './SidePanel/TopBar';


interface DashboardProps {
  children: React.ReactNode;
}

export const Dashboard = (props: DashboardProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  }

  return (
    <>
      {isMobile && <TopBar toggleDrawer={toggleDrawer}/>}
      <Box display={'flex'}>
        <SidePanel toggleDrawer={toggleDrawer} open={drawerOpen} isMobile={isMobile}/>
        {props.children}
      </Box>
    </>
  )
}