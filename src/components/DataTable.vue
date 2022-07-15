<template>
  <div
    ref="dataTable"
    class="vue3-easy-data-table"
    :class="[tableClassName]"
  >
    <div
      ref="tableBody"
      class="vue3-easy-data-table__main"
      :class="{
        'fixed-header': fixedHeader,
        'fixed-height': tableHeight,
        'show-shadow': showShadow,
        'table-fixed': fixedHeaders.length,
        'hoverable': !noHover,
        'border-cell': borderCell,
      }"
    >
      <table>
        <colgroup>
          <col
            v-for="(header, index) in headersForRender"
            :key="index"
            :style="getColStyle(header)"
          />
        </colgroup>
        <thead
          v-if="headersForRender.length && !hideHeader"
          class="vue3-easy-data-table__header"
          :class="[headerClassName]"
        >
          <tr>
            <th
              v-for="(header, index) in headersForRender"
              :key="index"
              :class="[{
                sortable: header.sortable,
                'none': header.sortable && header.sortType === 'none',
                'desc': header.sortable && header.sortType === 'desc',
                'asc': header.sortable && header.sortType === 'asc',
                'shadow': header.value === lastFixedColumn,
              // eslint-disable-next-line max-len
              }, typeof headerItemClassName === 'string' ? headerItemClassName : headerItemClassName(header as HeaderForRender, index)]"
              :style="getFixedDistance(header.value)"
              @click.stop="(header.sortable && header.sortType) ? updateSortField(header.value, header.sortType) : null"
            >
              <MutipleSelectCheckBox
                v-if="header.text === 'checkbox'"
                :key="multipleSelectStatus"
                :status="multipleSelectStatus"
                @change="toggleSelectAll"
              />
              <span
                v-else
                class="header"
              >
                <slot
                  v-if="slots[`header-${header.value}`]"
                  :name="`header-${header.value}`"
                  v-bind="header"
                />
                <span
                  v-else
                  class="header-text"
                >
                  {{ header.text }}
                </span>
                <i
                  v-if="header.sortable"
                  :key="header.sortType ? header.sortType : 'none'"
                  class="sortType-icon"
                  :class="{'desc': header.sortType === 'desc'}"
                ></i>
              </span>
            </th>
          </tr>
        </thead>
        <tbody
          v-if="items.length && headerColumns.length"
          class="vue3-easy-data-table__body"
          :class="{'row-alternation': alternating}"
        >
          <template
            v-for="(item, index) in itemsForRender"
            :key="index"
          >
            <tr
              :class="[{'even-row': (index + 1) % 2 === 0},
                       typeof bodyRowClassName === 'string' ? bodyRowClassName : bodyRowClassName(item, index)]"
              @click="clickRow(item)"
            >
              <td
                v-for="(column, i) in headerColumns"
                :key="i"
                :style="getFixedDistance(column, 'td')"
                :class="[{
                  'shadow': column === lastFixedColumn,
                  'can-expand': column === 'expand',
                }, typeof bodyItemClassName === 'string' ? bodyItemClassName : bodyItemClassName(column, i)]"
                @click="column === 'expand' ? updateExpandingItemIndexList(index, item, $event) : null"
              >
                <slot
                  v-if="slots[`item-${column}`]"
                  :name="`item-${column}`"
                  v-bind="item"
                />
                <template v-else-if="column === 'expand'">
                  <i
                    class="expand-icon"
                    :class="{'expanding': expandingItemIndexList.includes(index)}"
                  />
                </template>
                <template v-else-if="column === 'checkbox'">
                  <SingleSelectCheckBox
                    :checked="item[column]"
                    @change="toggleSelectItem(item)"
                  />
                </template>
                <template v-else>
                  {{ generateColumnContent(column, item) }}
                </template>
              </td>
            </tr>
            <tr
              v-if="ifHasExpandSlot && expandingItemIndexList.includes(index)"
              :class="{'even-row': (index + 1) % 2 === 0}"
            >
              <td
                :colspan="headersForRender.length"
                class="expand"
              >
                <LoadingLine
                  v-if="item.expandLoading"
                  class="expand-loading"
                />
                <slot
                  name="expand"
                  v-bind="item"
                />
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <div
        v-if="loading"
        class="vue3-easy-data-table__loading"
      >
        <div
          class="vue3-easy-data-table__loading-mask "
        ></div>
        <div class="loading-entity">
          <slot
            v-if="ifHasLoadingSlot"
            name="loading"
          />
          <Loading v-else></Loading>
        </div>
      </div>

      <div
        v-if="!itemsForRender.length && !loading"
        class="vue3-easy-data-table__message"
      >
        {{ emptyMessage }}
      </div>
    </div>
    <div
      v-if="!hideFooter"
      class="vue3-easy-data-table__footer"
    >
      <div
        v-if="!hideRowsPerPage"
        class="pagination__rows-per-page"
      >
        {{ rowsPerPageMessage }}
        <RowsSelector
          v-model="rowsPerPageReactive"
          :rows-items="rowsItemsComputed"
        />
      </div>
      <div class="pagination__items-index">
        {{ `${firstIndexOfItemsInCurrentPage}-${lastIndexOfItemsInCurrentPage}` }}
        of {{ totalItemsLength }}
      </div>

      <slot
        v-if="ifHasPaginationSlot"
        name="pagination"
        v-bind="{
          isFirstPage,
          isLastPage,
          currentPaginationNumber,
          maxPaginationNumber,
          nextPage,
          prevPage,
        }"
      />
      <PaginationArrows
        v-else
        :is-first-page="isFirstPage"
        :is-last-page="isLastPage"
        @click-next-page="nextPage"
        @click-prev-page="prevPage"
      >
        <template
          v-if="buttonsPagination"
          #buttonsPagination
        >
          <ButtonsPagination
            :current-pagination-number="currentPaginationNumber"
            :max-pagination-number="maxPaginationNumber"
            @update-page="updatePage"
          />
        </template>
      </PaginationArrows>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  useSlots, computed, toRefs, PropType, ref, watch, provide, onMounted,
} from 'vue';
import MutipleSelectCheckBox from './MutipleSelectCheckBox.vue';
import SingleSelectCheckBox from './SingleSelectCheckBox.vue';
import RowsSelector from './RowsSelector.vue';
import Loading from './Loading.vue';
import LoadingLine from './LoadingLine.vue';
import ButtonsPagination from './ButtonsPagination.vue';
import PaginationArrows from './PaginationArrows.vue';

