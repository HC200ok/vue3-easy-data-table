<template>
  <div class="gms-table">
    <div
      ref="wrapper"
      class="gms-table__wrapper"
      :class="{'fixed-header': fixedHeader, 'wrap-lines': wrapLines }"
    >
      <table>
        <thead v-if="headersComputed.length">
          <tr>
            <th
              v-for="(header, index) in headersComputed"
              :key="index"
            >
              <GmsCheckbox
                v-if="header.text === 'checkbox'"
                :key="multipleSelectStatus === 'allSelected'"
                :checked="multipleSelectStatus === 'allSelected'"
                @change="toggleSelectAll"
                class="table__checkbox"
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
              v-for="(item, index) in itemsForDisplay"
              :key="JSON.stringify(item)"
              @click="clickItem(item)"
            >
              <td
                v-for="(column, i) in headerComputedColumns"
                :key="i"
              >
                <template v-if="column === 'checkbox'">
                  <GmsCheckbox
                    @click.stop="toggleSelectItem(item)"
                    :checked="item[column]"
                    class="table__checkbox"
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
        class="gms-table__message"
      >
        {{ emptyMessage }}
      </div>
    </div>
    <div class="gms-table__footer">
      <div class="footer-rows__per-page">
        Rows per page: 
        <GmsSelect
          class="table__rows-selector"
          toggle
          quick
          :items="rowPerPageSelectValues"
          :defaults="[rowsPerPage]"
          @change="changeRowPerPage($event[0])"
        />
      </div>
      <div class="footer-pagination">
        {{`${paginationStart}-${paginationEnd}`}} of {{itemsNumber}}
      </div>
      <div 
        class="footer-previous"
        :class="{'firstPage': isFirstPage}"
        @click="prevPage">
        <GmsIcon
          height="30px"
          weight="30px"
          :icon="mdiMenuLeft"
          :color="isFirstPage ? 'grey' : 'black'"
        />
      </div>
      <div 
        class="footer-next"
        :class="{'lastPage': isLastPage}"
        @click="nextPage">
        <GmsIcon
          height="30px"
          weight="30px"
          :icon="mdiMenuRight"
          :color="isLastPage ? 'grey' : 'black'"
        />
      </div>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import {useSlots, computed, toRefs, PropType, ref } from 'vue';
import {mdiMenuRight, mdiMenuLeft} from '@mdi/js';

type Header = {
  text: string,
  value: string,
}

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
    default: true,
  },
  selectItems: {
    type:  Array as PropType<Item[]> | null,
    default: null,
  },
  search: {
    type: String,
    default: '',
  }
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
const emits = defineEmits(['clickItem', 'update:selectItems','update:isAllSelected']);

// click item
const clickItem = (item: Record<string, string | number>) => {
  emits('clickItem', item);
}

// header
const headersComputed = computed((): Header[] => {
  return selectItemsComputed.value !== null ? [{text: 'checkbox', value: 'checkbox'}, ...headers.value] : headers.value;
})

const headerComputedColumns = computed((): string[] => headersComputed.value.map(header => header.value));

// table footer
// pageNumber
const pageNumber = ref(1);

// rowsPerPage
const rowsPerPage = ref(25);
const rowPerPageSelectValues = [
  {name: '25', value: 25},
  {name: '50', value: 50},
  {name: '100', value: 100},
]

const changeRowPerPage = (val: number) => {
  rowsPerPage.value = val;
}

// number of items
const itemsNumber = computed((): Number => {
  return searchItems.value.length;
})

const paginationEnd = computed((): number => {
  return Math.min(searchItems.value.length, pageNumber.value * rowsPerPage.value)
})

const paginationStart = computed((): number => {
  return pageNumber.value * rowsPerPage.value - rowsPerPage.value + 1;
})

const maxPageNumber = computed((): number => {
  return Math.ceil(items.value.length / rowsPerPage.value);
});

const isLastPage = computed((): boolean => {
  return pageNumber.value === maxPageNumber.value;
});

const isFirstPage = computed((): boolean => {
  return pageNumber.value === 1;
});

