import {
  type useSlots,
  type getCurrentInstance,
  render,
  type Slot,
} from 'vue';
import type { Item } from './types/main';

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

export function getSlotRenderFunctions(
  slots: ReturnType<typeof useSlots>,
  currentInstance: ReturnType<typeof getCurrentInstance>,
) {
  const renderFunctionsMap = new Map<string, (item: object) => string>();

  const getSlotRenderedContent = (fieldSlot?: Slot) => {
    if (!fieldSlot) {
      return null;
    }

    return (item: Item): string => {
      if (!fieldSlot || !currentInstance?.appContext) {
        return '';
      }

      const vnodes = fieldSlot(item);

      const $tmpDiv = document.createElement('div');
      let renderedText = '';
      for (let i = 0; i < vnodes.length; i += 1) {
        const vnode = vnodes[i];
        (vnode as any).appContext = currentInstance.appContext;
        render(vnode, $tmpDiv);
        renderedText += $tmpDiv.innerText;
      }

      return renderedText;
    };
  };

  const slotsNames = Object.keys(slots);
  for (let i = 0; i < slotsNames.length; i += 1) {
    const slot = slotsNames[i];
    if (/item-.+/.test(slot) && slots[slot]) {
      const getSlotRenderedContentFn = getSlotRenderedContent(slots[slot]);
      if (getSlotRenderedContentFn) {
        renderFunctionsMap.set(slot, getSlotRenderedContentFn);
      }
    }
  }

  return renderFunctionsMap;
}