import type {
  SortType, Header, Item, ServerOptions, FilterOption,
  HeaderItemClassNameFunction, BodyItemClassNameFunction, BodyRowClassNameFunction,
} from '../types/main';

type ClientSortOptions = {
  sortBy: string,
  sortDesc: boolean,
}

type HeaderForRender = {
  text: string,
  value: string,
  sortable?: boolean,
  sortType?: SortType | 'none',
  fixed?: Boolean,
  width?: number,
}

type ServerOptionsComputed = {
  page: number,
  rowsPerPage: number,
  sortBy: string | null,
  sortType: SortType | null,
}

const props = defineProps({
  alternating: {
    type: Boolean,
    default: false,
  },
  buttonsPagination: {
    type: Boolean,
    default: false,
  },
  checkboxColumnWidth: {
    type: Number,
    default: null,
  },
  emptyMessage: {
    type: String,
    default: 'No Available Data',
  },
  expandColumnWidth: {
    type: Number,
    default: 36,
  },
  filterOptions: {
    type: Array as PropType<FilterOption[]>,
    default: null,
  },
  fixedExpand: {
    type: Boolean,
    default: false,
  },
  fixedHeader: {
    type: Boolean,
    default: true,
  },
  fixedCheckbox: {
    type: Boolean,
    default: false,
  },
  fixedIndex: {
    type: Boolean,
    default: false,
  },
  headers: {
    type: Array as PropType<Header[]>,
    required: true,
  },
  hideFooter: {
    type: Boolean,
    default: false,
  },
  hideRowsPerPage: {
    type: Boolean,
    default: false,
  },
  hideHeader: {
    type: Boolean,
    default: false,
  },
  indexColumnWidth: {
    type: Number,
    default: 60,
  },
  items: {
    type: Array as PropType<Item[]>,
    required: true,
  },
  itemsSelected: {
    type: Array as PropType<Item[]> | null,
    default: null,
  },
  loading: {
    type: Boolean,
    deault: false,
  },
  rowsPerPage: {
    type: Number,
    default: 25,
  },
  rowsItems: {
    type: Array as PropType<number[]>,
    default: () => [25, 50, 100],
  },
  rowsPerPageMessage: {
    type: String,
    default: 'rows per page:',
  },
  searchField: {
    type: String,
    default: '',
  },
  searchValue: {
    type: String,
    default: '',
  },
  serverOptions: {
    type: Object as PropType<ServerOptions> | null,
    default: null,
  },
  serverItemsLength: {
    type: Number,
    default: 0,
  },
  showIndex: {
    type: Boolean,
    default: false,
  },
  sortBy: {
    type: String,
    default: '',
  },
  sortType: {
    type: String as PropType<SortType>,
    default: 'asc',
  },
  tableHeight: {
    type: Number,
    default: null,
  },
  themeColor: {
    type: String,
    default: '#42b883',
  },
  tableClassName: {
    type: String,
    default: '',
  },
  headerClassName: {
    type: String,
    default: '',
  },
  headerItemClassName: {
    type: [Function, String] as PropType<HeaderItemClassNameFunction | string>,
    default: '',
  },
  bodyRowClassName: {
    type: [Function, String] as PropType<BodyRowClassNameFunction | string>,
    default: '',
  },
  bodyItemClassName: {
    type: [Function, String] as PropType<BodyItemClassNameFunction | string>,
    default: '',
  },
  noHover: {
    type: Boolean,
    default: false,
  },
  borderCell: {
    type: Boolean,
    default: false,
  },
});

