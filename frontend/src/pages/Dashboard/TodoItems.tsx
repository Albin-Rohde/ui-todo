import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineOutlinedIcon
  from '@mui/icons-material/RemoveCircleOutlineOutlined';
import {
  Box,
  Divider,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  Switch,
  Tooltip,
} from '@mui/material';
import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';

import SecondaryButton from '../../components/SecondaryButton';
import TodoItemCheckbox from '../../components/TodoItemCheckbox';
import { SocketContext } from '../../contexts/SocketContext';
import { TodoItemContext } from '../../contexts/TodoItemsContext';
import useHttp from '../../hooks/useHttp';
import { TodoItem } from '../../types';

const TodoItems = () => {
  const { todoItems, setTodoItems } = useContext(TodoItemContext);
  const { sendRequest } = useHttp();
  const { id } = useParams<{ id: string }>();
  const [showCompleted, setShowCompleted] = React.useState(true);
  const { socket } = useContext(SocketContext);

  const handleAddItemClick = async (parentId?: number) => {
    const response = await sendRequest<TodoItem>({
      path: `/todo-list/${id}/todo-item`,
      method: 'POST',
    });

    if (!response.ok || !response.data) {
      return;
    }
    socket?.emit('todoitem.notify-new-todo-item', { listId: id, id: response.data.id });
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

  const todoItemsList = todoItems?.filter((item) => {
    if (showCompleted) {
      return true;
    }
    return !item.completed;
  })?.map((item, index) => {
    return (
      <>
        <Divider/>
        <ListItem sx={{
          paddingLeft: '0',
          width: '100%',
          backgroundColor: '#f8f8f8',
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
          <FormControlLabel
            sx={{ marginLeft: '1rem' }}
            control={
              <Switch defaultChecked
                      onChange={(_, checked) => setShowCompleted(checked)}/>
            }
            label="Show completed"
          />
        </ListItem>
        {todoItemsList}
        <Divider/>
      </List>
    </Box>
  );
};

export default TodoItems;
