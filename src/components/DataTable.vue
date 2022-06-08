<template>
  <div
    ref="dataTable"
    class="vue3-easy-data-table"
  >
    <div
      class="data-table__body"
      :class="{
        'fixed-header': fixedHeader,
        'wrap-lines': wrapLines,
        'max-height': maxHeight,
      }"
    >
      <table>
        <thead v-if="headersForRender.length">
          <tr>
            <th
              v-for="(header, index) in headersForRender"
              :key="index"
              :class="{
                sortable: header.sortable,
                'none': header.sortable && header.sortType === 'none',
                'desc': header.sortable && header.sortType === 'desc',
                'asc': header.sortable && header.sortType === 'asc',
              }"
              @click="(header.sortable && header.sortType) ? updateSortField(header.value, header.sortType) : null"
            >
              <MutipleSelectCheckBox
                v-if="header.text === 'checkbox'"
                :key="multipleSelectStatus"
                :status="multipleSelectStatus"
                @change="toggleSelectAll"
              />
              <span
                v-else
                class="header-text__wrapper"
              >
                <span class="header-text">
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
        <slot
          v-if="ifHasBodySlot"
          name="body"
        />
        <template v-else>
          <tbody
            v-if="items.length && headerColumns.length"
            :class="{'row-alternation': alternating, 'hover-to-change-color': hoverToChangeColor}"
          >
            <tr
              v-for="(item) in itemsForRender"
              :key="JSON.stringify(item)"
            >
              <td
                v-for="(column, i) in headerColumns"
                :key="i"
              >
                <slot
                  v-if="slots[column]"
                  :name="column"
                  v-bind="item"
                />
                <template v-else-if="column === 'checkbox'">
                  <SingleSelectCheckBox
                    :checked="item[column]"
                    @change="toggleSelectItem(item)"
                  />
                </template>
                <template v-else>
                  {{ Array.isArray(item[column]) ? item[column].join(',') : item[column] }}
                </template>
              </td>
            </tr>
          </tbody>
        </template>
      </table>
      <div
        v-if="loading"
        class="loading-wrapper"
        :class="{'initial-loading': (!items.length && loading) }"
      >
        <div class="loading-entity">
          <slot
            v-if="ifHasLoadingSlot"
            name="loading"
          />
          <Loading v-else></Loading>
        </div>
        <div class="loading-wrapper__mask"></div>
      </div>

      <div
        v-if="!itemsForRender.length && !loading"
        class="data-table__message"
      >
        {{ emptyMessage }}
      </div>
    </div>
    <div class="data-table__footer">
      <div class="footer__rows-per-page">
        rows per page:
        <RowsSelector
          v-model="rowsPerPageReactive"
          :rows-items="rowsItems"
        />
      </div>
      <div class="footer__items-index">
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
  useSlots, computed, toRefs, PropType, ref, watch, provide, defineExpose,
} from 'vue';
import MutipleSelectCheckBox from './MutipleSelectCheckBox.vue';
import SingleSelectCheckBox from './SingleSelectCheckBox.vue';
import RowsSelector from './RowsSelector.vue';
// import LoadingLine from './LoadingLine.vue';
import Loading from './Loading.vue';
import ButtonsPagination from './ButtonsPagination.vue';
import PaginationArrows from './PaginationArrows.vue';

