<template>
  <div>
    <div class="filter-wrapper">
      <span class="field">
        filtering by age:
      </span>
      <Slider v-model="ageCriteria" class="slider"/>
    </div>
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
      v-model:items-selected="itemsSelected"
      :headers="headers"
      :items="items"
      :rows-per-page="10"
      show-index
      buttons-pagination
      alternating
      :max-height="200"
      :filter-options="filterOptions"
      sort-by="age"
      sort-type="desc"
    >
    </DataTable>

    <div class="customize-footer">
      <div class="customize-index">
        Now displaying: {{currentPageFirstIndex}} ~ {{currentPageLastIndex}} of {{totalItemsLength}}
      </div>
      <div class="customize-buttons">
        <span
          v-for="paginationNumber in maxPaginationNumber"
          class="customize-button"
          :class="{'active': paginationNumber === currentPaginationNumber}"
          @click="updatePage(paginationNumber)"
        >
          {{paginationNumber}}
        </span>
      </div>
      <div class="customize-pagination">
        <button class="prev-page" @click="prevPage" :disabled="isFirstPage">prev page</button>
        <button class="next-page" @click="nextPage" :disabled="isLastPage">next page</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Slider from '@vueform/slider';
import { computed, ref, reactive, toRefs } from 'vue';
import { Header, Item, FilterOption } from "../types/main";
import DataTable from '../components/DataTable.vue';
import { mockClientItems } from "../mock";

const searchField = ref("name");
const searchValue = ref("name-1");

const items = ref<Item[]>(mockClientItems(100));
const headers: Header[] = [
  { text: "Name", value: "name" },
  { text: "Address", value: "address" },
  { text: "Height", value: "height", sortable: true },
  { text: "Weight", value: "weight", sortable: true },
  { text: "Age", value: "age", sortable: true },
  { text: "Favourite sport", value: "favouriteSport" },
  { text: "Favourite fruits", value: "favouriteFruits" },
];

const itemsSelected = ref<Item[]>([items.value[14]]);

// filtering

const ageCriteria = ref<[number, number]>([1, 15]);

const favouriteSportCriteria = ref('basketball');

const filterOptions = computed((): FilterOption[] => {
  const filterOptionsArray: FilterOption[] = [];
  if (favouriteSportCriteria.value !== 'all') {
    filterOptionsArray.push({
      field: 'favouriteSport',
      comparison: '=',
      criteria: favouriteSportCriteria.value,
    });
  }
  filterOptionsArray.push({
    field: 'age',
    comparison: 'between',
    criteria: ageCriteria.value,
  });
  return filterOptionsArray;
});

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
