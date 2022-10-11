/* eslint-disable max-len */
<template>
  <div>
    <DataTable
      ref="dataTable"
      v-model:items-selected="itemsSelected"
      v-model:server-options="serverOptions"
      :headers="headers"
      :items="items"
      :server-items-length="serverItemsLength"
      :loading="loading"
      show-index
      buttons-pagination
      fixed-checkbox
      fixed-index
      :index-column-width="40"
      alternating
      sort-by="age"
      sort-type="desc"
      search-field="address"
      search-value="address-1"
      :table-height="300"
      :body-row-class-name="bodyRowClassName"
      table-class-name="hc-table"
      theme-color="#1d90ff"
      border-cell
      multi-sort
      @update-sort="updateSort"
    >
      <template #expand="item">
        <div style="padding: 15px">
          {{ item.name }} won championships
        </div>
      </template>
      <template #address="{ address }">
        <a :href="address">{{ address }}</a>
      </template>
      <template #pagination="{ prevPage, nextPage, isFirstPage, isLastPage }">
        <button
          :disabled="isFirstPage"
          @click="prevPage"
        >
          prev page
        </button>
        <button
          :disabled="isLastPage"
          @click="nextPage"
        >
          next page
        </button>
      </template>
    </DataTable>
    <!-- <div class="customize-footer">
      <div class="customize-index">
        Now displaying: {{ currentPageFirstIndex }} ~
        {{ currentPageLastIndex }} of {{ serverItemsLength }}
      </div>
      <div class="customize-buttons">
        <span
          v-for="paginationNumber in maxPaginationNumber"
          :key="paginationNumber"
          class="customize-button"
          :class="{ active: paginationNumber === currentPaginationNumber }"
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
    </div> -->
  </div>
  <div>{{serverOptions}}</div>
</template>


<script lang="ts">
import {
  defineComponent, ref, computed, watch, onMounted, Ref,
} from 'vue';
import {
  Header, Item, ServerOptions, UpdateSortArgument, BodyItemClassNameFunction, BodyRowClassNameFunction, HeaderItemClassNameFunction,
} from '../types/main';
import DataTable from '../components/DataTable.vue';
import { mockClientItems, mockServerItems } from '../mock';

