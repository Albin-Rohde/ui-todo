import { Divider } from '@mui/material';
import React from 'react';

import { TodoItem } from '../../types';

import { TodoItemRow } from './TodoItemRow';

interface TodoItemListItemsProps {
  todoItems: TodoItem[];
  handleAddItemClick: (item: TodoItem) => void;
}

export const TodoItemListItems = (props: TodoItemListItemsProps) => {
  const topLevelItems: TodoItem[] = [];
  const childItemsMap = new Map<number, TodoItem[]>();
  props.todoItems.forEach((item) => {
    if (item.parentItemId === null) {
      topLevelItems.push(item);
      return;
    }
    if (childItemsMap.has(item.parentItemId)) {
      childItemsMap.get(item.parentItemId)?.push(item);
    } else {
      childItemsMap.set(item.parentItemId, [item]);
    }
  });

  const allItems = topLevelItems.map((item) => {
    const renderSubItems = (parentId?: number | null, depth?: number): React.JSX.Element[] => {
      const childItems = parentId ? childItemsMap.get(parentId) : null;
      if (!childItems) {
        return [];
      }

      const paddingLeft = 25 * (depth || 1);
      return childItems.map((item) => {
        return (
          <>
            <Divider/>
            <TodoItemRow
              item={item}
              key={item.id}
              handleAddItemClick={() => props.handleAddItemClick(item)}
              paddingLeft={paddingLeft}
            />
            {renderSubItems(item.id, (depth || 1) + 1)}
          </>
        );
      })
    }

    return (
      <>
        <Divider/>
        <TodoItemRow
          item={item}
          key={item.id}
          paddingLeft={0}
          handleAddItemClick={() => props.handleAddItemClick(item)}
        />
        {renderSubItems(item.id)}
      </>
    )
  });

  return <>{allItems}</>;
}