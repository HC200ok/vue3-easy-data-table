import type { Item } from './types/main';

export function getItemValue(column: string, item: Item) {
  if (column.includes('.')) {
    let content: any = '';
    const keysArr = column.split('.');
    keysArr.forEach((key, index) => {
      content = (index === 0 ? item[key] : content[key]);
    });
    return content;
  }
  return item[column];
}

export function generateColumnContent(column: string, item: Item) {
  const content = getItemValue(column, item);
  return Array.isArray(content) ? content.join(',') : content;
}
