import { ref, Ref } from 'vue';
import type { Item } from '../types/main';
import type { EmitsEventName } from '../types/internal';

export default function useExpandableRow(
  items: Ref<Item[]>,
  emits: (event: EmitsEventName, ...args: any[]) => void,
) {
  const expandingItems = ref<Item[]>([]);

  const getExpandingItemIndex = (expandingItem: Item) => expandingItems.value.findIndex((item) => JSON.stringify(item)
    === JSON.stringify(expandingItem));

  const updateExpandingItems = (expandingItem: Item, event: Event) => {
    event.stopPropagation();
    const index = getExpandingItemIndex(expandingItem);
    if (index !== -1) {
      expandingItems.value.splice(index, 1);
    } else {
      emits('expandRow', items.value.findIndex((item) => item === expandingItem));
      expandingItems.value.push(expandingItem);
    }
  };

  return {
    updateExpandingItems,
    getExpandingItemIndex,
  };
}
