import AddIcon from '@mui/icons-material/Add';
import { Box, Divider, FormControlLabel, List, ListItem, Switch, } from '@mui/material';
import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';

import SecondaryButton from '../../components/SecondaryButton';
import { SocketContext } from '../../contexts/SocketContext';
import { TodoItemContext } from '../../contexts/TodoItemsContext';
import useHttp from '../../hooks/useHttp';
import { TodoItem } from '../../types';

import { TodoItemListItems } from './TodoItemListItems';

const TodoItemsList = () => {
  const { todoItems, setTodoItems } = useContext(TodoItemContext);
  const { sendRequest } = useHttp();
  const { id } = useParams<{ id: string }>();
  const [showCompleted, setShowCompleted] = React.useState(true);
  const { socket } = useContext(SocketContext);

  const handleAddItemClick = async (item?: TodoItem) => {
    const response = await sendRequest<TodoItem>({
      path: `/todo-list/${id}/todo-item`,
      method: 'POST',
      body: {
        parentId: item?.id,
      }
    });

    if (!response.ok || !response.data) {
      return;
    }
    socket?.emit('todoitem.notify-new-todo-item', { listId: id, id: response.data.id });
    setTodoItems([...todoItems, response.data]);
  };

  const filteredItems = todoItems?.filter((item) => {
    if (showCompleted) {
      return true;
    }
    return !item.completed;
  })

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
            onClick={() => handleAddItemClick()}
          >
            <AddIcon/> Add item
          </SecondaryButton>
          <FormControlLabel
            sx={{ marginLeft: '1rem' }}
            control={
              <Switch
                defaultChecked
                onChange={(_, checked) => setShowCompleted(checked)}
              />
            }
            label="Show completed"
          />
        </ListItem>
        <TodoItemListItems todoItems={filteredItems}
                           handleAddItemClick={handleAddItemClick}/>
        <Divider/>
      </List>
    </Box>
  );
};

export default TodoItemsList;
