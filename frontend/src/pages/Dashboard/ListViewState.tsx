import { useMediaQuery, useTheme } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { TodoItemContext } from '../../contexts/TodoItemsContext';
import { TodoListContext } from '../../contexts/TodoListContext';
import { useAuth } from '../../hooks/useAuth';
import useHttp from '../../hooks/useHttp';
import useSocketIO from '../../hooks/useSocketIO';
import * as t from '../../types';
import { TodoItem } from '../../types';

import NotFoundState from './NotFoundState';
import { TodoList } from './TodoItems/TodoList';

function ListViewState() {
  const { loading } = useAuth({ redirectTo: '/signin' });
  const { id } = useParams();
  const { sendRequest, loading: fetchListLoading } = useHttp();
  const { setCurrentTodolist } = useContext(TodoListContext);
  const { setTodoItems } = useContext(TodoItemContext);
  const [notFound, setNotFound] = useState(false);
  const [prevId, setPrevId] = useState<string | null>(null);
  const { socket, isConnected } = useSocketIO();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchList = async () => {
      const response = await sendRequest<t.TodoList>({
        path: '/todo-list/' + id,
        method: 'GET',
      });
      if (response.ok && response.data) {
        setNotFound(false);
        setCurrentTodolist(response.data);
      }
      if (!response.ok && response.err?.name === 'NotFoundError') {
        setCurrentTodolist(null);
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

  if (notFound) {
    return (
      <>
        <NotFoundState isMobile={isMobile}/>
      </>
    );
  }

  return (
    <>
      <TodoList loading={fetchListLoading || loading} isMobile={isMobile}/>
    </>
  );
}

export default ListViewState;
