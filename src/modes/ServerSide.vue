<template>
  <div>
    <DataTable
      ref="dataTable"
      v-model:server-options="serverOptions"
      :headers="headers"
      :items="items"
      :server-items-length="serverItemsLength"
      :loading="loading"
      show-index
      buttons-pagination
      alternating
      sort-by="age"
      sort-type="desc"
      search-field="address"
      search-value="address-1"
      :table-height="300"
    >
      <template #address="{ address }">
        <a :href="address">{{ address }}</a>
      </template>
      <template #pagination="{ prevPage, nextPage, isFirstPage, isLastPage }">
        <button :disabled="isFirstPage" @click="prevPage">
          prev page
        </button>
        <button :disabled="isLastPage" @click="nextPage">
          next page
        </button>
      </template>
    </DataTable>
    <div class="customize-footer">
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
        <button class="prev-page" @click="prevPage" :disabled="isFirstPage">
          prev page
        </button>
        <button class="next-page" @click="nextPage" :disabled="isLastPage">
          next page
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Header, Item, ServerOptions } from "../types/main";
import DataTable from '../components/DataTable.vue';
import { mockClientItems, mockServerItems } from "../mock";
import { defineComponent, ref, computed, watch, onMounted, Ref, } from "vue";

export default defineComponent({
  components: {DataTable},
  setup() {
    const headers: Header[] = [
      { text: "Name", value: "name" },
      { text: "Address", value: "address" },
      { text: "Height", value: "height", sortable: true },
      { text: "Weight", value: "weight", sortable: true },
      { text: "Age", value: "age", sortable: true },
      { text: "Favourite sport", value: "favouriteSport" },
      { text: "Favourite fruits", value: "favouriteFruits" },
    ];
    const items = ref<Item[]>([]);
    const itemsSelected = ref<Item[]>([items.value[0]]);
    const serverItemsLength = ref(0);
    const serverOptions = ref<ServerOptions>({
      page: 1,
      rowsPerPage: 10,
    });

    const loading = ref(false);

    const loadFromServer = async () => {
      loading.value = true;
      const {
        serverCurrentPageItems,
        serverTotalItemsLength,
      } = await mockServerItems(serverOptions.value, 101);
      items.value = serverCurrentPageItems;
      serverItemsLength.value = serverTotalItemsLength;
      loading.value = false;
    };

    // first load when created
    loadFromServer();

    watch(
      serverOptions,
      () => {
        loadFromServer();
      },
      { deep: true }
    );
    // $ref dataTable
    const dataTable = ref();
    // index related
    const currentPageFirstIndex = computed(() => dataTable.value?.currentPageFirstIndex);
    const currentPageLastIndex = computed(() => dataTable.value?.currentPageLastIndex);
    const clientItemsLength = computed(() => dataTable.value?.clientItemsLength);

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
      nextPage,
      prevPage,
      updatePage,
    };
  },

});
</script>
