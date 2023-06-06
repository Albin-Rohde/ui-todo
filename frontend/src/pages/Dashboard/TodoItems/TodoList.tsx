import { Box, CircularProgress, Divider } from '@mui/material';
import { styled } from '@mui/system';
import React, { useContext } from 'react';

import TypographInput from '../../../components/TypographInput';
import { TodoListContext } from '../../../contexts/TodoListContext';
import { TodoListsContext, } from '../../../contexts/TodoListsContext';
import useHttp from '../../../hooks/useHttp';

import TodoItemsList from './TodoItemsList';

interface TodoListProps {
  loading: boolean;
  isMobile: boolean;
}

const ListNameContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flex: 1,
  backgroundColor: '#eaeaea',
});

export const TodoList = (props: TodoListProps) => {
  const { sendRequest } = useHttp();
  const { currentTodoList, setCurrentTodolist } = useContext(TodoListContext);
  const { todoLists, setTodolists } = useContext(TodoListsContext);

  const handleNameChange = (text: string) => {
    if (!currentTodoList) {
      return;
    }

    setCurrentTodolist({
      ...currentTodoList,
      name: text,
    });
    setTodolists(todoLists?.map((list) => {
      if (list.id === currentTodoList.id) {
        return {
          ...list,
          name: text,
        };
      }
      return list;
    }));
  };
  const handleSaveClick = async () => {
    await sendRequest({
      path: '/todo-list/' + currentTodoList?.publicId,
      method: 'PUT',
      body: {
        name: currentTodoList?.name,
      }
    })
  };

  if (props.loading || !currentTodoList) {
    return (
      <ListNameContainer
        sx={{ height: props.isMobile ? 'calc(100dvh - 65px)' : 'inherit' }}>
        <CircularProgress sx={{ marginTop: 15 }}/>
      </ListNameContainer>
    );
  }

  return (
    <>
      <ListNameContainer
        sx={{ height: props.isMobile ? 'calc(100dvh - 65px)' : 'inherit' }}>
        <TypographInput
          text={currentTodoList.name}
          fontSize={props.isMobile ? '1.4rem' : '2rem'}
          onChange={handleNameChange}
          onBlur={handleSaveClick}
          textAlign={'center'}
        />
        <Divider
          sx={{ width: '100%', marginTop: props.isMobile ? 1 : 2, marginBottom: 0 }}/>
        <Box sx={{
          display: 'flex',
          width: '100%',
          textAlign: 'left'
        }}>
          <TodoItemsList/>
        </Box>
      </ListNameContainer>
    </>
  );
};
