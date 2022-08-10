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
              }, typeof headerItemClassName === 'string' ? headerItemClassName : headerItemClassName(header as Header, index)]"
              :style="getFixedDistance(header.value)"
              @click.stop="(header.sortable && header.sortType) ? updateSortField(header.value, header.sortType) : null"
            >
              <MultipleSelectCheckBox
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
          <slot 
            name="body.prepend"
          />
          <template
            v-for="(item, index) in pageItems"
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
          <slot 
            name="body.append"
          />
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
        v-if="!pageItems.length && !loading"
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
          v-model="rowsPerPageRef"
          :rows-items="rowsItemsComputed"
        />
      </div>
      <div class="pagination__items-index">
        {{ `${currentPageFirstIndex}–${currentPageLastIndex}` }}
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
  useSlots, computed, toRefs, ref, watch, provide, onMounted, PropType,
} from 'vue';

import MultipleSelectCheckBox from './MultipleSelectCheckBox.vue';
import SingleSelectCheckBox from './SingleSelectCheckBox.vue';
import RowsSelector from './RowsSelector.vue';
import Loading from './Loading.vue';
import LoadingLine from './LoadingLine.vue';
import ButtonsPagination from './ButtonsPagination.vue';
import PaginationArrows from './PaginationArrows.vue';

import useClickRow from '../hooks/useClickRow';
import useExpandableRow from '../hooks/useExpandableRow';
import useFixedColumn from '../hooks/useFixedColumn';
import useHeaders from '../hooks/useHeaders';
import usePageItems from '../hooks/usePageItems';
import usePagination from '../hooks/usePagination';
import useRows from '../hooks/useRows';
import useServerOptions from '../hooks/useServerOptions';
import useTotalItems from '../hooks/useTotalItems';

import type { Header, Item } from '../types/main';
import type { HeaderForRender } from '../types/internal';

// eslint-disable-next-line import/extensions
import { generateColumnContent } from '../utils';
import propsWithDefault from '../propsWithDefault';

const props = defineProps({
  ...propsWithDefault,
  items: {
    type: Array as PropType<Item[]>,
    required: true,
  },
  headers: {
    type: Array as PropType<Header[]>,
    required: true,
  },
});

const {
  checkboxColumnWidth,
  expandColumnWidth,
  filterOptions,
  fixedCheckbox,
  fixedExpand,
  fixedHeader,
  fixedIndex,
  headers,
  indexColumnWidth,
  items,
  itemsSelected,
  loading,
  mustSort,
  rowsItems,
  rowsPerPage,
  searchField,
  searchValue,
  serverItemsLength,
  serverOptions,
  showIndex,
  sortBy,
  sortType,
  tableHeight,
  themeColor,
} = toRefs(props);

// style related computed variables
const tableHeightPx = computed(() => (tableHeight.value ? `${tableHeight.value}px` : null));

// global style related variable
provide('themeColor', themeColor.value);

// slot
const slots = useSlots();
const ifHasPaginationSlot = computed(() => !!slots.pagination);
const ifHasLoadingSlot = computed(() => !!slots.loading);
const ifHasExpandSlot = computed(() => !!slots.expand);

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

const emits = defineEmits([
  'clickRow',
  'expandRow',
  'updateSort',
  'update:itemsSelected',
  'update:serverOptions',
]);

const isMultipleSelectable = computed((): boolean => itemsSelected.value !== null);
const isServerSideMode = computed((): boolean => serverOptions.value !== null);

const {
  serverOptionsComputed,
  updateServerOptionsPage,
  updateServerOptionsSort,
  updateServerOptionsRowsPerPage,
} = useServerOptions(
  serverOptions,
  emits,
);

const {
  clientSortOptions,
  headerColumns,
  headersForRender,
  updateSortField,
} = useHeaders(
  checkboxColumnWidth,
  expandColumnWidth,
  fixedCheckbox,
  fixedExpand,
  fixedIndex,
  headers,
  ifHasExpandSlot,
  indexColumnWidth,
  isMultipleSelectable,
  isServerSideMode,
  mustSort,
  serverOptionsComputed,
  showIndex,
  sortBy,
  sortType,
  updateServerOptionsSort,
  emits
);

