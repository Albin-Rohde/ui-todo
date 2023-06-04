import { Divider } from '@mui/material';
import React from 'react';

import { TodoItem } from '../../types';

import { TodoItemRow } from './TodoItemRow';

interface TodoItemListItemsProps {
  todoItems: TodoItem[];
  handleAddItemClick: (item: TodoItem) => void;
}

export const TodoItemListItems = (props: TodoItemListItemsProps) => {
  const listItems = props.todoItems.map((item) => {
    return (
      <>
        <Divider/>
        <TodoItemRow
          item={item}
          key={item.id}
          handleAddItemClick={props.handleAddItemClick}
        />
      </>
    );
  });

  return <>{listItems}</>;
}