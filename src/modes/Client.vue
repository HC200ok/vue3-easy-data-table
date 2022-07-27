<template>
  <div>
    <DataTable
      ref="dataTable"
      v-model:items-selected="itemsSelected"
      alternating
      border-cell
      no-hover
      show-index
      :headers="headers"
      :items="items"
      :search-field="searchField"
      :search-value="searchValue"
      :rows-per-page="10"
      buttons-pagination
      sort-by="age"
      sort-type="desc"
      theme-color="#1d90ff"
      table-class-name="hc-table"
      header-class-name="hc-header"
      :body-row-class-name="bodyRowClassNameFunction"
      :header-item-class-name="headerItemClassNameFunction"
      :body-item-class-name="bodyItemClassNameFunction"
      must-sort
      @click-row="showItem"
      :table-height="30"
    >
      <template #expand="item">
        <div style="padding: 15px">
          {{ item.name }} won championships
        </div>
      </template>

      <template #header-name="header">
        <div class="filter-column">
          <span
            class="filter-icon"
            @click.stop="showNameFilter=!showNameFilter"
          >
            icon
          </span>
          {{ header.text }}
          <div
            v-if="showNameFilter"
            class="filter-menu filter-age-menu"
          >
            <input v-model="nameCriteria">
          </div>
        </div>
      </template>
    </DataTable>

    <div class="customize-footer">
      <div class="customize-index">
        Now displaying: {{ currentPageFirstIndex }} ~ {{ currentPageLastIndex }} of {{ totalItemsLength }}
      </div>
      <div class="customize-buttons">
        <span
          v-for="paginationNumber in maxPaginationNumber"
          class="customize-button"
          :class="{'active': paginationNumber === currentPaginationNumber}"
          @click="updatePage(paginationNumber)"
        >
          {{ paginationNumber }}
        </span>
      </div>
      <div class="customize-pagination">
        <button
          class="prev-page"
          :disabled="isFirstPage"
          @click="prevPage"
        >
          prev page
        </button>
        <button
          class="next-page"
          :disabled="isLastPage"
          @click="nextPage"
        >
          next page
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  computed, ref, reactive, toRefs,
} from 'vue';
import {
  Header, Item, FilterOption, clickRowArgument, HeaderItemClassNameFunction, BodyItemClassNameFunction, BodyRowClassNameFunction,
} from '../types/main';
import DataTable from '../components/DataTable.vue';
import { mockClientNestedItems, mockClientItems, mockDuplicateClientNestedItems } from '../mock';

const searchField = ref('name');
const searchValue = ref('');

const items = ref<Item[]>(mockDuplicateClientNestedItems(100));

const switchToNested300 = () => {
  items.value = mockClientNestedItems(300);
};

const switchToNested = () => {
  items.value = mockClientNestedItems(100);
};

const headers: Header[] = [
  { text: 'Name', value: 'name' },
  {
    text: 'Address', value: 'address', width: 200, fixed: true,
  },
  { text: 'Height', value: 'info.out.height', sortable: true },
  { text: 'Weight', value: 'info.out.weight', sortable: true },
  {
    text: 'Age', value: 'age', sortable: true, width: 200,
  },
  { text: 'Favourite sport', value: 'favouriteSport', width: 200 },
  { text: 'Favourite fruits', value: 'favouriteFruits', width: 200 },
];

// const headers: Header[] = [
//   { text: 'Name', value: 'name'},
//   { text: 'Address', value: 'address'},
//   { text: 'Height', value: 'info.out.height', sortable: true},
//   { text: 'Weight', value: 'info.out.weight', sortable: true },
//   { text: 'Age', value: 'age', sortable: true },
//   { text: 'Favourite sport', value: 'favouriteSport'},
//   { text: 'Favourite fruits', value: 'favouriteFruits'},
// ];

const itemsSelected = ref<Item[]>([items.value[14]]);

const showItem = (item: clickRowArgument) => {
  console.log('item');
  console.log(JSON.stringify(item));
};
// filtering

const ageCriteria = ref<[number, number]>([1, 15]);

const favouriteSportCriteria = ref('all');

const showNameFilter = ref(false);
const nameCriteria = ref('');

