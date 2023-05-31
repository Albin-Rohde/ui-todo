import { Box, CircularProgress, Divider, TextField } from '@mui/material';
import { styled } from '@mui/system';
import React, { useContext } from 'react';

import { TodoListContext } from '../../contexts/TodoListContext';
import { TodoListsContext, } from '../../contexts/TodoListsContext';
import useHttp from '../../hooks/useHttp';

interface TodoListProps {
  loading: boolean;
}

const ListContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flex: 1,
  backgroundColor: '#efefef',
});

export const TodoList = (props: TodoListProps) => {
  const { sendRequest } = useHttp();
  const { todoList, setTodolist } = useContext(TodoListContext);
  const { todoLists, setTodolists } = useContext(TodoListsContext);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!todoList) {
      return;
    }

    setTodolist({
      ...todoList,
      name: event.target.value,
    });
    setTodolists(todoLists?.map((list) => {
      if (list.id === todoList.id) {
        return {
          ...list,
          name: event.target.value,
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
      <ListContainer>
        <CircularProgress/>
      </ListContainer>
    );
  }

  return (
    <ListContainer>
      <TextField
        variant="standard"
        value={todoList.name}
        onChange={handleNameChange}
        onBlur={handleSaveClick}
        sx={{
          width: 'fit-content',
          textAlign: 'center',
        }}
        inputProps={{
          min: 0, style: { textAlign: 'center' },
        }}
        InputProps={{
          disableUnderline: true,
          sx: {
            width: 'fit-content',
            fontSize: '2rem',
            fontWeight: '',
            marginTop: '1.05rem',
            textAlign: 'center',
          },
        }}
      />
      <Divider sx={{ width: '100%', marginTop: 2, marginBottom: 2 }}/>
    </ListContainer>
  );
};
