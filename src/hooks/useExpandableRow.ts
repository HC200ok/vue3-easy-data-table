import { ref, Ref, ComputedRef, watchEffect } from 'vue';
import type { Item, ItemKey } from '../types/main';
import type { EmitsEventName } from '../types/internal';
import { getItemIndex } from '../utils';

export default function useExpandableRow(
  items: Ref<Item[]>,
  prevPageEndIndex: ComputedRef<number>,
  emits: (event: EmitsEventName, ...args: any[]) => void,
  itemsExpanded: Ref<Item[]>,
  itemsKey: Ref<ItemKey>
) {
  const expandingItemIndexList = ref<number[]>([]);

  const updateExpandingItemIndexList = (expandingItemIndex: number, expandingItem: Item, event: Event) => {
    event.stopPropagation();
    const index = expandingItemIndexList.value.indexOf(expandingItemIndex);
    if (index !== -1) {
      expandingItemIndexList.value.splice(index, 1);
      emitItemsExpanded();
    } else {
      const currentPageExpandIndex = getItemIndex(items.value, expandingItem, itemsKey.value)
      emits('expandRow', prevPageEndIndex.value + currentPageExpandIndex, expandingItem);
      expandingItemIndexList.value.push(prevPageEndIndex.value + currentPageExpandIndex);
      emitItemsExpanded();
    }
  };

  const clearExpandingItemIndexList = () => {
    expandingItemIndexList.value = [];
  };

  watchEffect(() => {
    const indexList = itemsExpanded.value.reduce<number[]>((itemsExpandedIndex, expandedItem) => {
      const index = getItemIndex(items.value, expandedItem, itemsKey.value)
      if (index !== -1) {
        itemsExpandedIndex.push(index + prevPageEndIndex.value)
      }
      return itemsExpandedIndex
    }, [])
    expandingItemIndexList.value = indexList
  })


  function emitItemsExpanded() {
    emits('update:itemsExpanded', expandingItemIndexList.value.map(index => items.value[index - prevPageEndIndex.value]))
  }

  return {
    expandingItemIndexList,
    updateExpandingItemIndexList,
    clearExpandingItemIndexList,
  };
}
