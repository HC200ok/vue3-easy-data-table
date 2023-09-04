import {
  Ref, computed, ComputedRef, watch, ref
} from 'vue';
import type { Item, FilterOption } from '../types/main';
import type { ClientSortOptions, EmitsEventName } from '../types/internal';
import { getItemValue, createRegExpSafelly } from '../utils';

export default function useTotalItems(
  clientSortOptions: Ref<ClientSortOptions | null>,
  filterOptions: Ref<FilterOption[]>,
  isServerSideMode: ComputedRef<boolean>,
  items: Ref<Item[]>,
  itemsSelected: Ref<Item[]>,
  searchField: Ref<string>,
  searchValue: Ref<string>,
  serverItemsLength: Ref<number>,
  multiSort: Ref<boolean>,
  emits: (event: EmitsEventName, ...args: any[]) => void,
  slotsRenders: Map<string, (item: Item) => string>,
) {
  const getItemFieldValue = (column: string, item: Item) => slotsRenders.get(`item-${column}`)?.(item)
  ?? getItemValue(column, item);

  const generateSearchingTarget = (item: Item): string => {
    if (typeof searchField.value === 'string' && searchField.value !== '') return getItemFieldValue(searchField.value, item);
    if (Array.isArray(searchField.value)) {
      let searchString = '';
      searchField.value.forEach((field) => searchString += getItemFieldValue(field, item) );
      return searchString;
    } 

    return Object.entries(item)
      .map(([field, value]) => slotsRenders.get(`item-${field}`)?.(item) ?? value)
      .join(' ');
  };


  // items searching
  const itemsSearching = ref<Item[]>([])
  watch(
    () => [searchValue.value, items.value] as [ string, Item[] ],
    ( [ searchValue ] ) => {
      // searching feature is not available in server-side mode
      if (!isServerSideMode.value && searchValue !== '') {
        const regex = createRegExpSafelly(searchValue, 'i');
        itemsSearching.value = items.value.filter((item) => regex.test(generateSearchingTarget(item)));
        return
      }
      itemsSearching.value = items.value;
    },
    { immediate: true }
  )

  // items filtering
  const itemsFiltering = ref<Item[]>([])
  watch(
    () => [itemsSearching.value, filterOptions.value] as [Item[], FilterOption[]],
    ( [itemsSearching, filterOptions] ) => {
      let itemsFiltered = [...itemsSearching];
      if (filterOptions) {
        filterOptions.forEach((option: FilterOption) => {
          itemsFiltered = itemsFiltered.filter((item) => {
            const { field, comparison, criteria } = option;
            const propValue = getItemValue(field as string, item)
            
            if (typeof comparison === 'function') {
              const creteriaRegExp = createRegExpSafelly(criteria as string, 'i')
              const renderedValue = getItemFieldValue(field as string, item);
              return comparison(renderedValue, criteria, creteriaRegExp);
            }
  
            switch (comparison) {
              case '=':
                return propValue === criteria;
              case '!=':
                return propValue !== criteria;
              case '>':
                return propValue > criteria;
              case '<':
                return propValue < criteria;
              case '<=':
                return propValue <= criteria;
              case '>=':
                return propValue >= criteria;
              case 'between':
                return propValue >= Math.min(...criteria) && +propValue <= Math.max(...criteria);
              case 'in':
                return (criteria as any).includes( propValue );
              default:
                return propValue === criteria;
            }
          });
        });
        itemsFiltering.value = itemsFiltered;
        return
      }
       itemsFiltering.value = itemsSearching;
    },
    { immediate: true }
  )

  watch(itemsFiltering, (newVal) => {
    if (filterOptions.value) {
      emits('updateFilter', newVal);
    }
  }, { immediate: true, deep: true });

  function recursionMuiltSort(sortByArr: string[], sortDescArr: boolean[], itemsToSort: Item[], index: number): Item[] {
    const sortBy = sortByArr[index];
    const sortDesc = sortDescArr[index];
    const sorted = (index === 0 ? itemsToSort
      : recursionMuiltSort(sortByArr, sortDescArr, itemsToSort, index - 1)).sort((a: Item, b: Item) => {
      let isAllSame = true;
      for (let i = 0; i < index; i += 1) {
        if (getItemValue(sortByArr[i], a) !== getItemValue(sortByArr[i], b)) {
          isAllSame = false;
          break;
        }
      }
      if (isAllSame) {
        if (getItemValue(sortBy as string, a) < getItemValue(sortBy as string, b)) return sortDesc ? 1 : -1;
        if (getItemValue(sortBy as string, a) > getItemValue(sortBy as string, b)) return sortDesc ? -1 : 1;
        return 0;
      }
      return 0;
    });
    return sorted;
  }

  // flow: searching => filtering => sorting
  // (last step: sorting)
  const totalItems = computed((): Item[] => {
    if (isServerSideMode.value) return items.value;
    if (clientSortOptions.value === null) return itemsFiltering.value;
    const { sortBy, sortDesc } = clientSortOptions.value;
    const itemsFilteringSorted = [...itemsFiltering.value];
    // multi sort
    if (multiSort && Array.isArray(sortBy) && Array.isArray(sortDesc)) {
      if (sortBy.length === 0) return itemsFilteringSorted;
      return recursionMuiltSort(sortBy, sortDesc, itemsFilteringSorted, sortBy.length - 1);
    }
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    return itemsFilteringSorted.sort((a, b) => {
      if (getItemValue(sortBy as string, a) < getItemValue(sortBy as string, b)) return sortDesc ? 1 : -1;
      if (getItemValue(sortBy as string, a) > getItemValue(sortBy as string, b)) return sortDesc ? -1 : 1;
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
    if (isChecked) emits('selectAll');
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
      emits('selectRow', item);
    } else {
      selectItemsComputed.value = selectItemsComputed.value.filter((selectedItem) => JSON.stringify(selectedItem)
        !== JSON.stringify(item));
      emits('deselectRow', item);
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
