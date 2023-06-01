import { Box, Checkbox } from '@mui/material';
import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';

import { SocketContext } from '../contexts/SocketContext';
import { TodoItemContext } from '../contexts/TodoItemsContext';
import useHttp from '../hooks/useHttp';
import { TodoItem } from '../types';

import TypographInput from './TypographInput';

interface TodoItemCheckboxProps {
  item: TodoItem,
  fontSize: string;
}

const TodoItemCheckbox = (props: TodoItemCheckboxProps) => {
  const { setTodoItems } = useContext(TodoItemContext)
  const { id } = useParams()
  const { sendRequest: updateNameRequest } = useHttp();
  const { sendRequest: updateCheckedRequest } = useHttp();
  const { socket } = useContext(SocketContext);

  const handleCheckboxClick = () => {
    setTodoItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === props.item.id) {
          return {
            ...item,
            completed: !item.completed,
          };
        }
        return item;
      })
    );

    socket?.emit('todoitem.update-todo-item', {
      listId: id,
      id: props.item.id,
      text: props.item.text,
      completed: !props.item.completed,
    });
  };

  const handleChangeText = (text: string) => {
    setTodoItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === props.item.id) {
          return {
            ...item,
            text,
          };
        }
        return item;
      })
    );
    socket?.emit('todoitem.update-todo-item', {
      listId: id,
      id: props.item.id,
      completed: props.item.completed,
      text,
    })
  };

  return (
    <Box
      sx={{ display: 'flex', height: '30px', width: '100%' }}
    >
      <Checkbox
        sx={{ height: '30px', marginTop: '0px', paddingTop: 0, paddingBottom: 0 }}
        checked={props.item.completed}
        onClick={handleCheckboxClick}
      />
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
      }}>
        <TypographInput
          text={props.item.text}
          fontSize={props.fontSize}
          onChange={handleChangeText}
          textAlign="left"
          marginTop="0px"
        />
      </Box>
    </Box>
  )
};

export default TodoItemCheckbox;