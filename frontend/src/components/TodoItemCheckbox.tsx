import { Box, Checkbox } from '@mui/material';
import React, { useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';

import { SocketContext } from '../contexts/SocketContext';
import { TodoItemContext } from '../contexts/TodoItemsContext';
import { TodoItem } from '../types';

import { FakeCursor } from './FakeCursor';
import TypographInput from './TypographInput';

interface TodoItemCheckboxProps {
  item: TodoItem,
  fontSize: string;
}

const TodoItemCheckbox = (props: TodoItemCheckboxProps) => {
  const { setTodoItems } = useContext(TodoItemContext)
  const { id } = useParams()
  const { socket } = useContext(SocketContext);
  const inputRef = useRef<HTMLInputElement>(null);

  const sendCursorPos = (event: React.ChangeEvent | React.MouseEvent) => {
    const input = event?.target as HTMLInputElement;
    socket?.emit('todoitem.update-cursor-pos', {
      listId: id,
      itemId: props.item.id,
      cursorStart: input.selectionStart,
      cursorEnd: input.selectionEnd,
    });
  };

  const sendItemUpdated = (item: TodoItem) => {
    socket?.emit('todoitem.update-todo-item', {
      listId: id,
      id: item.id,
      text: item.text,
      completed: item.completed,
    });
  }

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
    sendItemUpdated({ ...props.item, completed: !props.item.completed })
  };

  const handleChangeText = (text: string, event?: React.ChangeEvent | React.MouseEvent) => {
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
    sendItemUpdated({ ...props.item, text })
    event && sendCursorPos(event)
  };

  const handleBlur = (_event: React.ChangeEvent) => {
    socket?.emit('todoitem.update-cursor-pos', {
      listId: id,
      itemId: props.item.id,
      cursorStart: null,
      cursorEnd: null,
    });
  };

  const handleFocus = (event: React.ChangeEvent) => {
    sendCursorPos(event)
  }

  const handleMouseUp = (event: React.MouseEvent) => {
    sendCursorPos(event)
  }

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
          onBlur={handleBlur}
          textAlign="left"
          marginTop="0px"
          inputRef={inputRef}
          onFocus={handleFocus}
          onMouseUp={handleMouseUp}
        />
        <FakeCursor item={props.item} inputRef={inputRef}/>
      </Box>
    </Box>
  )
};

export default TodoItemCheckbox;