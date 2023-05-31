import { Box } from '@mui/material';
import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import SidePanel from '../../components/SidePanel';
import { TodoListContext } from '../../contexts/TodoListContext';
import { useAuth } from '../../hooks/useAuth';
import useHttp from '../../hooks/useHttp';

import { TodoList } from './TodoList';

function ListView() {
  const { loading } = useAuth({ redirectTo: '/signin' });
  const { id } = useParams();
  const { sendRequest, loading: fetchListLoading } = useHttp();
  const { setTodolist } = useContext(TodoListContext);

  useEffect(() => {
    const fetchList = async () => {
      const response = await sendRequest<{
        name: string;
        id: number;
        publicId: string;
      }>({
        path: '/todo-list/' + id,
        method: 'GET',
      });
      if (response.ok && response.data) {
        setTodolist(response.data);
      }
    };

    fetchList();
  }, [id]);

  return (
    <Box display="flex">
      <SidePanel/>
      <TodoList
        loading={fetchListLoading || loading}
      />
    </Box>
  );
}

export default ListView;
