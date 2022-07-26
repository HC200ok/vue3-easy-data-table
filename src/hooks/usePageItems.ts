import {
  Ref, computed, ComputedRef, WritableComputedRef,
} from 'vue';
import type { Item } from '../types/main';
import type { MultipleSelectStatus } from '../types/internal';

export default function usePageItems(
  currentPaginationNumber: Ref<number>,
  isMutipleSelectable: ComputedRef<boolean>,
  isServerSideMode: ComputedRef<boolean>,
  items: Ref<Item[]>,
  rowsPerPageReactive: Ref<number>,
  selectItemsComputed: WritableComputedRef<Item[]>,
  showIndex: Ref<boolean>,
  totalItems: ComputedRef<Item[]>,
  totalItemsLength: ComputedRef<number>,
) {
  const firstIndexOfItemsInCurrentPage = computed((): number => (currentPaginationNumber.value - 1)
    * rowsPerPageReactive.value + 1);

  const lastIndexOfItemsInCurrentPage = computed((): number => {
    if (isServerSideMode.value) {
      return Math.min(totalItemsLength.value, currentPaginationNumber.value * rowsPerPageReactive.value);
    }
    return Math.min(
      totalItems.value.length,
      currentPaginationNumber.value * rowsPerPageReactive.value,
    );
  });

  // items in current page
  const itemsInPage = computed((): Item[] => {
    if (isServerSideMode.value) return items.value;
    return totalItems.value.slice(firstIndexOfItemsInCurrentPage.value - 1, lastIndexOfItemsInCurrentPage.value);
  });

  const itemsWithIndex = computed((): Item[] => {
    if (showIndex.value) {
      return itemsInPage.value.map((item, index) => ({ index: firstIndexOfItemsInCurrentPage.value + index, ...item }));
    }
    return itemsInPage.value;
  });

  const multipleSelectStatus = computed((): MultipleSelectStatus => {
    if (selectItemsComputed.value.length === 0) {
      return 'noneSelected';
    }
    const isNoneSelected = selectItemsComputed.value.every((itemSelected) => {
      if (totalItems.value.findIndex((item) => JSON.stringify(itemSelected) === JSON.stringify(item)) !== -1) {
        return false;
      }
      return true;
    });
    if (isNoneSelected) return 'noneSelected';

    if (selectItemsComputed.value.length === totalItems.value.length) {
      const isAllSelected = selectItemsComputed.value.every((itemSelected) => {
        if (totalItems.value.findIndex((item) => JSON.stringify(itemSelected) === JSON.stringify(item)) === -1) {
          return false;
        }
        return true;
      });
      return isAllSelected ? 'allSelected' : 'partSelected';
    }

    return 'partSelected';
  });

  /**
   * items computed flow:
   * items searching => filtering => sorting => current page => with index => with checkbox => render
  */
  // items for render (with checbox)
  const pageItems = computed((): Item[] => {
    if (!isMutipleSelectable.value) return itemsWithIndex.value;
    // multi select
    if (multipleSelectStatus.value === 'allSelected') {
      return itemsWithIndex.value.map((item) => ({ checkbox: true, ...item }));
    } if (multipleSelectStatus.value === 'noneSelected') {
      return itemsWithIndex.value.map((item) => ({ checkbox: false, ...item }));
    }
    return itemsWithIndex.value.map((item) => {
      const isSelected = selectItemsComputed.value.findIndex((selectItem) => {
        const itemDeepCloned = { ...item };
        delete itemDeepCloned.index;
        return JSON.stringify(selectItem) === JSON.stringify(itemDeepCloned);
      }) !== -1;
      return { checkbox: isSelected, ...item };
    });
  });

  return {
    firstIndexOfItemsInCurrentPage,
    lastIndexOfItemsInCurrentPage,
    multipleSelectStatus,
    pageItems,
  };
}
