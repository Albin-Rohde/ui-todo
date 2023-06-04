import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import RemoveCircleOutlineOutlinedIcon
  from '@mui/icons-material/RemoveCircleOutlineOutlined';
import { IconButton, ListItem, ListItemIcon, Tooltip, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';

import TodoItemCheckbox from '../../components/TodoItemCheckbox';
import { TodoItemContext } from '../../contexts/TodoItemsContext';
import useHttp from '../../hooks/useHttp';
import { TodoItem } from '../../types';

interface TodoItemRowProps {
  item: TodoItem;
  handleAddItemClick: (item: TodoItem) => void;
  handleCollapse: () => void;
  hasSubItems: boolean;
  isExpanded: boolean;
  count: number;
  paddingLeft: number;
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

  const getChevron = () => {
    if (props.isExpanded) {
      return <ExpandMoreIcon sx={{ fontSize: '1.5rem' }}/>;
    } else {
      return <ChevronRightIcon sx={{ fontSize: '1.5rem' }}/>;
    }
  }

  return (
    <ListItem
      sx={{
        paddingLeft: `${props.paddingLeft}px` || '0px',
        width: '100%',
        backgroundColor: '#f8f8f8',
      }}
      key={props.item.id}
    >
      <TodoItemCheckbox
        item={props.item}
        paddingLeft={props.paddingLeft || 0}
        fontSize="1rem"
      />
      {props.hasSubItems && (
        <ListItemIcon
          sx={{ margin: 0, padding: 0, minWidth: '24px' }}>
          <Tooltip title={'Number of sub-items'}>
            <Typography variant={'body2'}
                        sx={{ marginTop: '2px' }}>{props.count}</Typography>
          </Tooltip>
          <IconButton
            sx={{ padding: 0 }}
            onClick={() => props.handleCollapse()}
          >
            {getChevron()}
          </IconButton>
        </ListItemIcon>
      )}
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