export default defineComponent({
  components: { DataTable },
  setup() {
    const bodyRowClassName: BodyRowClassNameFunction = (item: Item, index: number) => 'bg-white';

    // const headers: Header[] = [
    //   { text: 'Name', value: 'name', fixed: true, width: 200 },
    //   { text: 'Address', value: 'address', fixed: true, width: 200  },
    //   { text: 'Height', value: 'height', sortable: true, width: 200 },
    //   { text: 'Weight', value: 'weight', sortable: true, width: 200 },
    //   { text: 'Age', value: 'age', sortable: true, width: 200 },
    //   { text: 'Favourite sport', value: 'favouriteSport', width: 200 },
    //   { text: 'Favourite fruits', value: 'favouriteFruits', width: 200 },
    // ];
    const headers: Header[] = [
      { text: "PLAYER", value: "player" },
      { text: "firstName", value: "firstName"},
      { text: "NUMBER", value: "number", sortable: true},
      { text: "POSITION", value: "position"},
      { text: "HEIGHT", value: "indicator.height"},
      { text: "WEIGHT (lbs)", value: "indicator.weight", sortable: true},
      { text: "LAST ATTENDED", value: "lastAttended", width: 200},
      { text: "COUNTRY", value: "country"},
    ];
    const items = ref<Item[]>([]);
    const itemsSelected = ref<Item[]>([items.value[0]]);
    const serverItemsLength = ref(0);
    const serverOptions = ref<ServerOptions>({
      page: 1,
      rowsPerPage: 10,
      sortBy: ['indicator.weight', 'number'],
      sortType: ['desc', 'asc'],
    });

    const loading = ref(false);

    const loadFromServer = async () => {
      loading.value = true;
      const {
        serverCurrentPageItems,
        serverTotalItemsLength,
      } = await mockServerItems(serverOptions.value, 101);
      items.value = [
        { player: "Stephen Curry", firstName: "GSW", number: 30, position: 'G', indicator: {"height": '6-2', "weight": 185}, lastAttended: "Davidson", country: "USA"},
        { player: "Kevin Durant", firstName: "BKN", number: 7, position: 'F', indicator: {"height": '6-10', "weight": 240}, lastAttended: "Texas-Austin", country: "USA"},
        { player: "Lebron James", firstName: "LAL", number: 7, position: 'F', indicator: {"height": '6-9', "weight": 185}, lastAttended: "St. Vincent-St. Mary HS (OH)", country: "USA"},
        { player: "Giannis Antetokounmpo", firstName: "MIL", number: 34, position: 'F', indicator: {"height": '6-11', "weight": 242}, lastAttended: "Filathlitikos", country: "Greece"},
        { player: "HC", firstName: "MIL", number: 34, position: 'F', indicator: {"height": '6-11', "weight": 243}, lastAttended: "Filathlitikos", country: "Greece"},
      ];
      serverItemsLength.value = serverTotalItemsLength;
      loading.value = false;
    };

    // first load when created
    loadFromServer();

    watch(
      serverOptions,
      () => {
        console.log(111);
        loadFromServer();
      },
      { deep: true },
    );
    // $ref dataTable
    const dataTable = ref();
    // index related
    const currentPageFirstIndex = computed(() => dataTable.value?.currentPageFirstIndex);
    const currentPageLastIndex = computed(() => dataTable.value?.currentPageLastIndex);
    const clientItemsLength = computed(() => dataTable.value?.clientItemsLength);

    const updateSort = (sortOption: UpdateSortArgument) => {
      console.log(sortOption);
    };
    console.log('dataTable');
    console.log(dataTable.value);

    onMounted(() => {
      console.log('dataTable');
      console.log(dataTable.value);
    });
    // pagination related
    const maxPaginationNumber = computed(() => dataTable.value?.maxPaginationNumber);
    const currentPaginationNumber = computed(() => dataTable.value?.currentPaginationNumber);

    const isFirstPage = computed(() => dataTable.value?.isFirstPage);
    const isLastPage = computed(() => dataTable.value?.isLastPage);

    const nextPage = () => {
      dataTable.value?.nextPage();
    };
    const prevPage = () => {
      dataTable.value?.prevPage();
    };
    const updatePage = (paginationNumber: number) => {
      dataTable.value?.updatePage(paginationNumber);
    };

    return {
      dataTable,
      headers,
      items,
      serverOptions,
      serverItemsLength,
      loading,
      currentPageFirstIndex,
      currentPageLastIndex,
      maxPaginationNumber,
      currentPaginationNumber,
      isFirstPage,
      isLastPage,
      itemsSelected,
      nextPage,
      prevPage,
      updatePage,
      bodyRowClassName,
      updateSort,
    };
  },

});
</script>

<style>
.test-row {
  border-color: red;
}
</style>

<!-- <style>
.hc-table {
  --easy-table-border: 1px solid #445269;
  --easy-table-row-border: 1px solid #445269;

  --easy-table-header-row-font-size: 14px;
  --easy-table-header-row-height: 50px;
  --easy-table-header-row-font-color: #c1cad4;
  --easy-table-header-row-background-color: #2d3a4f;

  --easy-table-header-item-padding: 10px 15px;
  --easy-table-header-item-background-color: #2d3a4f;

  --easy-table-body-even-row-font-color: #fff;
  --easy-table-body-even-row-background-color: #4c5d7a;

  --easy-table-body-row-font-color: #c0c7d2;
  --easy-table-body-row-background-color: #2d3a4f;
  --easy-table-body-row-height: 50px;
  --easy-table-body-row-font-size: 14px;

  --easy-table-body-row-hover-font-color: #2d3a4f;
  --easy-table-body-row-hover-background-color: #eee;

  --easy-table-body-item-padding: 10px 15px;
  --easy-table-body-item-background-color: #2d3a4f;

  --easy-table-footer-background-color: #2d3a4f;
  --easy-table-footer-font-color: #c0c7d2;
  --easy-table-footer-font-size: 14px;
  --easy-table-footer-padding: 0px 10px;
  --easy-table-footer-height: 50px;

  --easy-table-scrollbar-track-color: #2d3a4f;
  --easy-table-scrollbar-color: #2d3a4f;
  --easy-table-scrollbar-thumb-color: #4c5d7a;;
  --easy-table-scrollbar-corner-color: #2d3a4f;

  --easy-table-loading-mask-background-color: #2d3a4f;
}

</style> -->
