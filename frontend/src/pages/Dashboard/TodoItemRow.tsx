import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import RemoveCircleOutlineOutlinedIcon
  from '@mui/icons-material/RemoveCircleOutlineOutlined';
import { IconButton, ListItem, ListItemIcon, Tooltip } from '@mui/material';
import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';

import TodoItemCheckbox from '../../components/TodoItemCheckbox';
import { TodoItemContext } from '../../contexts/TodoItemsContext';
import useHttp from '../../hooks/useHttp';
import { TodoItem } from '../../types';

interface TodoItemRowProps {
  item: TodoItem;
  handleAddItemClick: (item: TodoItem) => void;
  paddingLeft?: string;
}

export const TodoItemRow = (props: TodoItemRowProps) => {
  const { id } = useParams<{ id: string }>();
  const { sendRequest } = useHttp();
  const { setTodoItems } = useContext(TodoItemContext);

  const handleDeleteItemClick = async (todoItem: TodoItem) => {
    setTodoItems((prev: TodoItem[]) => {
      return prev.filter((item) => item.id !== todoItem.id);
    });
    await sendRequest({
      path: `/todo-list/${id}/todo-item/${todoItem.id}`,
      method: 'DELETE',
    });
  }

  return (
    <ListItem
      sx={{
        paddingLeft: '0',
        width: '100%',
        backgroundColor: '#f8f8f8',
      }}
      key={props.item.id}
    >
      <TodoItemCheckbox
        item={props.item}
        fontSize="1rem"
      />
      <ListItemIcon
        sx={{ margin: 0, padding: 0, paddingRight: '4px', minWidth: '24px' }}>
        <Tooltip title={'Add sub-item'}>
          <IconButton
            sx={{ padding: 0 }}
            onClick={() => props.handleAddItemClick(props.item)}
          >
            <PlaylistAddIcon sx={{ fontSize: '1.5rem' }}/>
          </IconButton>
        </Tooltip>
      </ListItemIcon>
      <ListItemIcon sx={{ margin: 0, padding: 0, minWidth: '24px' }}>
        <Tooltip title={'Delete item'}>
          <IconButton
            sx={{ padding: 0 }}
            onClick={() => handleDeleteItemClick(props.item)}
          >
            <RemoveCircleOutlineOutlinedIcon
              sx={{ fontSize: '1.5rem', color: '#c02828' }}
            />
          </IconButton>
        </Tooltip>
      </ListItemIcon>
    </ListItem>
  )
}