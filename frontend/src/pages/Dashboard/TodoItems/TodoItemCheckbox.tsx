import { Box, Checkbox } from '@mui/material';
import React, { useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';

import { FakeCursor } from '../../../components/FakeCursor';
import TypographInput from '../../../components/TypographInput';
import { SocketContext } from '../../../contexts/SocketContext';
import { TodoItemContext } from '../../../contexts/TodoItemsContext';
import { TodoListContext } from '../../../contexts/TodoListContext';
import { UserContext } from '../../../contexts/UserContext';
import { TodoItem } from '../../../types';
import { getSubItems } from '../../../utils';


interface TodoItemCheckboxProps {
  item: TodoItem,
  fontSize: string;
  paddingLeft?: number;
}

const TodoItemCheckbox = (props: TodoItemCheckboxProps) => {
  const { setTodoItems } = useContext(TodoItemContext)
  const { currentTodoList } = useContext(TodoListContext)
  const { user } = useContext(UserContext);
  const { id } = useParams()
  const { socket } = useContext(SocketContext);
  const inputRef = useRef<HTMLInputElement>(null);

  const isReadOnly = currentTodoList && currentTodoList.readonly && currentTodoList.userId !== user?.id

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
    setTodoItems((prevItems) => {
      const subItems = getSubItems(props.item, prevItems)
      return prevItems.map((item) => {
        if (item.id === props.item.id || subItems.some((subItem) => subItem.id === item.id)) {
          return {
            ...item,
            completed: !props.item.completed,
          };
        }
        return item;
      });
    });
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
        disabled={isReadOnly || undefined}
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
          onMouseUp={handleMouseUp}
          disabled={isReadOnly || undefined}
        />
        <FakeCursor
          item={props.item}
          inputRef={inputRef}
          paddingLeft={props.paddingLeft}
        />
      </Box>
    </Box>
  )
};

export default TodoItemCheckbox;