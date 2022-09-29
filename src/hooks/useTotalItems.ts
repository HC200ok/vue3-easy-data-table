import {
  Ref, computed, ComputedRef,
} from 'vue';
import type { Item, FilterOption } from '../types/main';
import type { ClientSortOptions, EmitsEventName } from '../types/internal';
import { getItemValue } from '../utils';

export default function useTotalItems(
  clientSortOptions: Ref<ClientSortOptions | null>,
  filterOptions: Ref<FilterOption[]>,
  isServerSideMode: ComputedRef<boolean>,
  items: Ref<Item[]>,
  itemsSelected: Ref<Item[]>,
  searchField: Ref<string>,
  searchValue: Ref<string>,
  serverItemsLength: Ref<number>,
  emits: (event: EmitsEventName, ...args: any[]) => void,
) {
  // items searching
  const itemsSearching = computed((): Item[] => {
    // searching feature is not available in server-side mode
    if (!isServerSideMode.value && searchValue.value !== '') {
      const regex = new RegExp(searchValue.value, 'i');
      return items.value.filter((item) => regex.test(searchField.value !== '' ? item[searchField.value]
        : Object.values(item).join(' ')));
    }
    return items.value;
  });
  // items filtering
  const itemsFiltering = computed((): Item[] => {
    let itemsFiltered = [...itemsSearching.value];
    if (filterOptions.value) {
      filterOptions.value.forEach((option: FilterOption) => {
        itemsFiltered = itemsFiltered.filter((item) => {
          const { field, comparison, criteria } = option;
          if (typeof comparison === 'function') {
            return comparison(getItemValue(field, item), criteria as string);
          }
          const itemValue = getItemValue(field, item);
          switch (comparison) {
            case '=':
              return itemValue === criteria;
            case '!=':
              return itemValue !== criteria;
            case '>':
              return itemValue > criteria;
            case '<':
              return itemValue < criteria;
            case '<=':
              return itemValue <= criteria;
            case '>=':
              return itemValue >= criteria;
            case 'between':
              return itemValue >= Math.min(...criteria) && itemValue <= Math.max(...criteria);
            default:
              return itemValue === criteria;
          }
        });
      });
      return itemsFiltered;
    }
    return itemsSearching.value;
  });

  // flow: searching => filtering => sorting
  // (last step: sorting)
  const totalItems = computed((): Item[] => {
    if (isServerSideMode.value) return items.value;
    if (clientSortOptions.value === null) return itemsFiltering.value;
    const { sortBy, sortDesc } = clientSortOptions.value;
    const itemsFilteringSorted = [...itemsFiltering.value];
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    return itemsFilteringSorted.sort((a, b) => {
      if (getItemValue(sortBy, a) < getItemValue(sortBy, b)) return sortDesc ? 1 : -1;
      if (getItemValue(sortBy, a) > getItemValue(sortBy, b)) return sortDesc ? -1 : 1;
      return 0;
    });
  });

  // eslint-disable-next-line max-len
  const totalItemsLength = computed((): number => (isServerSideMode.value ? serverItemsLength.value : totalItems.value.length));

  // multiple selecting
  const selectItemsComputed = computed({
    get: () => itemsSelected.value ?? [],
    set: (value) => {
      emits('update:itemsSelected', value);
    },
  });

  const toggleSelectAll = (isChecked: boolean): void => {
    selectItemsComputed.value = isChecked ? totalItems.value : [];
  };

  const toggleSelectItem = (item: Item):void => {
    const isAlreadyChecked = item.checkbox;
    // eslint-disable-next-line no-param-reassign
    delete item.checkbox;
    // eslint-disable-next-line no-param-reassign
    delete item.index;
    if (!isAlreadyChecked) {
      const selectItemsArr: Item[] = selectItemsComputed.value;
      selectItemsArr.unshift(item);
      selectItemsComputed.value = selectItemsArr;
    } else {
      selectItemsComputed.value = selectItemsComputed.value.filter((selectedItem) => JSON.stringify(selectedItem)
        !== JSON.stringify(item));
    }
  };

  return {
    totalItems,
    selectItemsComputed,
    totalItemsLength,
    toggleSelectAll,
    toggleSelectItem,
  };
}
