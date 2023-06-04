import { Box, CircularProgress, Divider } from '@mui/material';
import { styled } from '@mui/system';
import React, { useContext } from 'react';

import TypographInput from '../../components/TypographInput';
import { TodoListContext } from '../../contexts/TodoListContext';
import { TodoListsContext, } from '../../contexts/TodoListsContext';
import useHttp from '../../hooks/useHttp';

import TodoItemsList from './TodoItemsList';

interface TodoListProps {
  loading: boolean;
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
  const { todoList, setTodolist } = useContext(TodoListContext);
  const { todoLists, setTodolists } = useContext(TodoListsContext);

  const handleNameChange = (text: string) => {
    if (!todoList) {
      return;
    }

    setTodolist({
      ...todoList,
      name: text,
    });
    setTodolists(todoLists?.map((list) => {
      if (list.id === todoList.id) {
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
      path: '/todo-list/' + todoList?.publicId,
      method: 'PUT',
      body: {
        name: todoList?.name,
      }
    })
  };

  if (props.loading || !todoList) {
    return (
      <ListNameContainer>
        <Divider sx={{ width: '100%', marginTop: 11, marginBottom: 2 }}/>
        <CircularProgress sx={{ marginTop: 8 }}/>
      </ListNameContainer>
    );
  }

  return (
    <>
      <ListNameContainer>
        <TypographInput
          text={todoList.name}
          fontSize={'2rem'}
          onChange={handleNameChange}
          onBlur={handleSaveClick}
          textAlign={'center'}
        />
        <Divider sx={{ width: '100%', marginTop: 2, marginBottom: 0 }}/>
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
