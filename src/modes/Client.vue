<template>
  <div>
    <!-- <div class="filter-wrapper">
      <span class="field">
        filtering by age:
      </span>
      <Slider v-model="ageCriteria" class="slider"/>
    </div> -->
    <button @click="switchToNested300">use nested 300</button>
    <button @click="switchToNested">use nested</button>
    <div class="filter-wrapper">
      <span class="field">
        filtering by sport:
      </span>
      <select
        v-model="favouriteSportCriteria"
        name="favouriteSport"
      >
        <option value="basketball">
          basketball
        </option>
        <option value="running">
          running
        </option>
        <option value="football">
          football
        </option>
        <option value="swimming">
          swimming
        </option>
        <option value="all">
          all
        </option>
      </select>
    </div>
    <!-- <span>search field:</span>
    <select v-model="searchField">
      <option>name</option>
      <option>address</option>
    </select><br />
    <span>search value: </span>
    <input type="text" v-model="searchValue" /> -->
    <DataTable
      ref="dataTable"
      :headers="headers"
      :items="items"
      :rows-per-page="10"
      buttons-pagination
      alternating
      sort-by="age"
      sort-type="desc"
      @click-row="showItem"
      v-model:items-selected="itemsSelected"
      table-border-color="#445269"
      row-border-color="#445269"
      header-background-color="#2d3a4f"
      header-font-color="#c1cad4"
      even-row-background-color="#4c5d7a"
      even-row-font-color="#fff"
      footer-background-color="#2d3a4f"
      footer-font-color="#c0c7d2"
      row-background-color="#2d3a4f"
      row-font-color="#c0c7d2"
      row-hover-background-color="#eee"
      row-hover-font-color="#2d3a4f"
      theme-color="#1d90ff"
    >
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
// import Slider from '@vueform/slider';
import {
  computed, ref, reactive, toRefs,
} from 'vue';
import {
  Header, Item, FilterOption, clickRowArgument,
} from '../types/main';
import DataTable from '../components/DataTable.vue';
import { mockClientNestedItems, mockClientItems } from '../mock';

const searchField = ref('name');
const searchValue = ref('name-1');

const items = ref<Item[]>(mockClientNestedItems(100));

const switchToNested300 = () => {
  items.value = mockClientNestedItems(300);
};

const switchToNested = () => {
  items.value = mockClientNestedItems(100);
};

const headers: Header[] = [
  { text: 'Name', value: 'name' },
  { text: 'Address', value: 'address', width: 200 },
  { text: 'Height', value: 'info.out.height', sortable: true },
  { text: 'Weight', value: 'info.out.weight', sortable: true },
  { text: 'Age', value: 'age', sortable: true, width: 200 },
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
  console.log(item);
};
// filtering

const ageCriteria = ref<[number, number]>([1, 15]);

const favouriteSportCriteria = ref('all');

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
//   return filterOptionsArray;
// });

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
</script>

<style src="@vueform/slider/themes/default.css"></style>

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
