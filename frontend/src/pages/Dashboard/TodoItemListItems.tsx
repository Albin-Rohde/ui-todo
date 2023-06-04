import { Divider } from '@mui/material';
import React from 'react';

import { TodoItem } from '../../types';

import { TodoItemRow } from './TodoItemRow';

interface TodoItemListItemsProps {
  todoItems: TodoItem[];
  handleAddItemClick: (item: TodoItem) => void;
}

export const TodoItemListItems = (props: TodoItemListItemsProps) => {
  const [collapsedItems, setCollapsedItems] = React.useState<number[]>([]);

  const handleCollapseItem = (itemId: number) => {
    console.log('handle colapse ran for item', itemId)
    if (collapsedItems.includes(itemId)) {
      setCollapsedItems((prev) => prev.filter((id) => id !== itemId));
    } else {
      setCollapsedItems((prev) => [...prev, itemId]);
    }
  }

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
        const hasSubItems = childItemsMap.has(item.id);
        const isExpanded = !collapsedItems.includes(item.id);

        return (
          <>
            <Divider/>
            <TodoItemRow
              item={item}
              key={item.id}
              handleAddItemClick={() => props.handleAddItemClick(item)}
              handleCollapse={() => handleCollapseItem(item.id)}
              isExpanded={isExpanded}
              hasSubItems={hasSubItems}
              paddingLeft={paddingLeft}
            />
            {hasSubitems && isExpanded && renderSubItems(item.id, (depth || 1) + 1)}
          </>
        );
      })
    }

    const hasSubitems = childItemsMap.has(item.id);
    const isExpanded = !collapsedItems.includes(item.id);
    return (
      <>
        <Divider/>
        <TodoItemRow
          item={item}
          key={item.id}
          paddingLeft={0}
          hasSubItems={hasSubitems}
          handleCollapse={() => handleCollapseItem(item.id)}
          isExpanded={isExpanded}
          handleAddItemClick={() => props.handleAddItemClick(item)}
        />
        {hasSubitems && isExpanded && renderSubItems(item.id)}
      </>
    )
  });

  return <>{allItems}</>;
}