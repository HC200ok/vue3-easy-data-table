import { ref, Ref } from 'vue';
import type { Item } from '../types/main';
import type { EmitsEventName } from '../types/internal';

export default function useExpandableRow(
  items: Ref<Item[]>,
  emits: (event: EmitsEventName, ...args: any[]) => void,
) {
  const expandingItemIndexList = ref<number[]>([]);

  const updateExpandingItemIndexList = (expandingItemIndex: number, expandingItem: Item, event: Event) => {
    event.stopPropagation();
    const index = expandingItemIndexList.value.indexOf(expandingItemIndex);
    if (index !== -1) {
      expandingItemIndexList.value.splice(index, 1);
    } else {
      emits('expandRow', items.value.findIndex((item) => item === expandingItem));
      expandingItemIndexList.value.push(expandingItemIndex);
    }
  };

  const clearExpandingItemIndexList = () => {
    expandingItemIndexList.value = [];
  };

  return {
    expandingItemIndexList,
    updateExpandingItemIndexList,
    clearExpandingItemIndexList,
  };
}
