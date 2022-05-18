<template>
  <div class="data-table">
    <div
      class="data-table__body"
      :class="{'fixed-header': fixedHeader, 'wrap-lines': wrapLines }"
    >
      <table>
        <thead v-if="headersComputed.length">
          <tr>
            <th
              v-for="(header, index) in headersComputed"
              :key="index"
            >
              <MutipleSelectCheckBox
                v-if="header.text === 'checkbox'"
                :key="multipleSelectStatus"
                :status="multipleSelectStatus"
                @change="toggleSelectAll"
              />
              <span v-else>{{ header.text }}</span>
            </th>
          </tr>
        </thead>
        <slot
          v-if="ifHasBodySlot"
          name="body"
        />
        <template v-else>
          <tbody v-if="items.length && headerComputedColumns.length">
            <tr
              v-for="(item) in itemsForDisplay"
              :key="JSON.stringify(item)"
              @click="clickItem(item)"
            >
              <td
                v-for="(column, i) in headerComputedColumns"
                :key="i"
              >
                <template v-if="column === 'checkbox'">
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
        v-if="!items.length"
        class="data-table__message"
      >
        {{ emptyMessage }}
      </div>
    </div>
    <div class="data-table__footer">
      <div class="footer__rows-per-page">
        rows per page:
        <RowsSelector
          v-model="rowsPerPage"
          :rows-items="rowsItems"
        />
      </div>
      <div class="footer__pagination">
        {{ `${paginationStart}-${paginationEnd}` }} of {{ itemsNumber }}
      </div>
      <div
        class="footer__previous"
        :class="{'firstPage': isFirstPage}"
        @click="prevPage"
      >
        <span class="arrow arrow-right"></span>
      </div>
      <div
        class="footer__next"
        :class="{'lastPage': isLastPage}"
        @click="nextPage"
      >
        <span class="arrow arrow-left"></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  useSlots, computed, toRefs, PropType, ref,
} from 'vue';
import MutipleSelectCheckBox from './MutipleSelectCheckBox.vue';
import SingleSelectCheckBox from './SingleSelectCheckBox.vue';
import RowsSelector from './RowsSelector.vue';

import type { Header } from '@/types/table.ts';

type Item = Record<string, any>

