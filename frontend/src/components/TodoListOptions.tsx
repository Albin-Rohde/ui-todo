import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { IconButton, ListItemIcon, Tooltip } from '@mui/material';
import React from 'react';

import { TodoList } from '../types';

interface TodoListOptionsProps {
  todoList: TodoList;
  updateList: (list: TodoList) => void;
}

export const TodoListOptions = (props: TodoListOptionsProps) => {
  const activeColor = '#007afe';
  const inActiveColor = '#979797';

  const { todoList, updateList } = props;

  return (
    <>
      <ListItemIcon sx={{ minWidth: '0' }}>
        {todoList.private ? (
          <Tooltip title={'Only you can see this list'}>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                updateList({ ...todoList, private: false })
              }}
              sx={{ padding: 0, paddingTop: '4px', paddingRight: '0.2rem' }}
            >
              <VisibilityOffIcon style={{ fontSize: '1.4rem', color: activeColor }}/>
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title={'Anyone with link can see this list'}>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                updateList({ ...todoList, private: true })
              }}
              sx={{ padding: 0, paddingTop: '4px', paddingRight: '0.2rem' }}
            >
              <VisibilityOutlinedIcon
                style={{ fontSize: '1.4rem', color: inActiveColor }}/>
            </IconButton>
          </Tooltip>
        )}
      </ListItemIcon>
      <ListItemIcon sx={{ minWidth: '0' }}>
        {todoList.readonly ? (
          <Tooltip title={'Only you can edit this list'} arrow>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                updateList({ ...todoList, readonly: false })
              }}
              sx={{ padding: 0 }}
            >
              <LockIcon style={{ fontSize: '1.5rem', color: activeColor }}/>
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title={'Anyone with the link can edit this list'} arrow>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                updateList({ ...todoList, readonly: true })
              }}
              sx={{ padding: 0 }}
            >
              <LockOpenIcon style={{ fontSize: '1.5rem', color: inActiveColor }}/>
            </IconButton>
          </Tooltip>
        )}
      </ListItemIcon>
    </>
  );
}