import { Box, Checkbox } from '@mui/material';
import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';

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

  const handleCheckboxClick = () => {
    setTodoItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === props.item.id) {
          return {
            ...item,
            complete: !item.complete,
          };
        }
        return item;
      })
    );
    updateCheckedRequest({
      path: `/todo-list/${id}/todo-item/${props.item.id}`,
      method: 'PUT',
      body: {
        complete: !props.item.complete,
        text: props.item.text,
      }
    })
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
  };

  const handleBlur = async () => {
    await updateNameRequest({
      path: `/todo-list/${id}/todo-item/${props.item.id}`,
      method: 'PUT',
      body: {
        text: props.item.text,
        complete: props.item.complete,
      }
    })
  }

  return (
    <Box
      sx={{ display: 'flex', height: '30px', width: '100%' }}
    >
      <Checkbox
        sx={{ height: '30px', marginTop: '0px', paddingTop: 0, paddingBottom: 0 }}
        checked={props.item.complete}
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
          onBlur={handleBlur}
          textAlign="left"
          marginTop="0px"
        />
      </Box>
    </Box>
  )
};

export default TodoItemCheckbox;