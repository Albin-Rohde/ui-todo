import {
  Box,
  Divider,
  SwipeableDrawer,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { styled } from '@mui/system';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import AppName from './AppName';
import ListOfRecentLists from './ListOfRecentLists';
import ListOfTodoLists from './ListOfTodoLists';
import UserProfile from './UserProfile';


const SubHeading = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.2rem',
  color: '#007afe',
  margin: theme.spacing(2, 0, 1),
}));

interface SidePanelProps {
  isMobile: boolean;
  open?: boolean;
  toggleDrawer?: () => void;
}

const SidePanel = (props: SidePanelProps) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const content = (
    <>
      <Box marginLeft={1.5} marginTop={1} marginBottom={1}>
        <AppName styles={{ fontSize: isMobile ? '2em' : '3em' }}
                 onClick={() => navigate('/')}/>
      </Box>
      <Divider/>
      <Box marginTop={2} marginLeft={2}>
        <SubHeading>My Todos</SubHeading>
      </Box>
      <ListOfTodoLists/>
      <Box marginTop={0} marginLeft={2}>
        <SubHeading>Other Todos</SubHeading>
      </Box>
      <ListOfRecentLists/>
      <UserProfile isMobile={isMobile}/>
    </>
  )

  if (isMobile && props?.toggleDrawer) {
    return (
      <>
        <Box display="flex">
          <SwipeableDrawer
            anchor="left"
            open={!!props.open}
            onOpen={props.toggleDrawer}
            onClose={props.toggleDrawer}
          >
            <Box width={'60vw'}>{content}</Box>
          </SwipeableDrawer>
        </Box>
      </>
    );
  }
  return (
    <Box
      width={300}
      height="100vh"
      display="flex"
      flexDirection="column"
      bgcolor="#f5f5f5"
      borderRight="1px solid rgba(0, 0, 0, 0.12)"
      boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)"
    >
      {content}
    </Box>
  );
};

export default SidePanel;
