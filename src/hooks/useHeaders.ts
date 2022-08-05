import {
  ref, Ref, computed, ComputedRef, WritableComputedRef,
} from 'vue';
import type { Header, SortType } from '../types/main';
import type {
  ServerOptionsComputed, HeaderForRender, ClientSortOptions, EmitsEventName,
} from '../types/internal';

export default function useHeaders(
  checkboxColumnWidth: Ref<number>,
  expandColumnWidth: Ref<number>,
  fixedCheckbox: Ref<boolean>,
  fixedExpand: Ref<boolean>,
  fixedIndex: Ref<boolean>,
  headers: Ref<Header[]>,
  ifHasExpandSlot: ComputedRef<boolean>,
  indexColumnWidth: Ref<number>,
  isMutipleSelectable: ComputedRef<boolean>,
  isServerSideMode: ComputedRef<boolean>,
  mustSort: Ref<boolean>,
  serverOptionsComputed: WritableComputedRef<ServerOptionsComputed | null>,
  showIndex: Ref<boolean>,
  sortBy: Ref<string>,
  sortType: Ref<SortType>,
  updateServerOptionsSort: (newSortBy: string, newSortType: SortType | null) => void,
  emits: (event: EmitsEventName, ...args: any[]) => void,
) {
  const hasFixedColumnsFromUser = computed(() => headers.value.findIndex((header) => header.fixed) !== -1);
  const fixedHeadersFromUser = computed(() => {
    if (hasFixedColumnsFromUser.value) return headers.value.filter((header) => header.fixed);
    return [];
  });
  const unFixedHeaders = computed(() => headers.value.filter((header) => !header.fixed));

  const clientSortOptions = ref<ClientSortOptions | null>((() => {
    if (sortBy.value !== '') {
      return {
        sortBy: sortBy.value,
        sortDesc: sortType.value === 'desc',
      };
    }
    return null;
  })());

  // headers for render (integrating sortType, checkbox...)
  const headersForRender = computed((): HeaderForRender[] => {
    // fixed order
    const fixedHeaders = [...fixedHeadersFromUser.value,
      ...unFixedHeaders.value] as HeaderForRender[];
    // sorting
    const headersSorting: HeaderForRender[] = fixedHeaders.map((header: HeaderForRender) => {
      const headerSorting = header;
      if (header.sortable) headerSorting.sortType = 'none';
      if (serverOptionsComputed.value
        && header.value === serverOptionsComputed.value.sortBy && serverOptionsComputed.value.sortType) {
        headerSorting.sortType = serverOptionsComputed.value.sortType;
      }
      if (!isServerSideMode.value && clientSortOptions.value && header.value === clientSortOptions.value.sortBy) {
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
        text: '#', value: 'index', fixed: true, width: indexColumnWidth.value,
      } : { text: '#', value: 'index' };
      headersWithIndex = [headerIndex, ...headersWithExpand];
    }
    // checkbox
    let headersWithCheckbox: HeaderForRender[] = [];
    if (!isMutipleSelectable.value) {
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

  return {
    clientSortOptions,
    headerColumns,
    headersForRender,
    updateSortField,
  };
}
