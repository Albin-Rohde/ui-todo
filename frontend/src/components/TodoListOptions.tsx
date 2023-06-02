import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { IconButton, ListItemIcon, Tooltip } from '@mui/material';
import React from 'react';

import { TodoList } from '../types';

interface TodoListOptionsProps {
  todoList: TodoList;
  updateList: (list: TodoList) => void;
}

export const TodoListOptions = (props: TodoListOptionsProps) => {
  const readonlyHelpText = 'Readonly, only you can edit this list';
  const publicHelpText = 'Public, anyone with the link can edit this list';
  const { todoList, updateList } = props;

  return (
    <ListItemIcon>
      {todoList.readonly ? (
        <Tooltip title={readonlyHelpText} arrow>
          <IconButton onClick={(e) => {
            e.stopPropagation();
            updateList({ ...todoList, readonly: false })
          }}>
            <LockIcon style={{ fontSize: '1.2rem' }}/>
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title={publicHelpText} arrow>
          <IconButton onClick={(e) => {
            e.stopPropagation();
            updateList({ ...todoList, readonly: true })
          }}>
            <LockOpenIcon style={{ fontSize: '1.2rem' }}/>
          </IconButton>
        </Tooltip>
      )}
    </ListItemIcon>
  );
}