const props = defineProps({
  bodyFontColor: {
    type: String,
    default: '#212121',
  },
  bodyFontSize: {
    type: Number,
    default: 12,
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
  headerFontSize: {
    type: Number,
    default: 12,
  },
  headers: {
    type: Array as PropType<Header[]>,
    required: true,
  },
  items: {
    type: Array as PropType<Item[]>,
    required: true,
  },
  maxHeight: {
    type: Number,
    default: () => 400,
  },
  rowHeight: {
    type: Number,
    default: () => 48,
  },
  wrapLines: {
    type: Boolean,
    default: false,
  },
  selectItems: {
    type: Array as PropType<Item[]> | null,
    default: null,
  },
  search: {
    type: String,
    default: '',
  },
  rowsItems: {
    type: Array as PropType<number[]>,
    default: () => [25, 50, 100],
  },
});

const {
  rowHeight,
  headers,
  maxHeight,
  headerFontSize,
  bodyFontSize,
  headerFontColor,
  bodyFontColor,
  emptyMessage,
  items,
  search,
} = toRefs(props);

// css bind value
const trHeight = computed(() => `${rowHeight.value}px`);
const headerFontSizePx = computed(() => `${headerFontSize.value}px`);
const bodyFontSizePx = computed(() => `${bodyFontSize.value}px`);
const tableMaxHeight = computed(() => `${maxHeight.value}px`);

// table body slot
const slots = useSlots();
const ifHasBodySlot = computed(() => slots.body);

// define emits
const emits = defineEmits(['clickItem', 'update:selectItems', 'update:isAllSelected']);

// click item
const clickItem = (item: Record<string, string | number>) => {
  emits('clickItem', item);
};

// multi select
// selectedItems
const selectItemsComputed = computed({
  get: () => props.selectItems,
  set: (value) => {
    emits('update:selectItems', value);
  },
});

const multipleSelectStatus = computed((): 'allSelected' | 'noneSelected' | 'partSelected' => {
  if (selectItemsComputed.value.length === items.value.length) {
    return 'allSelected';
  } if (selectItemsComputed.value.length === 0) {
    return 'noneSelected';
  }
  return 'partSelected';
});

// search items
const searchItems = computed((): Item[] => {
  if (search.value !== '') {
    const regex = new RegExp(search.value, 'i');
    return items.value.filter((item) => regex.test(Object.values(item).join('')));
  }
  return items.value;
});

// items in page
const itemsInPage = computed((): Item[] => {
  const res: Item[] = [];
  for (let i = paginationStart.value - 1; i < paginationEnd.value; i += 1) {
    res.push(searchItems.value[i]);
  }
  return res;
});

// itemsForDisplay
const itemsForDisplay = computed((): Item[] => {
  if (selectItemsComputed.value === null) {
    // no multi select
    return itemsInPage.value;
  }
  // multi select
  if (multipleSelectStatus.value === 'allSelected') {
    return itemsInPage.value.map((item) => ({ checkbox: true, ...item }));
  } if (multipleSelectStatus.value === 'noneSelected') {
    return itemsInPage.value.map((item) => ({ checkbox: false, ...item }));
  }
  return itemsInPage.value.map((item) => {
    const isSelected = selectItemsComputed.value.findIndex((selectItem) => JSON.stringify(selectItem) === JSON.stringify(item)) !== -1;
    return { checkbox: isSelected, ...item };
  });
});

const toggleSelectAll = (isChecked: boolean): void => {
  selectItemsComputed.value = isChecked ? items.value : [];
};

const toggleSelectItem = (item: Item):void => {
  const isAlreadyChecked = item.checkbox;
  delete item.checkbox;
  if (!isAlreadyChecked) {
    const selectItems: Item[] = selectItemsComputed.value;
    selectItems.unshift(item);
    selectItemsComputed.value = selectItems;
  } else {
    selectItemsComputed.value = selectItemsComputed.value.filter((selectedItem) => JSON.stringify(selectedItem) !== JSON.stringify(item));
  }
};

// header
const headersComputed = computed((): Header[] => selectItemsComputed.value !== null ? [{ text: 'checkbox', value: 'checkbox' }, ...headers.value] : headers.value);

const headerComputedColumns = computed((): string[] => headersComputed.value.map((header) => header.value));

// table footer
// pageNumber
const pageNumber = ref(1);

// rowsPerPage
const rowsPerPage = ref(25);

// number of items
const itemsNumber = computed((): Number => searchItems.value.length);

const paginationEnd = computed((): number => Math.min(searchItems.value.length, pageNumber.value * rowsPerPage.value));

const paginationStart = computed((): number => pageNumber.value * rowsPerPage.value - rowsPerPage.value + 1);

const maxPageNumber = computed((): number => Math.ceil(items.value.length / rowsPerPage.value));

const isLastPage = computed((): boolean => pageNumber.value === maxPageNumber.value);

const isFirstPage = computed((): boolean => pageNumber.value === 1);

const nextPage = () => {
  if (isLastPage.value) return;
  pageNumber.value += 1;
};

const prevPage = () => {
  if (isFirstPage.value) return;
  pageNumber.value -= 1;
};

</script>

<style lang="scss" scoped>
  .data-table {
    box-sizing: border-box;
    .data-table__body {
      box-sizing: border-box;
      width: 100%;
      overflow-x: auto;
      overflow-y: auto;

      &.fixed-header {
        th {
          position: sticky;
          top: 0;
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

  .data-table__body:deep() {
    max-height: v-bind(tableMaxHeight);
    border: thin solid rgba(0,0,0,.12);
    overflow: scroll;
    position: relative;
    table {
      width: 100%;
      background-color: #fff;
      border-spacing: 0;
      tr {
        height: v-bind(trHeight);
        &.empty-wrapper {
          color: rgba(0,0,0,.38);
          width: 100%;
          td {
            text-align: center;
          }
        }
      }
      th, td {
        text-align: left;
        padding: 0px 16px;
      }
      thead, tbody {
        position: relative;
      }
      thead {
        z-index: 1;
        th {
          border-bottom: thin solid rgba(0,0,0,.12);
          font-size: v-bind(headerFontSizePx);
          color: v-bind(headerFontColor);
          position: relative;
          background-color: #f8f8f8;
        }
      }
      tbody {
        tr {
          cursor: pointer;
          &:hover {
            background-color: #eee;
          }
          &:last-child {
            border-bottom: none;
            td {
              border-bottom: none;
            }
          }
        }
        td {
          color: v-bind(bodyFontColor);
          font-size: v-bind(bodyFontSizePx);
          border-bottom: thin solid rgba(0,0,0,.12);
        }
      }
    }
    .data-table__message {
      text-align: center;
      color: v-bind(bodyFontColor);
      font-size: v-bind(bodyFontSizePx);
      padding: 20px;
    }
    .gms_base_dialog__loading {
      display: block;
      width: 50px;
      margin: 0 auto;
    }
  }

  .data-table__footer {
    width: 100%;
    display: flex;
    border: thin solid rgba(0,0,0,.12);
    border-top: none;
    font-size: 12px;
    align-items: center;
    justify-content: right;
    padding: 10px 5px;
    box-sizing: border-box;
  }
  .footer__rows-per-page {
    display: flex;
    align-items: center;
  }
  .footer__pagination {
    margin: 0px 20px 0px 10px;
  }
  .footer__previous, .footer__next {
    margin-right: 5px;
    cursor: pointer;
    .arrow {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-top: 2px solid #000;
      border-left: 2px solid #000;
      &.arrow-left {
        transform: rotate(135deg);
      }
      &.arrow-right {
        transform: rotate(-45deg);
      }
    }
  }
  .footer__previous.firstPage, .footer__next.lastPage {
    cursor: not-allowed;
    .arrow {
      border-color: grey;
    }
  }
</style>
