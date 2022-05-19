<template>
  <div class="data-table">
    <div
      class="data-table__body"
      :class="{'fixed-header': fixedHeader, 'wrap-lines': wrapLines }"
    >
      <table>
        <thead v-if="headersWithCheckbox.length">
          <tr>
            <th
              v-for="(header, index) in headersWithCheckbox"
              :key="index"
              :class="{
                sortable: header.sortable,
                'none': header.sortable && header.sorting === 'none',
                'desc': header.sortable && header.sorting === 'desc',
                'asc': header.sortable && header.sorting === 'asc',
              }"
              @click="header.sortable ? updateSortField(header.value) : null"
            >
              <MutipleSelectCheckBox
                v-if="header.text === 'checkbox'"
                :key="multipleSelectStatus"
                :status="multipleSelectStatus"
                @change="toggleSelectAll"
              />
              <span
                v-else
                class="header-text">
                {{ header.text }}
                <span
                  v-if="header.sortable"
                  :key="header.sorting"
                  class="sorting-icon"
                  :class="{'desc': header.sorting === 'desc'}">
                  <ArrowIcon
                    class="sorting-icon__svg"
                  />
                </span>
              </span>
            </th>
          </tr>
        </thead>
        <slot
          v-if="ifHasBodySlot"
          name="body"
        />
        <template v-else>
          <tbody v-if="items.length && headerColumns.length">
            <tr
              v-for="(item) in itemsWithCheckbox"
              :key="JSON.stringify(item)"
              @click="clickItem(item)"
            >
              <td
                v-for="(column, i) in headerColumns"
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
      <div class="footer__items-index">
        {{ `${firstIndexOfItemsInCurrentPage}-${lastIndexOfItemsInCurrentPage}` }}
        of {{ numberOfItems }}
      </div>
      <div
        class="footer__previous-page-click-button"
        :class="{'first-page': isFirstPage}"
        @click="prevPage"
      >
        <span class="arrow arrow-right"></span>
      </div>
      <div
        class="footer__next-page-click-button"
        :class="{'last-page': isLastPage}"
        @click="nextPage"
      >
        <span class="arrow arrow-left"></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  useSlots, computed, toRefs, PropType, ref, watch,
} from 'vue';
import MutipleSelectCheckBox from './MutipleSelectCheckBox.vue';
import SingleSelectCheckBox from './SingleSelectCheckBox.vue';
import RowsSelector from './RowsSelector.vue';

import type { Header, Item } from '@/types/table';
import ArrowIcon from '@/assets/long-arrow-up.svg'

type HeaderComputed = {
  text: string,
  value: string,
  sortable?: boolean,
  sorting?: 'none' | 'asc' | 'desc',
}

type SortCondition = {
  fieldName: string,
  type: 'asc' | 'desc',
}

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
  items,
  search,
  rowsItems,
  selectItems,
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

const isMutipleSelectable = computed((): boolean => selectItems.value !== null);

// table header
const initHeaders = (): HeaderComputed[] => {
  headers.value.map((header) => {
    const headerWithSorting = header;
    if (header.sortable) headerWithSorting.sorting = 'none';
    return headerWithSorting;
  });
  return isMutipleSelectable.value
    ? [{ text: 'checkbox', value: 'checkbox' }, ...headers.value] : headers.value;
};
const headersWithCheckbox = ref(initHeaders());

const headerColumns = computed((): string[] => headersWithCheckbox.value.map((header) => header.value));