const {
  rowsItemsComputed,
  rowsPerPageRef,
} = useRows(
  isServerSideMode,
  rowsItems,
  serverOptions,
  rowsPerPage,
);

const {
  totalItems,
  selectItemsComputed,
  totalItemsLength,
  toggleSelectAll,
  toggleSelectItem,
} = useTotalItems(
  clientSortOptions,
  filterOptions,
  isServerSideMode,
  items,
  itemsSelected,
  searchField,
  searchValue,
  serverItemsLength,
  emits,
);

const {
  currentPaginationNumber,
  maxPaginationNumber,
  isLastPage,
  isFirstPage,
  nextPage,
  prevPage,
  updatePage,
  updateCurrentPaginationNumber,
} = usePagination(
  isServerSideMode,
  loading,
  totalItemsLength,
  rowsPerPageRef,
  serverOptions,
  updateServerOptionsPage,
);

const {
  currentPageFirstIndex,
  currentPageLastIndex,
  multipleSelectStatus,
  pageItems,
} = usePageItems(
  currentPaginationNumber,
  isMultipleSelectable,
  isServerSideMode,
  items,
  rowsPerPageRef,
  selectItemsComputed,
  showIndex,
  totalItems,
  totalItemsLength,
);

const {
  expandingItemIndexList,
  updateExpandingItemIndexList,
  clearExpandingItemIndexList,
} = useExpandableRow(
  items,
  emits,
);

const {
  fixedHeaders,
  lastFixedColumn,
  fixedColumnsInfos,
} = useFixedColumn(
  headersForRender,
);

const {
  clickRow,
} = useClickRow(
  isMultipleSelectable,
  showIndex,
  emits,
);

// template style generation function
const getColStyle = (header: HeaderForRender): string | undefined => {
  const width = header.width ?? (fixedHeaders.value.length ? 100 : null);
  if (width) return `width: ${width}px; min-width: ${width}px;`;
  return undefined;
};

const getFixedDistance = (column: string, type: 'td' | 'th' = 'th') => {
  if (!fixedHeaders.value.length) return undefined;
  const columInfo = fixedColumnsInfos.value.find((info) => info.value === column);
  if (columInfo) {
    return `left: ${columInfo.distance}px;z-index: ${type === 'th' ? 3 : 1};position: sticky;`;
  }
  return undefined;
};

watch(loading, (newVal, oldVal) => {
  if (serverOptionsComputed.value) {
    // in server-side mode, turn to next page when api request finished.
    if (newVal === false && oldVal === true) {
      updateCurrentPaginationNumber(serverOptionsComputed.value.page);
      clearExpandingItemIndexList();
    }
  }
});

watch(items, () => {
  if (!isServerSideMode.value) updatePage(1);
}, { deep: true });

watch(rowsPerPageRef, (value) => {
  if (!isServerSideMode.value) {
    updatePage(1);
  } else {
    updateServerOptionsRowsPerPage(value);
  }
});

watch([currentPaginationNumber, clientSortOptions, searchField, searchValue, filterOptions], () => {
  clearExpandingItemIndexList();
}, { deep: true });

defineExpose({
  currentPageFirstIndex,
  currentPageLastIndex,
  clientItemsLength: totalItemsLength,
  maxPaginationNumber,
  currentPaginationNumber,
  isLastPage,
  isFirstPage,
  nextPage,
  prevPage,
  updatePage,
});
</script>

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

    --easy-table-body-even-row-font-color: #212121;
    --easy-table-body-even-row-background-color: #fafafa;
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

<style lang="scss" scoped>
@import '../scss/vue3-easy-data-table.scss';

.vue3-easy-data-table__main.fixed-height {
  height: v-bind(tableHeightPx);
}
</style>

