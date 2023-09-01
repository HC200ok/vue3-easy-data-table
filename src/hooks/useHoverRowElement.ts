import { ref, Ref, ComputedRef } from 'vue';
import type { Item } from '../types/main';
import type { EmitsEventName } from '../types/internal';

export default function useHoverRowElement(
  items: Ref<Item[]>,
  prevPageEndIndex: ComputedRef<number>,
  emits: (event: EmitsEventName, ...args: any[]) => void,
) {
  const hoverRowIndex = ref<number>();

  const updateHoverRowIndex = (index: number, hoverItem: Item, event: Event) => {
    event.stopPropagation();
    if (index !== -1) {
      hoverRowIndex.value = index;
    } else {
      const currentPageExpandIndex = items.value.findIndex((item) => JSON.stringify(item) === JSON.stringify(hoverItem));
      emits('showHoverElement', prevPageEndIndex.value + currentPageExpandIndex, hoverItem);
      hoverRowIndex.value = prevPageEndIndex.value + currentPageExpandIndex;
    }
  };

  const clearHoverRowIndex = () => {
    hoverRowIndex.value = undefined;
  };

  return {
    hoverRowIndex,
    updateHoverRowIndex,
    clearHoverRowIndex,
  };
}
