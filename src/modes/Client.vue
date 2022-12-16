<template>
  <span>search field:</span>
  <!-- <select v-model="searchField">
      <option>name</option>
      <option>indicator.weight</option>
    </select> -->

  <br />
  <span>search value: </span>
  <input
    v-model="searchValue"
    type="text"
  >
  <div>
    <DataTable
      ref="dataTable"
      v-model:items-selected="itemsSelected"
      click-row-to-expand
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
      :sort-by="sortBy"
      :sort-type="sortType"
      theme-color="#1d90ff"
      table-class-name="hc-table"
      header-class-name="hc-header"
      :body-row-class-name="bodyRowClassNameFunction"
      :header-item-class-name="headerItemClassNameFunction"
      :body-item-class-name="bodyItemClassNameFunction"
      :body-expand-row-class-name="bodyExpandRowClassNameFunction"
      multi-sort
      body-text-direction="left"
      header-text-direction="left"
      :filter-options="filterOptions"
      click-event-type="double"
      @update-sort="updateSort"
      @update-filter="updateFilter"
      @select-row="showItem"
      @deselect-row="deselectRow"
    >
      <template #expand="item">
        <tr v-for="(child, index) in item.children" :key="index">
          <td></td>
          <td></td>
          <td></td>
          <td>{{ child.name }}</td>
          <td>{{ child.number }}</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
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

      <template #item-lastAttended="item">
        <div style="padding: 15px">
          {{ item.lastAttended }} camelCase
        </div>
      </template>

      <template #item-player="item">
        <div style="padding: 15px">
          {{ item.player }} player
        </div>
      </template>

      <template #body.append>
        <span>body.append</span>
      </template>
    </DataTable>
  </div>
</template>

<script lang="ts" setup>
import {
  computed, ref, reactive, toRefs,
} from 'vue';
// import { useRowsPerPage } from 'use-vue3-easy-data-table';
// import type { UseRowsPerPageReturn } from 'use-vue3-easy-data-table';
import type {
  Header, Item, FilterOption, ClickRowArgument, UpdateSortArgument, HeaderItemClassNameFunction, BodyItemClassNameFunction, BodyRowClassNameFunction,
  TextDirection,
} from '../types/main';
import DataTable from '../components/DataTable.vue';
import {
  mockClientNestedItems, mockClientItems, mockDuplicateClientNestedItems, headersMocked,
} from '../mock';

const searchField = ref('indicator.weight');
const searchValue = ref('');
const sortBy = ref(['indicator.weight', 'number']);
const sortType = ref<SortType | SortType[] | undefined>(['desc', 'asc']);
const switchToNested300 = () => {
  items.value = mockClientNestedItems(300);
};

const switchToNested = () => {
  items.value = mockClientNestedItems(100);
};
const headers: Header[] = [
  { text: 'Name', value: 'name' },
  { text: 'TEAM', value: 'team' },
  {
    text: 'NUMBER', value: 'number', sortable: true, formatFn: (item: any) => `${item} - Format Test`,
  },
  { text: 'POSITION', value: 'position' },
  { text: 'HEIGHT', value: 'indicator.height' },
  { text: 'WEIGHT (lbs)', value: 'indicator.weight', sortable: true },
  { text: 'LAST ATTENDED', value: 'lastAttended', width: 200 },
  { text: 'COUNTRY', value: 'country' },
];

// const headers: Header[] = headersMocked;

const updateFilter = (items: Item[]) => {
  console.log('filter items');
  console.log(JSON.stringify(items));
};

const items = ref<Item[]>([
  {
    name: 'Stephen Curry',
    firstName: 'GSW',
    number: 30,
    position: 'G',
    indicator: { height: '6-2', weight: 185 },
    lastAttended: 'Davidson',
    country: 'USA',
    children: [
      {
        name: 'Test',
        number: 15,
        position: 'G',
      }],
  },
  {
    name: 'Kevin Durant',
    firstName: 'BKN',
    number: 7,
    position: 'F',
    indicator: { height: '6-10', weight: 240 },
    lastAttended: 'Texas-Austin',
    country: 'USA',
  },
  {
    name: 'Lebron James',
    firstName: 'LAL',
    number: 7,
    position: 'F',
    indicator: { height: '6-9', weight: 185 },
    lastAttended: 'St. Vincent-St. Mary HS (OH)',
    country: 'USA',
  },
]);

