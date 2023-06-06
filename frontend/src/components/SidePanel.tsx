import { Box, Divider, Typography } from '@mui/material';
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

const SidePanel = () => {
  const navigate = useNavigate();
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
      <Box marginLeft={1.5} marginTop={1} marginBottom={1}>
        <AppName styles={{ fontSize: '3em' }} onClick={() => navigate('/')}/>
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
      <UserProfile/>
    </Box>
  );
};

export default SidePanel;