import type {
  SortType, Header, Item, ServerOptions,
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
  rowBorderColor: {
    type: String,
    default: '#e0e0e0',
  },
  tableBorderColor: {
    type: String,
    default: '#e0e0e0',
  },
  rowBackgroundColor: {
    type: String,
    default: '#fff',
  },
  footerBackgroundColor: {
    type: String,
    default: '#fff',
  },
  rowFontColor: {
    type: String,
    default: '#212121',
  },
  footerFontColor: {
    type: String,
    default: '#212121',
  },
  emptyMessage: {
    type: String,
    default: 'No Available Data',
  },
  fixedHeader: {
    type: Boolean,
    default: true,
  },
  headerFontColor: {
    type: String,
    default: '#373737',
  },
  headerBackgroundColor: {
    type: String,
    default: '#fff',
  },
  tableFontSize: {
    type: Number,
    default: 12,
  },
  evenRowBackgroundColor: {
    type: String,
    default: '#fafafa',
  },
  evenRowFontColor: {
    type: String,
    default: '#212121',
  },
  headers: {
    type: Array as PropType<Header[]>,
    required: true,
  },
  hoverToChangeColor: {
    type: Boolean,
    default: true,
  },
  items: {
    type: Array as PropType<Item[]>,
    required: true,
  },
  maxHeight: {
    type: Number,
    default: () => null,
  },
  wrapLines: {
    type: Boolean,
    default: false,
  },
  itemsSelected: {
    type: Array as PropType<Item[]> | null,
    default: null,
  },
  searchField: {
    type: String,
    default: '',
  },
  searchValue: {
    type: String,
    default: '',
  },
  rowsPerPage: {
    type: Number,
    default: 25,
  },
  rowsItems: {
    type: Array as PropType<number[]>,
    default: () => [25, 50, 100],
  },
  rowHoverBackgroundColor: {
    type: String,
    default: '#eee',
  },
  rowHoverFontColor: {
    type: String,
    default: '#212121',
  },
  loading: {
    type: Boolean,
    deault: false,
  },
  serverOptions: {
    type: Object as PropType<ServerOptions>,
    default: () => null,
  },
  serverItemsLength: {
    type: Number,
    default: 0,
  },
  sortBy: {
    type: String,
    default: '',
  },
  sortType: {
    type: String as PropType<SortType>,
    default: 'asc',
  },
  themeColor: {
    type: String,
    default: '#42b883',
  },
  dense: {
    type: Boolean,
    default: false,
  },
  showIndex: {
    type: Boolean,
    default: false,
  },
});

const {
  rowBorderColor,
  tableBorderColor,
  headerFontColor,
  rowFontColor,
  rowHoverBackgroundColor,
  rowHoverFontColor,
  footerBackgroundColor,
  rowBackgroundColor,
  evenRowBackgroundColor,
  evenRowFontColor,
  footerFontColor,
} = toRefs(props);

const fontSizePx = computed(() => `${props.tableFontSize}px`);
const rowHeight = computed(() => props.tableFontSize * (props.dense ? 2 : 3));
const rowHeightPx = computed(() => `${rowHeight.value}px`);
const maxHeightPx = computed(() => (props.maxHeight ? `${props.maxHeight}px` : null));
const sortTypeIconSize = computed(() => Math.round(props.tableFontSize / 2.5));
const sortTypeIconSizePx = computed(() => `${sortTypeIconSize.value}px`);
const sortTypeIconMargin = computed(() => Math.round(sortTypeIconSize.value));
const sortTypeAscIconMarginTopPx = computed(() => `-${sortTypeIconMargin.value}px`);
const sortTypeDescIconMarginTopPx = computed(() => `${sortTypeIconMargin.value}px`);
const loadingEntitySizePx = computed(() => `${props.tableFontSize * 5}px`);
const loadingWrapperSizePx = computed(() => (props.maxHeight ? `${props.maxHeight - rowHeight.value}px`
  : `${props.tableFontSize * 5 * 2}px`));
// global style variable
provide('themeColor', props.themeColor);
provide('loadingEntitySizePx', loadingEntitySizePx.value);
provide('rowHeight', rowHeight.value);
provide('rowBorderColor', rowBorderColor.value);
provide('footerBackgroundColor', footerBackgroundColor.value);
provide('footerFontColor', footerFontColor.value);

// table body slot
const slots = useSlots();
const ifHasBodySlot = computed(() => slots.body);
const ifHasPaginationSlot = computed(() => slots.pagination);
const ifHasLoadingSlot = computed(() => slots.loading);

// global dataTable $ref
const dataTable = ref();
provide('dataTable', dataTable);

// define emits
const emits = defineEmits([
  'update:itemsSelected',
  'update:serverOptions',
]);

const serverOptionsComputed = computed({
  get: (): ServerOptionsComputed => {
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
    return {
      page: 1,
      rowsPerPage: 25,
      sortBy: null,
      sortType: null,
    };
  },
  set: (value) => {
    emits('update:serverOptions', value);
  },
});

const isMutipleSelectable = computed((): boolean => props.itemsSelected !== null);

const isServerSideMode = computed((): boolean => props.serverOptions !== null);

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