// const filterOptions = computed((): FilterOption[] => {
//   const filterOptionsArray: FilterOption[] = [];
//   if (favouriteSportCriteria.value !== 'all') {
//     filterOptionsArray.push({
//       field: 'favouriteSport',
//       comparison: '=',
//       criteria: favouriteSportCriteria.value,
//     });
//   }
//   filterOptionsArray.push({
//     field: 'age',
//     comparison: 'between',
//     criteria: ageCriteria.value,
//   });
//   filterOptionsArray.push({
//     field: 'name',
//     criteria: nameCriteria.value,
//     comparison: (value, criteria): boolean => (value != null
//       && value.includes(`name-${criteria}`)),
//   });
//   return filterOptionsArray;
// });
const bodyRowClassNameFunction: BodyRowClassNameFunction = (item: Item, index: number): string => (index === 0 ? 'first-row test-row' : '');
const headerItemClassNameFunction: HeaderItemClassNameFunction = (header: Header, index: number): string => (header.value === 'name' ? 'name-header' : '');
const bodyItemClassNameFunction: BodyItemClassNameFunction = (column: string, index: number): string => (column === 'name' ? 'name-item' : '');
// $ref dataTable
const dataTable = ref();
console.log('dataTable');
console.log(dataTable);
console.log(dataTable.value);
console.log(typeof dataTable);

// index related
const currentPageFirstIndex = computed(() => dataTable.value?.currentPageFirstIndex);
const currentPageLastIndex = computed(() => dataTable.value?.currentPageLastIndex);
const totalItemsLength = computed(() => dataTable.value?.totalItemsLength);

// paginations related
const maxPaginationNumber = computed(() => dataTable.value?.maxPaginationNumber);
const currentPaginationNumber = computed(() => dataTable.value?.currentPaginationNumber);

const isFirstPage = computed(() => dataTable.value?.isFirstPage);
const isLastPage = computed(() => dataTable.value?.isLastPage);

const nextPage = () => {
  dataTable.value.nextPage();
};
const prevPage = () => {
  dataTable.value.prevPage();
};
const updatePage = (paginationNumber: number) => {
  dataTable.value.updatePage(paginationNumber);
};
</script>

<style scoped>
.customize-footer {
  margin: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.customize-footer div {
  margin: 5px;
}
.customize-button {
  display: inline-block;
  width: 20px;
  height: 20px;
  text-align: center;
  border-radius: 100%;
  cursor: pointer;
  padding: 3px;
  line-height: 20px;
}
.customize-button.active {
  color: #fff;
  background-color: #3db07f;
}
.customize-pagination button {
  margin: 0 5px;
  cursor: pointer;
}
.filter-wrapper {
  display: flex;
  align-items: center;
}
.slider {
  flex-grow: 1;
}
</style>

<style>
.hc-table {
  --easy-table-border: 1px solid #445269;
  --easy-table-row-border: 1px solid #445269;

  --easy-table-header-font-size: 12px;
  --easy-table-header-height: 80px;
  --easy-table-header-font-color: #c1cad4;
  --easy-table-header-background-color: #2d3a4f;

  --easy-table-header-item-padding: 10px 15px;

  --easy-table-body-even-row-font-color: #fff;
  --easy-table-body-even-row-background-color: #4c5d7a;

  --easy-table-body-row-font-color: #c0c7d2;
  --easy-table-body-row-background-color: #2d3a4f;
  --easy-table-body-row-height: 40px;
  --easy-table-body-row-font-size: 14px;

  --easy-table-body-row-hover-font-color: #2d3a4f;
  --easy-table-body-row-hover-background-color: #eee;

  --easy-table-body-item-padding: 10px 15px;

  --easy-table-footer-background-color: #2d3a4f;
  --easy-table-footer-font-color: #c0c7d2;
  --easy-table-footer-font-size: 14px;
  --easy-table-footer-padding: 0px 10px;
  --easy-table-footer-height: 40px;

  --easy-table-scrollbar-track-color: #4c5d7a;
  --easy-table-scrollbar-color: #4c5d7a;
  --easy-table-scrollbar-corner-color: #4c5d7a;
  --easy-table-scrollbar-thumb-color: #2d3a4f;

  --easy-table-loading-mask-background-color: #2d3a4f;
}

</style>
