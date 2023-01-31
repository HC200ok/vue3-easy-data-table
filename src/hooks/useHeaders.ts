import {
  ref, Ref, computed, ComputedRef, WritableComputedRef,
} from 'vue';
import type { Header, SortType } from '../types/main';
import type {
  ServerOptionsComputed, HeaderForRender, ClientSortOptions, EmitsEventName,
} from '../types/internal';

export default function useHeaders(
  showIndexSymbol: Ref<string>,
  checkboxColumnWidth: Ref<number>,
  expandColumnWidth: Ref<number>,
  fixedCheckbox: Ref<boolean>,
  fixedExpand: Ref<boolean>,
  fixedIndex: Ref<boolean>,
  headers: Ref<Header[]>,
  ifHasExpandSlot: ComputedRef<boolean>,
  indexColumnWidth: Ref<number>,
  isMultipleSelectable: ComputedRef<boolean>,
  isServerSideMode: ComputedRef<boolean>,
  mustSort: Ref<boolean>,
  serverOptionsComputed: WritableComputedRef<ServerOptionsComputed | null>,
  showIndex: Ref<boolean>,
  sortBy: Ref<string | string[]>,
  sortType: Ref<SortType | SortType[]>,
  multiSort: Ref<boolean>,
  updateServerOptionsSort: (newSortBy: string, newSortType: SortType | null) => void,
  emits: (event: EmitsEventName, ...args: any[]) => void,
) {
  const hasFixedColumnsFromUser = computed(() => headers.value.findIndex((header) => header.fixed) !== -1);
  const fixedHeadersFromUser = computed(() => {
    if (hasFixedColumnsFromUser.value) return headers.value.filter((header) => header.fixed);
    return [];
  });
  const unFixedHeaders = computed(() => headers.value.filter((header) => !header.fixed));

  // eslint-disable-next-line max-len
  const generateClientSortOptions = (sortByValue: string | string[], sortTypeValue: SortType | SortType[]): ClientSortOptions | null => {
    // multi sort
    if (Array.isArray(sortByValue) && Array.isArray(sortTypeValue)) {
      return {
        sortBy: sortByValue,
        sortDesc: sortTypeValue.map((val: SortType) => val === 'desc'),
      };
    }
    // single sort
    if (sortByValue !== '') {
      return {
        sortBy: sortBy.value,
        sortDesc: sortType.value === 'desc',
      };
    }
    return null;
  };

  const clientSortOptions = ref<ClientSortOptions | null>(generateClientSortOptions(sortBy.value, sortType.value));

  // headers for render (integrating sortType,z checkbox...)
  const headersForRender = computed((): HeaderForRender[] => {
    // fixed order
    const fixedHeaders = [...fixedHeadersFromUser.value,
      ...unFixedHeaders.value] as HeaderForRender[];
    // sorting
    const headersSorting: HeaderForRender[] = fixedHeaders.map((header: HeaderForRender) => {
      const headerSorting: HeaderForRender = Object.assign(header);

      if (headerSorting.sortable) headerSorting.sortType = 'none';

      // server mode
      if (serverOptionsComputed.value) {
        if (Array.isArray(serverOptionsComputed.value.sortBy) && Array.isArray(serverOptionsComputed.value.sortType)
        && serverOptionsComputed.value.sortBy.includes(headerSorting.value)) {
          // multi sort
          const index = serverOptionsComputed.value.sortBy.indexOf(headerSorting.value);
          headerSorting.sortType = serverOptionsComputed.value.sortType[index];
        } else if (headerSorting.value === serverOptionsComputed.value.sortBy && serverOptionsComputed.value.sortType) {
          // single sort
          headerSorting.sortType = serverOptionsComputed.value.sortType as SortType;
        }
      }

      // client mode
      // multi sort
      // eslint-disable-next-line max-len
      if (clientSortOptions.value && Array.isArray(clientSortOptions.value.sortBy) && Array.isArray(clientSortOptions.value.sortDesc)
      && clientSortOptions.value.sortBy.includes(headerSorting.value)) {
        const index = clientSortOptions.value.sortBy.indexOf(headerSorting.value);
        headerSorting.sortType = clientSortOptions.value.sortDesc[index] ? 'desc' : 'asc';
      } else if (clientSortOptions.value && headerSorting.value === clientSortOptions.value.sortBy) {
        // single sort
        headerSorting.sortType = clientSortOptions.value.sortDesc ? 'desc' : 'asc';
      }
      return headerSorting;
    });
    // expand icon
    let headersWithExpand: HeaderForRender[] = [];
    if (!ifHasExpandSlot.value) {
      headersWithExpand = headersSorting;
    } else {
      const headerExpand: HeaderForRender = (fixedExpand.value || hasFixedColumnsFromUser.value) ? {
        text: '', value: 'expand', fixed: true, width: expandColumnWidth.value,
      } : { text: '', value: 'expand' };
      headersWithExpand = [headerExpand, ...headersSorting];
    }
    // show index
    let headersWithIndex: HeaderForRender[] = [];
    if (!showIndex.value) {
      headersWithIndex = headersWithExpand;
    } else {
      const headerIndex: HeaderForRender = (fixedIndex.value || hasFixedColumnsFromUser.value) ? {
        text: showIndexSymbol.value, value: 'index', fixed: true, width: indexColumnWidth.value,
      } : { text: showIndexSymbol.value, value: 'index' };
      headersWithIndex = [headerIndex, ...headersWithExpand];
    }
    // checkbox
    let headersWithCheckbox: HeaderForRender[] = [];
    if (!isMultipleSelectable.value) {
      headersWithCheckbox = headersWithIndex;
    } else {
      const headerCheckbox: HeaderForRender = (fixedCheckbox.value || hasFixedColumnsFromUser.value) ? {
        text: 'checkbox', value: 'checkbox', fixed: true, width: checkboxColumnWidth.value ?? 36,
      } : { text: 'checkbox', value: 'checkbox' };
      headersWithCheckbox = [headerCheckbox, ...headersWithIndex];
    }
    return headersWithCheckbox;
  });

  const headerColumns = computed((): string[] => headersForRender.value.map((header) => header.value));

  const updateSortField = (newSortBy: string, oldSortType: SortType | 'none') => {
    let newSortType: SortType | null = null;
    if (oldSortType === 'none') {
      newSortType = 'asc';
    } else if (oldSortType === 'asc') {
      newSortType = 'desc';
    } else {
      newSortType = (mustSort.value) ? 'asc' : null;
    }

    if (isServerSideMode.value) {
      // update server options
      updateServerOptionsSort(newSortBy, newSortType);
    }

    // multi sort
    if (clientSortOptions.value && Array.isArray(clientSortOptions.value.sortBy)
      && Array.isArray(clientSortOptions.value.sortDesc)) {
      const index = clientSortOptions.value.sortBy.indexOf(newSortBy);
      if (index === -1) {
        if (newSortType !== null) {
          clientSortOptions.value.sortBy.push(newSortBy);
          clientSortOptions.value.sortDesc.push(newSortType === 'desc');
        }
      } else if (newSortType === null) {
        clientSortOptions.value.sortDesc.splice(index, 1);
        clientSortOptions.value.sortBy.splice(index, 1);
      } else {
        clientSortOptions.value.sortDesc[index] = newSortType === 'desc';
      }
    } else if (newSortType === null) {
      clientSortOptions.value = null;
    } else {
      clientSortOptions.value = {
        sortBy: newSortBy,
        sortDesc: newSortType === 'desc',
      };
    }
    emits('updateSort', {
      sortType: newSortType,
      sortBy: newSortBy,
    });
  };

  const isMultiSorting = (headerText: string): boolean => {
    if (serverOptionsComputed.value) {
      if (Array.isArray(serverOptionsComputed.value.sortBy)) return serverOptionsComputed.value.sortBy.includes(headerText);
    }
    if (clientSortOptions.value && Array.isArray(clientSortOptions.value.sortBy)) {
      return clientSortOptions.value.sortBy.includes(headerText);
    }
    return false;
  };

  const getMultiSortNumber = (headerText: string) => {
    if (serverOptionsComputed.value) {
      if (Array.isArray(serverOptionsComputed.value.sortBy)) return serverOptionsComputed.value.sortBy.indexOf(headerText) + 1;
    }
    if (clientSortOptions.value && Array.isArray(clientSortOptions.value.sortBy)) {
      return clientSortOptions.value.sortBy.indexOf(headerText) + 1;
    }
    return false;
  };

  return {
    clientSortOptions,
    headerColumns,
    headersForRender,
    updateSortField,
    isMultiSorting,
    getMultiSortNumber,
  };
}
