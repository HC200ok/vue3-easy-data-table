import type { Header, Item } from './types/main';

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
    return content;
  }
  return item[column];
}

export function formatItemValue(column: string, rawContent: string, headers: Header[]) {
  const header = headers.find((headerItem: Header) => headerItem.value === column);
  if (header) {
    if (header.formatFn) {
      return header.formatFn(rawContent);
    }
  }
  return rawContent;
}

export function generateColumnContent(column: string, item: Item, headers: Header[]) {
  const content = getItemValue(column, item);
  const rawContent = Array.isArray(content) ? content.join(',') : content;
  return formatItemValue(column, rawContent, headers);
}
