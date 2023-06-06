import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, IconButton, Toolbar } from '@mui/material';
import React from 'react';

import AppName from '../../../components/AppName';

interface TopBarProps {
  toggleDrawer: () => void;
}

export const TopBar = (props: TopBarProps): React.ReactElement => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: '#f8f8f8',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          height: '65px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={props.toggleDrawer}
          >
            <MenuIcon/>
          </IconButton>
          <AppName styles={{ fontSize: '2em' }}/>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