// style related computed variables
const tableHeightPx = computed(() => (props.tableHeight ? `${props.tableHeight}px` : null));

// global style related variable
provide('themeColor', props.themeColor);

// slot
const slots = useSlots();
const ifHasPaginationSlot = computed(() => slots.pagination);
const ifHasLoadingSlot = computed(() => slots.loading);
const ifHasExpandSlot = computed(() => slots.expand);

// global dataTable $ref
const dataTable = ref();
const tableBody = ref();
provide('dataTable', dataTable);

// fixed-columns shadow
const showShadow = ref(false);
onMounted(() => {
  tableBody.value.addEventListener('scroll', () => {
    showShadow.value = tableBody.value.scrollLeft > 0;
  });
});

// define emits
const emits = defineEmits([
  'update:itemsSelected',
  'update:serverOptions',
  'clickRow',
  'expandRow',
]);

const serverOptionsComputed = computed({
  get: (): ServerOptionsComputed | null => {
    if (props.serverOptions) {
      const {
        page, rowsPerPage, sortBy, sortType,
      } = props.serverOptions;
      return {
        page,
        rowsPerPage,
        sortBy: sortBy ?? null,
        sortType: sortType ?? null,
      };
    }
    return null;
  },
  set: (value) => {
    emits('update:serverOptions', value);
  },
});

const isMutipleSelectable = computed((): boolean => props.itemsSelected !== null);

const isServerSideMode = computed((): boolean => serverOptionsComputed.value !== null);

const rowsItemsComputed = computed((): number[] => {
  if (!isServerSideMode.value && props.rowsItems.findIndex((item) => item === props.rowsPerPage) === -1) {
    return [props.rowsPerPage, ...props.rowsItems];
  }
  return props.rowsItems;
});

const initClientSortOptions = (): ClientSortOptions | null => {
  if (props.sortBy !== '') {
    return {
      sortBy: props.sortBy,
      sortDesc: props.sortType === 'desc',
    };
  }
  return null;
};

const clientSortOptions = ref<ClientSortOptions | null>(initClientSortOptions());

type FixedColumnsInfo = {
  value: string,
  fixed: Boolean,
  distance: number,
  width: number,
};