// headers for render (integrating sortType, checkbox...)
const headersForRender = computed((): HeaderForRender[] => {
  const headersSorting = props.headers.map((header: HeaderForRender) => {
    const headerSorting = header;
    if (header.sortable) headerSorting.sortType = 'none';
    if (isServerSideMode.value && header.value === serverOptionsComputed.value.sortBy && serverOptionsComputed.value.sortType) {
      headerSorting.sortType = serverOptionsComputed.value.sortType;
    }
    if (!isServerSideMode.value && clientSortOptions.value && header.value === clientSortOptions.value.sortBy) {
      headerSorting.sortType = clientSortOptions.value.sortDesc ? 'desc' : 'asc';
    }
    return headerSorting;
  });
  const headersWithIndex = props.showIndex ? [{ text: '#', value: 'index' }, ...headersSorting] : headersSorting;
  const headersWithCheckbox = isMutipleSelectable.value
    ? [{ text: 'checkbox', value: 'checkbox' }, ...headersWithIndex] : headersWithIndex;
  return headersWithCheckbox;
});

const headerColumns = computed((): string[] => headersForRender.value.map((header) => header.value));

// multiple select
const selectItemsComputed = computed({
  get: () => props.itemsSelected ?? [],
  set: (value) => {
    emits('update:itemsSelected', value);
  },
});

