import type { Item } from './types/main';

export function getItemValue(column: string, item: Item) {
  if (column.includes('.')) {
    let content: any = '';
    const keys = column.split('.');
    const { length } = keys;
    let i = 0;
    while (i < length) {
      content = (i === 0 ? item[keys[i]] : content[keys[i]]);
      i += 1;
      if (content === undefined) break;
    }
    return content ?? '';
  }
  return item[column] ?? '';
}

export function generateColumnContent(column: string, item: Item) {
  const content = getItemValue(column, item);
  return Array.isArray(content) ? content.join(',') : content;
}
