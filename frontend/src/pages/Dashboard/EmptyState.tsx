import { Box, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import PrimaryButton from '../../components/PrimaryButton';
import SidePanel from '../../components/SidePanel';
import { TodoListsContext } from '../../contexts/TodoListsContext';
import { useAuth } from '../../hooks/useAuth';
import useHttp from '../../hooks/useHttp';
import { TodoList } from '../../types';


function EmptyState() {
  const { loading } = useAuth({ redirectTo: '/signin' });
  const { todoLists, setTodolists } = useContext(TodoListsContext);
  const { sendRequest: sendCreate } = useHttp();
  const navigate = useNavigate();

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
    <Box display="flex">
      <SidePanel/>
      <Box sx={{
        backgroundColor: '#eaeaea',
        flex: '1 1 auto',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
    </Box>
  );
}

export default EmptyState;
