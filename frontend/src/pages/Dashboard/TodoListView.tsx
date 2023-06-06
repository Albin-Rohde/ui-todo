import { Box } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import SidePanel from '../../components/SidePanel';
import { TodoItemContext } from '../../contexts/TodoItemsContext';
import { TodoListContext } from '../../contexts/TodoListContext';
import { useAuth } from '../../hooks/useAuth';
import useHttp from '../../hooks/useHttp';
import useSocketIO from '../../hooks/useSocketIO';
import * as t from '../../types';
import { TodoItem } from '../../types';

import NotFoundState from './NotFoundState';
import { TodoList } from './TodoList';

function ListView() {
  const { loading } = useAuth({ redirectTo: '/signin' });
  const { id } = useParams();
  const { sendRequest, loading: fetchListLoading } = useHttp();
  const { setTodolist } = useContext(TodoListContext);
  const { setTodoItems } = useContext(TodoItemContext);
  const [notFound, setNotFound] = useState(false);
  const [prevId, setPrevId] = useState<string | null>(null);
  const { socket, isConnected } = useSocketIO();

  useEffect(() => {
    const fetchList = async () => {
      const response = await sendRequest<t.TodoList>({
        path: '/todo-list/' + id,
        method: 'GET',
      });
      if (response.ok && response.data) {
        setNotFound(false);
        setTodolist(response.data);
      }
      if (!response.ok && response.err?.name === 'NotFoundError') {
        setTodolist(null);
        setNotFound(true);
      }
    };

    const fetchItems = async () => {
      const response = await sendRequest<TodoItem[]>({
        path: `/todo-list/${id}/todo-item`,
        method: 'GET',
      });
      if (response.ok && response.data) {
        setTodoItems(response.data);
      }
    }

    fetchItems();
    fetchList();
  }, [id]);

  useEffect(() => {
    if (isConnected && id) {
      joinListRoom(id);
    }
  }, [isConnected, id]);

  const joinListRoom = (publicId: string) => {
    if (prevId && prevId == publicId) {
      // we do not need to join a room we are already in
      return;
    }
    socket?.emit('todolist.join-room', { id: publicId });
    // if prevId is different from the new list id, we need to leave the previous room
    if (prevId && prevId !== publicId) {
      socket?.emit('todolist.leave-room', { id: prevId });
    }
    setPrevId(publicId);
  }

  return (
    <Box display="flex">
      <SidePanel/>
      {notFound ? <NotFoundState/> : (
        <TodoList
          loading={fetchListLoading || loading}
        />
      )}
    </Box>
  );
}

export default ListView;
