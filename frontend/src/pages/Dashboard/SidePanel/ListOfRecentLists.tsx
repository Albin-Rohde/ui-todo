import { Box, CircularProgress, List, ListItem, ListItemText, } from '@mui/material';
import React, { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { TodoListContext } from '../../../contexts/TodoListContext';
import useHttp from '../../../hooks/useHttp';
import { TodoList } from '../../../types';

const ListOfRecentLists = () => {
  const { loading: loadingFetchList, sendRequest: sendFetchList } = useHttp();
  const navigate = useNavigate();
  const { id } = useParams();
  const { recentLists, setRecentlists } = useContext(TodoListContext);

  const fetchTodoLists = async () => {
    const response = await sendFetchList<TodoList[]>({
      path: '/todo-list/recent',
      method: 'GET',
    });

    if (response.ok && response.data) {
      setRecentlists(response.data)
    }
  }

  useEffect(() => {
    fetchTodoLists();
  }, []);

  const listItems = () => {
    if (loadingFetchList) {
      return (
        <CircularProgress/>
      )
    }

    return recentLists.map((list) => {
      const isSelected = list.publicId === id;
      return (
        <ListItem
          key={list.id}
          button
          onClick={() => navigate(`/list/${list.publicId}`)}
          selected={isSelected}
        >
          <ListItemText primary={list.name}/>
        </ListItem>
      )
    });
  }


  return (
    <>
      <Box marginLeft={1} marginRight={1} width="calc(100% - 1rem)">
      </Box>
      <List>{listItems()}</List>
    </>
  );
};

export default ListOfRecentLists;
