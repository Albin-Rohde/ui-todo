import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineOutlinedIcon
  from '@mui/icons-material/RemoveCircleOutlineOutlined';
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  Tooltip,
} from '@mui/material';
import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';

import SecondaryButton from '../../components/SecondaryButton';
import TodoItemCheckbox from '../../components/TodoItemCheckbox';
import { TodoItemContext } from '../../contexts/TodoItemsContext';
import useHttp from '../../hooks/useHttp';
import { TodoItem } from '../../types';

const TodoItems = () => {
  const { todoItems, setTodoItems } = useContext(TodoItemContext);
  const { sendRequest } = useHttp();
  const { id } = useParams<{ id: string }>();

  const handleAddItemClick = async () => {
    const response = await sendRequest<{
      id: number;
      text: string;
      completed: boolean;
    }>({
      path: `/todo-list/${id}/todo-item`,
      method: 'POST',
    });

    if (!response.ok || !response.data) {
      return;
    }
    setTodoItems([...todoItems, response.data]);
  };

  const handleDeleteItemClick = async (todoItem: TodoItem) => {
    setTodoItems((prev: TodoItem[]) => {
      return prev.filter((item) => item.id !== todoItem.id);
    });
    await sendRequest({
      path: `/todo-list/${id}/todo-item/${todoItem.id}`,
      method: 'DELETE',
    });
  }

  const getRowBackgroundColor = (index: number) => {
    return '#f8f8f8'
    return index % 2 === 0 ? '#e4ebf3' : '#cbddf1';
  }
  const todoItemsList = todoItems?.map((item, index) => {
    return (
      <>
        <Divider/>
        <ListItem sx={{
          paddingLeft: '0',
          width: '100%',
          backgroundColor: getRowBackgroundColor(index)
        }} key={item.id}>
          <TodoItemCheckbox
            item={item}
            fontSize="1rem"
          />
          <ListItemIcon sx={{ margin: 0, padding: 0, minWidth: '24px' }}>
            <Tooltip title={'Delete item'}>
              <IconButton sx={{ padding: 0 }} onClick={() => handleDeleteItemClick(item)}>
                <RemoveCircleOutlineOutlinedIcon
                  sx={{ fontSize: '1rem', color: '#c02828' }}/>
              </IconButton>
            </Tooltip>
          </ListItemIcon>
        </ListItem>
      </>
    );
  });

  return (
    <Box sx={{ display: 'flex', textAlign: 'left', width: '100%' }}>
      <List sx={{ width: '100%', paddingTop: 0 }}>
        <ListItem
          sx={{
            paddingLeft: '.5rem',
            width: '100%',
            backgroundColor: '#f8f8f8',
            height: '3rem'
          }}
          key="add-item"
        >
          <SecondaryButton
            sx={{ backgroundColor: '#f4f4f4', height: '2.2rem' }}
            onClick={handleAddItemClick}
          >
            <AddIcon/> Add item
          </SecondaryButton>
        </ListItem>
        {todoItemsList}
        <Divider/>
      </List>
    </Box>
  );
};

export default TodoItems;