const multipleSelectStatus = computed((): 'allSelected' | 'noneSelected' | 'partSelected' => {
  if (selectItemsComputed.value.length === 0) {
    return 'noneSelected';
  } if (selectItemsComputed.value.length === props.items.length) {
    return 'allSelected';
  }
  return 'partSelected';
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

const currentPaginationNumber = ref(isServerSideMode.value ? props.serverOptions.page : 1);

// rows per page
const rowsPerPageReactive = ref(isServerSideMode.value ? props.serverOptions.rowsPerPage : props.rowsPerPage);
watch(rowsPerPageReactive, (value) => {
  if (isServerSideMode.value) {
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

  if (isServerSideMode.value) {
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
  if (clientSortOptions.value === null) return itemsSearching.value;
  const { sortBy, sortDesc } = clientSortOptions.value;
  const itemsSearchingSorted = [...itemsSearching.value];
  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  return itemsSearchingSorted.sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return sortDesc ? 1 : -1;
    if (a[sortBy] > b[sortBy]) return sortDesc ? -1 : 1;
    return 0;
  });
});

// index info of items in current page.
const totalItemsLength = computed((): number => (isServerSideMode.value ? props.serverItemsLength : itemsSearching.value.length));

const lastIndexOfItemsInCurrentPage = computed((): number => {
  if (isServerSideMode.value) {
    return currentPaginationNumber.value * rowsPerPageReactive.value;
  }
  return Math.min(
    itemsSearching.value.length,
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
  if (isServerSideMode.value) {
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
  if (isServerSideMode.value) {
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
  if (isServerSideMode.value) {
    serverOptionsComputed.value = {
      ...serverOptionsComputed.value,
      page: value,
    };
  } else {
    currentPaginationNumber.value = value;
  }
};

watch(loading, (newVal, oldVal) => {
  if (isServerSideMode.value) {
    // in server-side mode, turn to next page when api request finished.
    if (newVal === false && oldVal === true) {
      currentPaginationNumber.value = serverOptionsComputed.value.page;
    }
  }
});

// items searching => sorting => current page => with index => with checkbox => render

// items in current page
const itemsInPage = computed((): Item[] => {
  if (isServerSideMode.value) return props.items;
  return itemsSorting.value.slice(firstIndexOfItemsInCurrentPage.value - 1, lastIndexOfItemsInCurrentPage.value);
});

const currentPageFirstIndex = computed(():number => rowsPerPageReactive.value * (currentPaginationNumber.value - 1));
const currentPageLastIndex = computed(():number => rowsPerPageReactive.value * currentPaginationNumber.value);

defineExpose({
  totalItemsLength,
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

// items with index
const itemsWithIndex = computed((): Item[] => {
  if (props.showIndex) {
    return itemsInPage.value.map((item, index) => ({ index: currentPageFirstIndex.value + index + 1, ...item }));
  }
  return itemsInPage.value;
});

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

</script>

<style lang="scss" scoped>
  .vue3-easy-data-table {
    position: relative;
    border: 1px solid v-bind(tableBorderColor);
    box-sizing: border-box;
    tr, td, th, tbody, thead, table, div {
      box-sizing: border-box;
    }
    .data-table__body {

      .loading-wrapper {
        padding-top: v-bind(rowHeightPx);
        padding-bottom: v-bind(rowHeightPx);
        position: absolute;
        width: 100%;
        top: 0px;
        left:0px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font-size: v-bind(fontSizePx);
        color: v-bind(rowFontColor);
        .loading-entity {
          z-index: 1;
        }
        &__mask {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0px;
          left:0px;
          background-color: v-bind(rowBackgroundColor);
          opacity: 0.5;
        }
        &.initial-loading {
          position: relative;
          padding-bottom: v-bind(rowHeightPx);
          .loading-wrapper__mask {
            opacity: 1;
          }
        }
      }
      &.fixed-header {
        thead {
          position: sticky;
          top: 0;
          z-index: 1;
        }
      }
      &.wrap-lines {
        table {
          table-layout: fixed;
          word-break: break-all;
        }
      }
    }
  }

  .data-table__body {
    border: none;
    box-sizing: border-box;
    width: 100%;
    &.max-height {
      max-height: v-bind(maxHeightPx);
      .loading-wrapper {
        height: v-bind(loadingWrapperSizePx);
        top: v-bind(rowHeightPx);
        padding: 0px!important;
        &.initial-loading {
          top: 0px;
        }
      }
    }
    overflow: auto;
    table {
      display: table;
      margin: 0px;
      width: 100%;
      background-color: v-bind(rowBackgroundColor);
      border-spacing: 0;
      tr {
        border: none;
      }
      th, td {
        text-align: left;
        padding: 0px 10px;
      }
      thead, tbody {
        position: relative;
      }
      thead {
        font-size: v-bind(fontSizePx);
        tr {
          border: none;
          height: v-bind(rowHeightPx);
        }
        th {
          border: none;
          border-bottom: 1px solid v-bind(rowBorderColor);;
          color: v-bind(headerFontColor);
          position: relative;
          background-color: v-bind(headerBackgroundColor);
          .header-text__wrapper {
            display: flex;
            align-items: center;
            height: v-bind(fontSizePx);
          }

          &.sortable {
            cursor: pointer;

            .sortType-icon {
              border: v-bind(sortTypeIconSizePx) solid transparent;
              margin-top: v-bind(sortTypeAscIconMarginTopPx);
              margin-left: 4px;
              display: inline-block;
              height: 0;
              width: 0;
              border-bottom-color: v-bind(headerFontColor);
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
                margin-top: v-bind(sortTypeDescIconMarginTopPx);
                transform: rotate(180deg);
              }
            }
          }

          .sortType-icon {
            display: inline-block;
            width: v-bind(fontSizePx);
            height: v-bind(fontSizePx);
            &.desc {
              transform: rotate(180deg);
            }
          }
        }
      }
      tbody {
        font-size: v-bind(fontSizePx);
        &.hover-to-change-color {
          tr:hover {
            background-color: v-bind(rowHoverBackgroundColor);
            color: v-bind(rowHoverFontColor);
          }
        }
        tr {
          height: v-bind(rowHeightPx);
          color: v-bind(rowFontColor);
          &:last-child {
            border-bottom: none;
            td {
              border-bottom: none;
            }
          }
        }
        td {
          border: none;
          border-bottom: 1px solid v-bind(rowBorderColor);
        }
        &.row-alternation {
          &.hover-to-change-color {
            tr:hover {
              background-color: v-bind(rowHoverBackgroundColor);
              color: v-bind(rowHoverFontColor);
            }
          }
          tr:nth-child(2n) {
            color: v-bind(evenRowFontColor);
            background-color: v-bind(evenRowBackgroundColor);
          }
        }
      }
    }
    .data-table__message {
      background-color: v-bind(rowBackgroundColor);
      text-align: center;
      color: v-bind(rowFontColor);
      font-size: v-bind(fontSizePx);
      padding: 20px;
    }
    .gms_base_dialog__loading {
      display: block;
      width: 50px;
      margin: 0 auto;
    }
  }

  .data-table__footer {
    background-color: v-bind(footerBackgroundColor);;
    color: v-bind(footerFontColor);
    width: 100%;
    display: flex;
    border-top: 1px solid v-bind(rowBorderColor);
    font-size: v-bind(fontSizePx);
    align-items: center;
    justify-content: flex-end;
    padding: 0px 5px;
    box-sizing: border-box;
    height: v-bind(rowHeightPx);

    .footer__rows-per-page {
      display: flex;
      align-items: center;
    }
    .footer__items-index {
      margin: 0px 20px 0px 10px;
    }
  }

</style>
