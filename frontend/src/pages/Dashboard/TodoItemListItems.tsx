import { Divider } from '@mui/material';
import React from 'react';

import { TodoItem } from '../../types';

import { TodoItemRow } from './TodoItemRow';

interface TodoItemListItemsProps {
  todoItems: TodoItem[];
  handleAddItemClick: (item?: TodoItem) => void;
}

export const TodoItemListItems = (props: TodoItemListItemsProps) => {
  const [expandedItems, setExpandedItems] = React.useState<number[]>([]);

  const handleExpand = (itemId: number) => {
    if (expandedItems.includes(itemId)) {
      setExpandedItems((prev) => prev.filter((id) => id !== itemId));
    } else {
      setExpandedItems((prev) => [...prev, itemId]);
    }
  }

  const handleAddItemClick = (item?: TodoItem) => {
    props.handleAddItemClick(item);
    item && handleExpand(item.id);
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

  const getTotalCount = (parentId?: number | null): number => {
    const childItems = parentId ? childItemsMap.get(parentId) : null;
    if (!childItems) {
      return 0;
    }

    let count = childItems.length;
    childItems.forEach((item) => {
      count += getTotalCount(item.id);
    });
    return count;
  }

  const allItems = topLevelItems.map((item) => {
    const renderSubItems = (parentId?: number | null, depth?: number): React.JSX.Element[] => {
      const childItems = parentId ? childItemsMap.get(parentId) : null;
      if (!childItems) {
        return [];
      }

      const paddingLeft = 25 * (depth || 1);
      return childItems.map((item) => {
        const hasSubItems = childItemsMap.has(item.id);
        const isExpanded = expandedItems.includes(item.id);

        return (
          <>
            <Divider/>
            <TodoItemRow
              item={item}
              key={item.id}
              handleAddItemClick={() => handleAddItemClick(item)}
              handleCollapse={() => handleExpand(item.id)}
              isExpanded={isExpanded}
              hasSubItems={hasSubItems}
              paddingLeft={paddingLeft}
              count={getTotalCount(item.id)}
            />
            {hasSubitems && isExpanded && renderSubItems(item.id, (depth || 1) + 1)}
          </>
        );
      })
    }

    const hasSubitems = childItemsMap.has(item.id);
    const isExpanded = expandedItems.includes(item.id);
    return (
      <>
        <Divider/>
        <TodoItemRow
          item={item}
          key={item.id}
          paddingLeft={0}
          hasSubItems={hasSubitems}
          handleCollapse={() => handleExpand(item.id)}
          isExpanded={isExpanded}
          handleAddItemClick={() => handleAddItemClick(item)}
          count={getTotalCount(item.id)}
        />
        {hasSubitems && isExpanded && renderSubItems(item.id)}
      </>
    )
  });

  return <>{allItems}</>;
}