const nextPage = () => {
  if (isLastPage.value) return;
  pageNumber.value++;
}

const prevPage = () => {
  if (isFirstPage.value) return;
  pageNumber.value--;
}

// multi select
// selectedItems
const selectItemsComputed = computed({
  get: () => props.selectItems,
  set: (value) => {
    emits('update:selectItems', value)
  },
})

// search items
const searchItems = computed((): Item[] => {
  if (search.value !== '') {
    const regex = new RegExp(search.value, 'i');
    return items.value.filter(item => regex.test(Object.values(item).join('')));
  } else {
    return items.value;
  }
})

// items in page
const itemsInPage = computed((): Item[] => {
  const itemsInPage: Item[] = [];
  for (let i = paginationStart.value - 1; i < paginationEnd.value; i++) {
    itemsInPage.push(searchItems.value[i])
  }
  return itemsInPage;
})

// itemsForDisplay
const itemsForDisplay = computed((): Item[] => {
  if (selectItemsComputed.value === null) {
    // no multi select
    return itemsInPage.value;
  } else {
    // multi select
    if (multipleSelectStatus.value === 'allSelected') {
      return itemsInPage.value.map(item => ({ checkbox: true, ...item}));
    } else if (multipleSelectStatus.value === 'noneSelected') {
      return itemsInPage.value.map(item => ({ checkbox: false, ...item}));
    } else {
      return itemsInPage.value.map(item => {
        const isSelected = selectItemsComputed.value.findIndex(selectItem =>
          JSON.stringify(selectItem) === JSON.stringify(item)) !== -1;
        return { checkbox: isSelected, ...item};
      });
    }
  }
})

const multipleSelectStatus = computed((): 'allSelected' | 'noneSelected' | 'partSelected' => {
  if (selectItemsComputed.value.length === items.value.length) {
    return 'allSelected';
  } else if (selectItemsComputed.value.length === 0) {
    return 'noneSelected';
  } else {
    return 'partSelected';
  }
})

const toggleSelectAll = (isChecked: boolean): void => {
  selectItemsComputed.value = isChecked ? items.value : [];
}

const toggleSelectItem = (item: Item):void => {
  const isAlreadyChecked = item.checkbox;
  delete item.checkbox;
  if (!isAlreadyChecked) {
    const selectItems: Item[] = selectItemsComputed.value;
    selectItems.unshift(item);
    selectItemsComputed.value = selectItems;
  } else {
    selectItemsComputed.value = selectItemsComputed.value.filter(selectedItem => {
      return JSON.stringify(selectedItem) !== JSON.stringify(item);
    })
  }
}
</script>

<style lang="scss" scoped>
  .gms-table__wrapper {
    width: 100%;
    overflow-x: auto;
    overflow-y: auto;
  }
  .gms-table__wrapper.fixed-header {
    th {
      position: sticky;
      top: 0;
    }
  }
  .gms-table__wrapper.wrap-lines {
    table {
      table-layout: fixed;
      word-break: break-all;
    }
  }
  .gms-table__wrapper:deep() {
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
      thead th{
        border-bottom: thin solid rgba(0,0,0,.12);
        font-size: v-bind(headerFontSizePx);
        color: v-bind(headerFontColor);
        position: relative;
        background-color: #f8f8f8;
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
    .gms-table__message {
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

  .gms-table__footer {
    width: 100%;
    display: flex;
    border: thin solid rgba(0,0,0,.12);
    border-top: none;
    font-size: 12px;
    align-items: center;
    justify-content: right;
  }
  .footer-rows__per-page {
    margin-right: 10px;
    display: flex;
    align-items: center;
  }
  .footer-pagination {
    margin-right: 10px;
  }
  .footer-previous, .footer-next {
    cursor: pointer;
  }
  .footer-previous.firstPage {
    cursor: not-allowed;
  }
  .footer-next.lastPage {
    cursor: not-allowed;
  }
</style>

<style>
.table__rows-selector .gms_select__box {
  border: none;
}
</style>


