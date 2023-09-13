import type { Item, ItemKey } from './types/main';

export function getItemValue(column: string, item: Item) {
  if (column.includes('.')) {
    const keys = column.split('.');
    const { length } = keys;

    let content;
    let i = 0;

    while (i < length) {
      if (i === 0) {
        content = item[keys[0]];
      } else if (content && typeof content === 'object') {
        content = content[keys[i]];
      } else {
        content = '';
        break;
      }
      i += 1;
    }
    return content ?? '';
  }
  return item[column] ?? '';
}

export function generateColumnContent(column: string, item: Item) {
  const content = getItemValue(column, item);
  return Array.isArray(content) ? content.join(',') : content;
}

function getComparatorFn(itemToCompare: Item, key: ItemKey) {
 let comparatorFunction = (item: Item) => JSON.stringify(item) === JSON.stringify(itemToCompare)
    
    if (key && typeof key === 'function') {
      comparatorFunction = (item: Item) => key(item) === key(itemToCompare)
    }
    if (key && typeof key === 'string') {
      comparatorFunction = (item: Item) => getItemValue(key, item) === getItemValue(key, itemToCompare)
    }
    return comparatorFunction
} 

export function getItemIndex(allItems: Item[], item: Item, key: ItemKey) {
  return allItems.findIndex(getComparatorFn(item, key));
}

export function areItemsEqual(item: Item, itemToCompare: Item, key: ItemKey) {
 const areEqualsFn = getComparatorFn(item, key)
  return areEqualsFn(itemToCompare);
}