const hasFixedColumnsFromUser = computed(() => props.headers.findIndex((header) => header.fixed) !== -1);
const fixedHeadersFromUser = computed(() => {
  if (hasFixedColumnsFromUser.value) return props.headers.filter((header) => header.fixed);
  return [];
});
const unFixedHeaders = computed(() => props.headers.filter((header) => !header.fixed));

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
    const headerExpand: HeaderForRender = (props.fixedExpand || hasFixedColumnsFromUser.value) ? {
      text: '', value: 'expand', fixed: true, width: props.expandColumnWidth,
    } : { text: '', value: 'expand' };
    headersWithExpand = [headerExpand, ...headersSorting];
  }
  // show index
  let headersWithIndex: HeaderForRender[] = [];
  if (!props.showIndex) {
    headersWithIndex = headersWithExpand;
  } else {
    const headerIndex: HeaderForRender = (props.fixedIndex || hasFixedColumnsFromUser.value) ? {
      text: '#', value: 'index', fixed: true, width: props.indexColumnWidth,
    } : { text: '#', value: 'index' };
    headersWithIndex = [headerIndex, ...headersWithExpand];
  }
  // checkbox
  let headersWithCheckbox: HeaderForRender[] = [];
  if (!isMutipleSelectable.value) {
    headersWithCheckbox = headersWithIndex;
  } else {
    const headerCheckbox: HeaderForRender = (props.fixedCheckbox || hasFixedColumnsFromUser.value) ? {
      text: 'checkbox', value: 'checkbox', fixed: true, width: props.checkboxColumnWidth ?? 36,
    } : { text: 'checkbox', value: 'checkbox' };
    headersWithCheckbox = [headerCheckbox, ...headersWithIndex];
  }
  return headersWithCheckbox;
});

// expand
const expandingItemIndexList = ref<number[]>([]);
const updateExpandingItemIndexList = (expandingItemIndex: number, expandingItem: Item, event: Event) => {
  event.stopPropagation();
  const index = expandingItemIndexList.value.indexOf(expandingItemIndex);
  if (index !== -1) {
    expandingItemIndexList.value.splice(index, 1);
  } else {
    emits('expandRow', props.items.findIndex((item) => item === expandingItem));
    expandingItemIndexList.value.push(expandingItemIndex);
  }
};

const fixedHeaders = computed((): HeaderForRender[] => headersForRender.value.filter((header) => header.fixed));
const lastFixedColumn = computed((): string => {
  if (!fixedHeaders.value.length) return '';
  return fixedHeaders.value[fixedHeaders.value.length - 1].value;
});

const getColStyle = (header: HeaderForRender): string | undefined => {
  const width = header.width ?? (fixedHeaders.value.length ? 100 : null);
  if (width) return `width: ${width}px; min-width: ${width}px;`;
  return undefined;
};

const fixedColumnsInfos = computed((): FixedColumnsInfo[] => {
  if (!fixedHeaders.value.length) return [];
  const fixedHeadersWidthArr = fixedHeaders.value.map((header) => header.width ?? 100);
  return fixedHeaders.value.map((header: HeaderForRender, index: number): FixedColumnsInfo => ({
    value: header.value,
    fixed: header.fixed ?? true,
    width: header.width ?? 100,
    distance: index === 0 ? 0 : fixedHeadersWidthArr.reduce((previous: number, current: number, i: number): number => {
      let distance = previous;
      if (i < index) distance += current;
      return distance;
    }),
  }));
});

const getFixedDistance = (column: string, type: 'td' | 'th' = 'th') => {
  if (!fixedHeaders.value.length) return undefined;
  const columInfo = fixedColumnsInfos.value.find((info) => info.value === column);
  if (columInfo) {
    return `left: ${columInfo.distance}px;z-index: ${type === 'th' ? 3 : 1};position: sticky;`;
  }
  return undefined;
};

const headerColumns = computed((): string[] => headersForRender.value.map((header) => header.value));

const getItemValue = (column: string, item: Item) => {
  if (column.includes('.')) {
    let content: any = '';
    const keysArr = column.split('.');
    keysArr.forEach((key, index) => {
      content = (index === 0 ? item[key] : content[key]);
    });
    return content;
  }
  return item[column];
};

const generateColumnContent = (column: string, item: Item) => {
  const content = getItemValue(column, item);
  return Array.isArray(content) ? content.join(',') : content;
};

