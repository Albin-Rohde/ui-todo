import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popover,
  Typography,
} from '@mui/material';
import React, { MouseEvent, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';

import TodoItemCheckbox from '../../components/TodoItemCheckbox';
import { TodoItemContext } from '../../contexts/TodoItemsContext';
import useHttp from '../../hooks/useHttp';

const TodoItems = () => {
  const { todoItems, setTodoItems } = useContext(TodoItemContext);
  const { sendRequest } = useHttp();
  const { id } = useParams<{ id: string }>();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const handleAddItemClick = async () => {
    const response = await sendRequest<{
      id: number;
      text: string;
      complete: boolean;
    }>({
      path: `/todo-list/${id}/todo-item`,
      method: 'POST',
    });

    if (!response.ok || !response.data) {
      return;
    }
    setTodoItems([...todoItems, response.data]);
  };

  const handleDeleteItemClick = async () => {
    if (!selectedItemId) {
      console.log('no selected item')
      return;
    }
    await sendRequest({
      path: `/todo-list/${id}/todo-item/${selectedItemId}`,
      method: 'DELETE',
    });
    setTodoItems(todoItems.filter((item) => item.id !== selectedItemId));
    handleClosePopover();
  }
  const handleMoreIconClick = (event: MouseEvent<HTMLButtonElement>, itemId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedItemId(itemId);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setSelectedItemId(null);
  };

  const open = Boolean(anchorEl);
  const popoverId = open ? 'popover-menu' : undefined;

  const getRowBackgroundColor = (index: number) => {
    return index % 2 === 0 ? '#e4ebf3' : '#cbddf1';
  }
  const todoItemsList = todoItems?.map((item, index) => {
    return (
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
          <IconButton sx={{ margin: 0, padding: 0 }}
                      onClick={(e) => handleMoreIconClick(e, item.id)}>
            <MoreVertOutlinedIcon/>
          </IconButton>
        </ListItemIcon>
      </ListItem>
    );
  });

  return (
    <Box sx={{ display: 'flex', textAlign: 'left', width: '100%' }}>
      <List sx={{ width: '100%', paddingTop: 0 }}>
        <ListItem sx={{ paddingLeft: '0', width: '100%', backgroundColor: '#cbddf1' }}
                  key="add-item">
          <ListItemIcon sx={{
            margin: 0,
            padding: 0,
            paddingLeft: 1,
            paddingY: 0.5,
            minWidth: '24px',
          }}>
            <IconButton sx={{ margin: 0, padding: 0 }} onClick={handleAddItemClick}>
              <AddIcon/>
            </IconButton>
            <Typography sx={{ marginLeft: 2, fontStyle: 'italic' }}>
              Add item
            </Typography>
          </ListItemIcon>
        </ListItem>
        {todoItemsList}
        <Divider/>
      </List>

      <Popover
        id={popoverId}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Paper sx={{ width: 150, maxWidth: '100%' }}>
          <MenuList>
            <MenuItem onClick={handleDeleteItemClick}>
              <ListItemIcon>
                <DeleteIcon fontSize="small"/>
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          </MenuList>
        </Paper>
      </Popover>
    </Box>
  );
};

export default TodoItems;
