import AddIcon from '@mui/icons-material/Add';
import { Box, CircularProgress, List, ListItem, ListItemText, } from '@mui/material';
import React, { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { TodoListsContext } from '../contexts/TodoListsContext';
import useHttp from '../hooks/useHttp';
import { TodoList } from '../types';

import SecondaryButton from './SecondaryButton';
import { TodoListOptions } from './TodoListOptions';


const ListOfTodoLists = () => {
  const { loading: loadingCreation, sendRequest: sendCreate } = useHttp();
  const { loading: loadingFetchList, sendRequest: sendFetchList } = useHttp();
  const { sendRequest: sendUpdateList } = useHttp();
  const navigate = useNavigate();
  const { id } = useParams();
  const { todoLists, setTodolists } = useContext(TodoListsContext);

  const createTodoList = async () => {
    const response = await sendCreate<TodoList>({
      path: '/todo-list',
      method: 'POST',
      body: {
        name: 'New Todo List',
      },
    });

    if (response.ok && response.data) {
      setTodolists([...todoLists, response.data]);
      navigate('/list/' + response.data.publicId + '?new');
    }
  }

  const fetchTodoLists = async () => {
    const response = await sendFetchList<TodoList[]>({
      path: '/todo-list/my',
      method: 'GET',
    });

    if (response.ok && response.data) {
      setTodolists(response.data)
    }
  }

  useEffect(() => {
    fetchTodoLists();
  }, []);

  const updateList = async (list: TodoList) => {
    await sendUpdateList<TodoList>({
      path: '/todo-list/' + id,
      method: 'PUT',
      body: {
        ...list,
      },
    });
    setTodolists((prev: TodoList[]) => {
      return prev.map((todoList) => {
        if (todoList.id === list.id) {
          return list;
        }
        return todoList;
      });
    });
  }

  const listItems = () => {
    if (loadingFetchList) {
      return (
        <CircularProgress/>
      )
    }

    return todoLists.map((todoList) => {
      const isSelected = todoList.publicId === id;

      return (
        <ListItem
          key={todoList.id}
          button
          onClick={() => navigate(`/list/${todoList.publicId}`)}
          selected={isSelected}
        >
          <ListItemText primary={todoList.name}/>
          <TodoListOptions todoList={todoList} updateList={updateList}/>
        </ListItem>
      )
    });
  }


  return (
    <>
      <Box marginLeft={1} marginRight={1} width="calc(100% - 1rem)">
        <SecondaryButton
          variant="contained"
          color="primary"
          startIcon={<AddIcon/>}
          fullWidth
          onClick={createTodoList}
          sx={{ justifyContent: 'flex-start', textAlign: 'left' }}
        >
          {loadingCreation ? <CircularProgress size={24}/> : 'Create New List'}
        </SecondaryButton>
      </Box>
      <List>{listItems()}</List>
    </>
  );
};

export default ListOfTodoLists;
