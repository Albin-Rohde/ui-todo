import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import PrimaryButton from '../../components/PrimaryButton';
import { TodoListContext } from '../../contexts/TodoListContext';
import { useAuth } from '../../hooks/useAuth';
import useHttp from '../../hooks/useHttp';
import { TodoList } from '../../types';


function EmptyState() {
  const { loading } = useAuth({ redirectTo: '/signin' });
  const { todoLists, setTodolists } = useContext(TodoListContext);
  const { sendRequest: sendCreate } = useHttp();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (loading) {
    return <></>;
  }

  const createTodoList = async () => {
    const response = await sendCreate<TodoList>({
      path: '/todo-list',
      method: 'POST',
      body: {
        name: 'New Todo List',
      },
    });

    if (response.ok && response.data) {
      setTodolists([...todoLists, response.data]);
      navigate('/list/' + response.data.publicId + '?new');
    }
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
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <Typography variant="h4" sx={{ color: '#007afe', mb: 2 }}>
          Create or open a list to get started!
        </Typography>
        <Box sx={{ display: 'flex' }}>
          <PrimaryButton onClick={() => createTodoList()}>
            Create a list
          </PrimaryButton>
        </Box>
      </Box>
    </Box>
  );
}

export default EmptyState;
