import { TodoItem } from './types';

export function getSubItems(item: TodoItem, allItems: TodoItem[]): TodoItem[] {
  const subItems = allItems.filter((prevItem) => prevItem.parentItemId === item.id)
  const result = subItems.map((child) => {
    return getSubItems(child, allItems)
  }).flat();
  return [...subItems, ...result]
}