// multiple select
const selectItemsComputed = computed({
  get: () => selectItems.value,
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

// items searching
const itemsSearching = computed((): Item[] => {
  if (search.value !== '') {
    const regex = new RegExp(search.value, 'i');
    return items.value.filter((item) => regex.test(Object.values(item).join('')));
  }
  return items.value;
});

const sortCondition = ref<SortCondition | null>(null);

const updateSortField = (fieldName: string) => {
  console.log("fieldName");
  console.log(fieldName);
  let newSortingType: 'none' | 'asc' | 'desc' = 'none';
  // update headers sorting
  headersWithCheckbox.value.map((item) => {
    const itemSortingUpdated = item;
    if (item.sortable) {
      if (item.value === fieldName) {
        if (item.sorting === 'none') {
          newSortingType = 'asc';
        } else if (item.sorting === 'asc') {
          newSortingType = 'desc';
        } else {
          newSortingType = 'none';
        }
        itemSortingUpdated.sorting = newSortingType;
      } else {
        itemSortingUpdated.sorting = 'none';
      }
    }
    return itemSortingUpdated;
  });

  // update sort condition
  if (newSortingType === 'none') {
    sortCondition.value = null;
  } else {
    sortCondition.value = {
      fieldName,
      type: newSortingType,
    };
  }
};

// items sorting
const itemsSorting = computed((): Item[] => {
  if (sortCondition.value === null) return itemsSearching.value;
  const { fieldName, type } = sortCondition.value;
  const itemsSearchingSorted = [...itemsSearching.value];
  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  return itemsSearchingSorted.sort((a, b) => {
    if (a[fieldName] < b[fieldName]) return type === 'asc' ? -1 : 1;
    if (a[fieldName] > b[fieldName]) return type === 'asc' ? 1 : -1;
    return 0;
  });
});

// index info of items in current page.
const currentPaginationNumber = ref(1);
const numberOfItems = computed((): Number => itemsSearching.value.length);

// rows rer page.
const rowsPerPage = ref(rowsItems.value[0]);
watch(rowsPerPage, () => {
  currentPaginationNumber.value = 1;
});

const lastIndexOfItemsInCurrentPage = computed((): number => Math.min(
  itemsSearching.value.length,
  currentPaginationNumber.value * rowsPerPage.value,
));

const firstIndexOfItemsInCurrentPage = computed((): number => (currentPaginationNumber.value - 1) * rowsPerPage.value + 1);

// page up, page down
const maxPaginationNumber = computed((): number => Math.ceil(itemsSearching.value.length / rowsPerPage.value));
const isLastPage = computed((): boolean => currentPaginationNumber.value === maxPaginationNumber.value);
const isFirstPage = computed((): boolean => currentPaginationNumber.value === 1);

const nextPage = () => {
  if (isLastPage.value) return;
  currentPaginationNumber.value += 1;
};

const prevPage = () => {
  if (isFirstPage.value) return;
  currentPaginationNumber.value -= 1;
};

// items in current page
const itemsInPage = computed((): Item[] => {
  const res: Item[] = [];
  for (let i = firstIndexOfItemsInCurrentPage.value - 1;
    i < lastIndexOfItemsInCurrentPage.value; i += 1) {
    res.push(itemsSorting.value[i]);
  }
  return res;
});

// items with checkbox
const itemsWithCheckbox = computed((): Item[] => {
  if (!isMutipleSelectable.value) return itemsInPage.value;
  // multi select
  if (multipleSelectStatus.value === 'allSelected') {
    return itemsInPage.value.map((item) => ({ checkbox: true, ...item }));
  } if (multipleSelectStatus.value === 'noneSelected') {
    return itemsInPage.value.map((item) => ({ checkbox: false, ...item }));
  }
  return itemsInPage.value.map((item) => {
    const isSelected = selectItemsComputed.value.findIndex((selectItem) => JSON.stringify(selectItem)
      === JSON.stringify(item)) !== -1;
    return { checkbox: isSelected, ...item };
  });
});

const toggleSelectAll = (isChecked: boolean): void => {
  selectItemsComputed.value = isChecked ? items.value : [];
};

const toggleSelectItem = (item: Item):void => {
  const isAlreadyChecked = item.checkbox;
  // eslint-disable-next-line no-param-reassign
  delete item.checkbox;
  if (!isAlreadyChecked) {
    const selectItemsArr: Item[] = selectItemsComputed.value;
    selectItemsArr.unshift(item);
    selectItemsComputed.value = selectItemsArr;
  } else {
    selectItemsComputed.value = selectItemsComputed.value.filter((selectedItem) => JSON.stringify(selectedItem)
      !== JSON.stringify(item));
  }
};

// event of click item
const clickItem = (item: Item) => {
  emits('clickItem', item);
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
        padding: 0px 10px;
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
          .header-text {
            display: flex;
            align-items: center;
            height: v-bind(headerFontSizePx);
          }

          &.sortable {
            cursor: pointer;
            &.none {
               &:hover {
                .sorting-icon {
                  opacity: 1;
                }
              }
              .sorting-icon {
                opacity: 0;
                transition: opacity 0.5s ease;

                &__svg {
                  path {
                    fill: rgb(158 158 158);
                  }
                }
              }
            }

            &.desc {
              path {
                fill: v-bind(headerFontColor);
              }
            }
          }

          .sorting-icon {
            display: inline-block;
            width: v-bind(headerFontSizePx);
            height: v-bind(headerFontSizePx);
            &__svg {
              width: v-bind(headerFontSizePx);
              height: v-bind(headerFontSizePx);
            }
            &.desc {
              transform: rotate(180deg);
            }
          }
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

    .footer__rows-per-page {
      display: flex;
      align-items: center;
    }
    .footer__items-index {
      margin: 0px 20px 0px 10px;
    }
    .footer__previous-page-click-button, .footer__next-page-click-button {
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
    .footer__previous-page-click-button.first-page, .footer__next-page-click-button.last-page {
      cursor: not-allowed;
      .arrow {
        border-color: #e0e0e0;
      }
    }
  }

</style>