// multiple selecting
const selectItemsComputed = computed({
  get: () => props.itemsSelected ?? [],
  set: (value) => {
    emits('update:itemsSelected', value);
  },
});

// items searching
const itemsSearching = computed((): Item[] => {
  // searching feature is not available in server-side mode
  if (!isServerSideMode.value && props.searchValue !== '') {
    const regex = new RegExp(props.searchValue, 'i');
    return props.items.filter((item) => regex.test(props.searchField !== '' ? item[props.searchField]
      : Object.values(item).join(' ')));
  }
  return props.items;
});

// items filtering
const itemsFiltering = computed((): Item[] => {
  let itemsFiltered = [...itemsSearching.value];
  if (props.filterOptions) {
    props.filterOptions.forEach((option: FilterOption) => {
      itemsFiltered = itemsFiltered.filter((item) => {
        const { field, comparison, criteria } = option;
        switch (comparison) {
          case '=':
            return item[field] === criteria;
          case '!=':
            return item[field] !== criteria;
          case '>':
            return item[field] > criteria;
          case '<':
            return item[field] < criteria;
          case '<=':
            return item[field] <= criteria;
          case '>=':
            return item[field] >= criteria;
          case 'between':
            return item[field] >= Math.min(...criteria) && item[field] <= Math.max(...criteria);
          default:
            return item[field] === criteria;
        }
      });
    });
    return itemsFiltered;
  }
  return itemsSearching.value;
});

const multipleSelectStatus = computed((): 'allSelected' | 'noneSelected' | 'partSelected' => {
  if (selectItemsComputed.value.length === 0) {
    return 'noneSelected';
  }
  const isNoneSelected = selectItemsComputed.value.every((itemSelected) => {
    if (itemsFiltering.value.findIndex((item) => JSON.stringify(itemSelected) === JSON.stringify(item)) !== -1) {
      return false;
    }
    return true;
  });
  if (isNoneSelected) return 'noneSelected';

  if (selectItemsComputed.value.length === itemsFiltering.value.length) {
    const isAllSelected = selectItemsComputed.value.every((itemSelected) => {
      if (itemsFiltering.value.findIndex((item) => JSON.stringify(itemSelected) === JSON.stringify(item)) === -1) {
        return false;
      }
      return true;
    });
    return isAllSelected ? 'allSelected' : 'partSelected';
  }

  return 'partSelected';
});

const currentPaginationNumber = ref(isServerSideMode.value ? props.serverOptions.page : 1);

const { items } = toRefs(props);
watch(items, () => {
  if (!isServerSideMode.value) currentPaginationNumber.value = 1;
}, { deep: true });

// rows per page
const rowsPerPageReactive = ref(isServerSideMode.value ? props.serverOptions.rowsPerPage : props.rowsPerPage);
watch(rowsPerPageReactive, (value) => {
  if (serverOptionsComputed.value) {
    serverOptionsComputed.value = {
      ...serverOptionsComputed.value,
      page: 1,
      rowsPerPage: value,
    };
  }
  currentPaginationNumber.value = 1;
});

const updateSortField = (newSortBy: string, oldSortType: SortType | 'none') => {
  let newSortType: SortType | null = null;
  if (oldSortType === 'none') {
    newSortType = 'asc';
  } else if (oldSortType === 'asc') {
    newSortType = 'desc';
  } else {
    newSortType = null;
  }

  if (serverOptionsComputed.value) {
    // update server options
    serverOptionsComputed.value = {
      ...serverOptionsComputed.value,
      sortBy: newSortType !== null ? newSortBy : null,
      sortType: newSortType,
    };
  } else if (newSortType === null) {
    clientSortOptions.value = null;
  } else {
    clientSortOptions.value = {
      sortBy: newSortBy,
      sortDesc: newSortType === 'desc',
    };
  }
};

