import {
  Ref, computed, ComputedRef, WritableComputedRef,
} from 'vue';
import type { Item } from '../types/main';
import type { MultipleSelectStatus } from '../types/internal';

export default function usePageItems(
  currentPaginationNumber: Ref<number>,
  isMultipleSelectable: ComputedRef<boolean>,
  isServerSideMode: ComputedRef<boolean>,
  items: Ref<Item[]>,
  rowsPerPageRef: Ref<number>,
  selectItemsComputed: WritableComputedRef<Item[]>,
  showIndex: Ref<boolean>,
  totalItems: ComputedRef<Item[]>,
  totalItemsLength: ComputedRef<number>,
) {
  const currentPageFirstIndex = computed((): number => (currentPaginationNumber.value - 1)
    * rowsPerPageRef.value + 1);

  const currentPageLastIndex = computed((): number => {
    if (isServerSideMode.value) {
      return Math.min(totalItemsLength.value, currentPaginationNumber.value * rowsPerPageRef.value);
    }
    return Math.min(
      totalItems.value.length,
      currentPaginationNumber.value * rowsPerPageRef.value,
    );
  });

  // items in current page
  const itemsInPage = computed((): Item[] => {
    if (isServerSideMode.value) return items.value;
    return totalItems.value.slice(currentPageFirstIndex.value - 1, currentPageLastIndex.value);
  });

  const itemsWithIndex = computed((): Item[] => {
    if (showIndex.value) {
      return itemsInPage.value.map((item, index) => ({ index: currentPageFirstIndex.value + index, ...item }));
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

  // items for render
  const pageItems = computed((): Item[] => {
    if (!isMultipleSelectable.value) return itemsWithIndex.value;
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
    currentPageFirstIndex,
    currentPageLastIndex,
    multipleSelectStatus,
    pageItems,
  };
}