// const items = ref<Item[]>(mockClientItems());

// const headers: Header[] = [
//   { text: 'Name', value: 'name'},
//   { text: 'Address', value: 'address'},
//   { text: 'Height', value: 'info.out.height', sortable: true},
//   { text: 'Weight', value: 'info.out.weight', sortable: true },
//   { text: 'Age', value: 'age', sortable: true },
//   { text: 'Favourite sport', value: 'favouriteSport'},
//   { text: 'Favourite fruits', value: 'favouriteFruits'},
// ];

const itemsSelected = ref<Item[]>([items.value[1]]);

const showItem = (item: ClickRowArgument) => {
  console.log('item 111');
  console.log(JSON.stringify(item));
};

const deselectRow = (item: ClickRowArgument) => {
  console.log('deselectRow');
  console.log(JSON.stringify(item));
};

const updateSort = (sortOption: UpdateSortArgument) => {
  console.log(sortOption);
};
// filtering

const ageCriteria = ref<[number, number]>([1, 15]);

const favouriteSportCriteria = ref('all');

const showNameFilter = ref(false);
const nameCriteria = ref('');

const filterOptions = computed((): FilterOption[] => {
  const filterOptionsArray: FilterOption[] = [];
  filterOptionsArray.push({
    field: 'name',
    criteria: nameCriteria.value,
    comparison: (value, criteria): boolean => (value != null
            && value.includes(criteria)),
  });
  return filterOptionsArray;
});

const bodyRowClassNameFunction: BodyRowClassNameFunction = (item: Item, index: number): string => (index === 0 ? 'first-row test-row' : '');
const bodyExpandRowClassNameFunction: BodyRowClassNameFunction = (item: Item, index: number): string => 'expand-row';

const headerItemClassNameFunction: HeaderItemClassNameFunction = (header: Header, index: number): string => (header.value === 'name' ? 'name-header' : '');
const bodyItemClassNameFunction: BodyItemClassNameFunction = (column: string, index: number): string => (column === 'name' ? 'name-item' : '');
// $ref dataTable
const dataTable = ref();

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
const isDataHeader = (header: Header) => !(header.value === 'checkbox' || header.value === 'index' || header.value === 'expand');

// rows per page
const rowsPerPageOptions = computed(() => dataTable.value?.rowsPerPageOptions);
const rowsPerPageActiveOption = computed(() => dataTable.value?.rowsPerPageActiveOption);

const updateRowsPerPageSelect = (e: Event) => {
  dataTable.value.updateRowsPerPageActiveOption(Number((e.target as HTMLInputElement).value));
};

// const {
//   rowsPerPageOptions,
//   rowsPerPageActiveOption,
//   updateRowsPerPageActiveOption,
// }: UseRowsPerPageReturn = useRowsPerPage(dataTable);

// const updateRowsPerPageSelect = (e: Event) => {
//   updateRowsPerPageActiveOption(Number((e.target as HTMLInputElement).value));
// };
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

    /* --easy-table-header-item-padding: 10px 15px; */

    --easy-table-body-even-row-font-color: #fff;
    --easy-table-body-even-row-background-color: #4c5d7a;

    --easy-table-body-row-font-color: #c0c7d2;
    --easy-table-body-row-background-color: #2d3a4f;
    --easy-table-body-row-height: 40px;
    --easy-table-body-row-font-size: 14px;

    --easy-table-body-row-hover-font-color: #2d3a4f;
    --easy-table-body-row-hover-background-color: #eee;

    /* --easy-table-body-item-padding: 10px 15px; */

    --easy-table-footer-background-color: #2d3a4f;
    --easy-table-footer-font-color: #c0c7d2;
    --easy-table-footer-font-size: 14px;
    --easy-table-footer-padding: 0px 10px;
    --easy-table-footer-height: 40px;

    --easy-table-rows-per-page-selector-width: 70px;
    --easy-table-rows-per-page-selector-option-padding: 10px;

    --easy-table-scrollbar-track-color: #4c5d7a;
    --easy-table-scrollbar-color: #4c5d7a;
    --easy-table-scrollbar-corner-color: #4c5d7a;
    --easy-table-scrollbar-thumb-color: #2d3a4f;

    --easy-table-loading-mask-background-color: #2d3a4f;
}

</style>