// items sorting
const itemsSorting = computed((): Item[] => {
  if (isServerSideMode.value) return props.items;
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

// index info of items in current page.
const totalItemsLength = computed((): number => (isServerSideMode.value ? props.serverItemsLength : itemsFiltering.value.length));

const lastIndexOfItemsInCurrentPage = computed((): number => {
  if (isServerSideMode.value) {
    return currentPaginationNumber.value * rowsPerPageReactive.value;
  }
  return Math.min(
    itemsFiltering.value.length,
    currentPaginationNumber.value * rowsPerPageReactive.value,
  );
});

const firstIndexOfItemsInCurrentPage = computed((): number => (currentPaginationNumber.value - 1)
  * rowsPerPageReactive.value + 1);

// page up, page down
const maxPaginationNumber = computed((): number => Math.ceil(totalItemsLength.value / rowsPerPageReactive.value));
const isLastPage = computed((): boolean => currentPaginationNumber.value === maxPaginationNumber.value);
const isFirstPage = computed((): boolean => currentPaginationNumber.value === 1);

const { loading } = toRefs(props);

const nextPage = () => {
  if (isLastPage.value) return;
  if (loading.value) return;
  if (serverOptionsComputed.value) {
    const nextPaginationNumber = currentPaginationNumber.value + 1;
    serverOptionsComputed.value = {
      ...serverOptionsComputed.value,
      page: nextPaginationNumber,
    };
  } else {
    currentPaginationNumber.value += 1;
  }
};

const prevPage = () => {
  if (isFirstPage.value) return;
  if (loading.value) return;
  if (serverOptionsComputed.value) {
    const prevPaginationNumber = currentPaginationNumber.value - 1;
    serverOptionsComputed.value = {
      ...serverOptionsComputed.value,
      page: prevPaginationNumber,
    };
  } else {
    currentPaginationNumber.value -= 1;
  }
};

const updatePage = (value: number) => {
  if (loading.value) return;
  if (serverOptionsComputed.value) {
    serverOptionsComputed.value = {
      ...serverOptionsComputed.value,
      page: value,
    };
  } else {
    currentPaginationNumber.value = value;
  }
};

watch(loading, (newVal, oldVal) => {
  if (serverOptionsComputed.value) {
    // in server-side mode, turn to next page when api request finished.
    if (newVal === false && oldVal === true) {
      currentPaginationNumber.value = serverOptionsComputed.value.page;
    }
  }
});

// items in current page
const itemsInPage = computed((): Item[] => {
  if (isServerSideMode.value) return props.items;
  return itemsSorting.value.slice(firstIndexOfItemsInCurrentPage.value - 1, lastIndexOfItemsInCurrentPage.value);
});

const currentPageFirstIndex = computed(():number => rowsPerPageReactive.value * (currentPaginationNumber.value - 1) + 1);
const currentPageLastIndex = computed(():number => rowsPerPageReactive.value * currentPaginationNumber.value);

// items with index
const itemsWithIndex = computed((): Item[] => {
  if (props.showIndex) {
    return itemsInPage.value.map((item, index) => ({ index: currentPageFirstIndex.value + index, ...item }));
  }
  return itemsInPage.value;
});

/**
 * items computed flow:
 * items searching => filtering => sorting => current page => with index => with checkbox => render
*/

// items for render (with checbox)
const itemsForRender = computed((): Item[] => {
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

const toggleSelectAll = (isChecked: boolean): void => {
  selectItemsComputed.value = isChecked ? itemsSorting.value : [];
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

const clickRow = (item: Item) => {
  const clickRowArgument = { ...item };
  if (isMutipleSelectable.value) {
    const { checkbox } = item;
    delete clickRowArgument.checkbox;
    clickRowArgument.isSelected = checkbox;
  }
  if (props.showIndex) {
    const { index } = item;
    delete clickRowArgument.index;
    clickRowArgument.indexInCurrentPage = index;
  }
  emits('clickRow', clickRowArgument);
};

defineExpose({
  clientItemsLength: totalItemsLength,
  currentPageFirstIndex,
  currentPageLastIndex,
  maxPaginationNumber,
  currentPaginationNumber,
  isLastPage,
  isFirstPage,
  nextPage,
  prevPage,
  updatePage,
});
</script>

<style lang="scss" scoped>
  .vue3-easy-data-table {
    border: var(--easy-table-border);
    position: relative;
    box-sizing: border-box;
  }
  .vue3-easy-data-table__main {
    border: none;
    width: 100%;
    overflow: auto;
    background-color: var(--easy-table-body-row-background-color);
    min-height: 180px;

    &::-webkit-scrollbar-track
    {
      border-radius: 10px;
      background-color: var(--easy-table-scrollbar-track-color);
    }

    &::-webkit-scrollbar
    {
      width: 7px;
      height: 7px;
      background-color: var(--easy-table-scrollbar-color);
    }

    &::-webkit-scrollbar-thumb
    {
      border-radius: 10px;
      background-color: var(--easy-table-scrollbar-thumb-color);
    }

    &::-webkit-scrollbar-corner
    {
      background-color: var(--easy-table-scrollbar-corner-color);
    }

    &.table-fixed {
      table {
        table-layout: fixed;
      }
    }
    &.show-shadow {
      th.shadow, td.shadow {
        &::after {
          box-shadow: inset 6px 0 5px -3px rgb(0 0 0 / 20%);
        }
      }
    }
    &.fixed-header {
      th {
        position: sticky;
        top: 0;
        z-index: 2;
      }
    }
    &.fixed-height {
      height: v-bind(tableHeightPx);
    }
    &.hoverable {
      tr:hover td {
        background-color: var(--easy-table-body-row-hover-background-color);
        color: var(--easy-table-body-row-hover-font-color);
      }

      .vue3-easy-data-table__body.row-alternation {
        .even-row:hover td {
          color: var(--easy-table-body-row-hover-font-color);
          background-color: var(--easy-table-body-row-hover-background-color);
        }
      }
    }
    &.border-cell {
      .vue3-easy-data-table__header th {
        border-right: var(--easy-table-row-border);
      }

      .vue3-easy-data-table__header th:last-of-type {
        border-right: none;
      }

      .vue3-easy-data-table__body td {
        border-right: var(--easy-table-row-border);
      }
      .vue3-easy-data-table__body td:last-of-type {
        border-right: none;
      }
    }
  }
  table {
    display: table;
    width: 100%;
    border-spacing: 0;
    margin: 0px;
  }
  // fixed-columns feature related
  .vue3-easy-data-table__header, vue3-easy-data-table__body {
    position: relative;
  }
  .vue3-easy-data-table__header tr {
    font-size: var(--easy-table-header-font-size);
    border: none;
    height: var(--easy-table-header-height);
  }
  .vue3-easy-data-table__header th {
    background-color: var(--easy-table-header-background-color);
    color: var(--easy-table-header-font-color);
    border: none;
    border-bottom: var(--easy-table-row-border);

    padding: var(--easy-table-header-item-padding);

    position: relative;
    .header {
      display: flex;
      align-items: center;
    }

    &.sortable {
      cursor: pointer;
      .sortType-icon {
        border: 5px solid transparent;
        margin-top: -3px;
        margin-left: 4px;
        display: inline-block;
        height: 0;
        width: 0;
        position: relative;
        border-bottom-color: var(--easy-table-header-font-color);
      }

      &.none {
        &:hover {
          .sortType-icon {
            opacity: 1;
          }
        }
        .sortType-icon {
          opacity: 0;
          transition: 0.5s ease;
        }
      }
      &.desc {
        .sortType-icon {
          margin-top: 5px;
          transform: rotate(180deg);
        }
      }
    }
  }

  // fixed-columns feature related
  .vue3-easy-data-table__header th, .vue3-easy-data-table__body td {
    &.shadow {
      &::after {
        pointer-events: none;
        content: "";
        width: 36px;
        display: inline-block;
        height: 100%;
        position: absolute;
        top: 0px;
        right: -36px;
        box-shadow: none;
      }
    }
  }
  .vue3-easy-data-table__body tr {
    height: var(--easy-table-body-row-height);
    color: var(--easy-table-body-row-font-color);
    font-size: var(--easy-table-body-row-font-size);

    &:nth-child(-n+3) {
      td {
        border-bottom: var(--easy-table-row-border)!important;
      }
    }
    &:last-child {
      td {
        border-bottom: none;
      }
    }
    &:first-child {

      td {
        border-bottom: var(--easy-table-row-border);
      }
    }
  }

  .vue3-easy-data-table__body.row-alternation {
    .even-row td {
      color: var(--easy-table-body-even-row-font-color);
      background-color: var(--easy-table-body-even-row-background-color);
    }
  }
  .vue3-easy-data-table__body td {
    padding: var(--easy-table-body-item-padding);
    background-color: var(--easy-table-body-row-background-color);
    border: none;
    border-bottom: var(--easy-table-row-border);

    position: relative;
    .expand-icon {
      border: solid;
      border-color: var(easy-table-body-row-font-color);

      border-width: 0 2px 2px 0;
      display: inline-block;
      padding: 3px;
      transform: rotate(-45deg);
      transition: 0.2s;
      &.expanding {
        transform: rotate(45deg);
      }
    }
  }

  // expandable row feature related
  .vue3-easy-data-table__body td.expand {
    position: relative;
    .expand-loading {
      position: absolute;
      top: 0px;
      left: 0px;
    }
  }
  .vue3-easy-data-table__body td.can-expand {
    cursor: pointer;
  }

  .vue3-easy-data-table__footer {
    background-color: var(--easy-table-footer-background-color);
    color: var(--easy-table-footer-font-color);
    border-top: var(--easy-table-row-border);
    font-size: var(--easy-table-footer-font-size);
    height: var(--easy-table-footer-height);
    padding: var(--easy-table-footer-padding);

    box-sizing: border-box;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .pagination__rows-per-page {
      display: flex;
      align-items: center;
    }
    .pagination__items-index {
      margin: 0px 20px 0px 10px;
    }
  }
  .vue3-easy-data-table__message {
    color: var(--easy-table-message-font-color);
    font-size: var(--easy-table-message-font-size);
    padding: var(--easy-table-message-padding);

    text-align: center;
  }
  .vue3-easy-data-table__loading {
    z-index: 3;
    overflow: hidden;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    display: flex;
    align-items: center;
    justify-content: center;

    .loading-entity {
      z-index: 1;
    }
  }
  .vue3-easy-data-table__loading-mask {
    background-color: var(--easy-table-loading-mask-background-color);
    opacity: var(--easy-table-loading-mask-opacity);

    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    z-index: 1;
  }
</style>

<style>
  :root {
    /*table*/
    --easy-table-border: 1px solid #e0e0e0;
    --easy-table-row-border: 1px solid #e0e0e0;
    /*header-row*/
    --easy-table-header-font-size: 12px;
    --easy-table-header-height: 36px;
    --easy-table-header-font-color: #373737;
    --easy-table-header-background-color: #fff;
    /*header-item*/
    --easy-table-header-item-padding: 0px 10px;
    /*body-row*/
    --easy-table-body-row-height: 36px;
    --easy-table-body-row-font-size: 12px;

    --easy-table-body-row-font-color: #212121;
    --easy-table-body-row-background-color: #fff;

    --easy-table-body-row-hover-font-color: #212121;
    --easy-table-body-row-hover-background-color: #eee;

    --easy-table-body-even-row-font-color: #373737;
    --easy-table-body-even-row-background-color: #fff;
    /*body-item*/
    --easy-table-body-item-padding: 0px 10px;
    /*footer*/
    --easy-table-footer-background-color: #fff;
    --easy-table-footer-font-color: #212121;
    --easy-table-footer-font-size: 12px;
    --easy-table-footer-padding: 0px 5px;
    --easy-table-footer-height: 36px;
    /*message*/
    --easy-table-message-font-color: #212121;
    --easy-table-message-font-size: 12px;
    --easy-table-message-padding: 20px;
    /*loading-mask*/
    --easy-table-loading-mask-background-color: #fff;
    --easy-table-loading-mask-opacity: 0.5;
    /*scroll-bar*/
    --easy-table-scrollbar-track-color: #fff;
    --easy-table-scrollbar-color: #fff;
    --easy-table-scrollbar-thumb-color: #c1c1c1;
    --easy-table-scrollbar-corner-color: #fff;
    /*buttons-pagination*/
    --easy-table-buttons-pagination-border: 1px solid #e0e0e0;
  }
</style>
