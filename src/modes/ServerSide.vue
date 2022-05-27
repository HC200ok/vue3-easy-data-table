<template>
  server-side mode:
  <DataTable
    v-model:server-options="serverOptions"
    :headers="headers"
    :items="items"
    :server-items-length="serverItemsLength"
    :loading="loading"
    :buttons-pagination="true"
  >
  </DataTable>
  {{ restApiUrl }}
</template>

<script setup lang='ts'>
import { ref, watch, computed } from 'vue';
// @ts-ignore
import type { Header, Item, ServerOptions } from '@src/types/main';

import DataTable from '../components/DataTable.vue';
import { mockServerItems } from '../mock';

const headers: Header[] = [
  { text: 'Name', value: 'name' },
  { text: 'Address', value: 'address' },
  { text: 'Height', value: 'height', sortable: true },
  { text: 'Weight', value: 'weight', sortable: true },
  { text: 'Age', value: 'age', sortable: true },
  { text: 'Favourite sport', value: 'favouriteSport' },
  { text: 'Favourite fruits', value: 'favouriteFruits' },
];
const items = ref<Item[]>([]);
const serverItemsLength = ref(0);
const serverOptions = ref<ServerOptions>({
  page: 5,
  rowsPerPage: 100,
  sortBy: 'height',
  sortType: 'desc',
});

const restApiUrl = computed(() => {
  const {
    page, rowsPerPage, sortBy, sortType,
  } = serverOptions.value;
  return `http://localhost:8080/api?page=${page}&limit=${rowsPerPage}&sortBy=${sortBy}&sortType=${sortType}`;
});

const loading = ref(false);

const loadFromServer = async () => {
  loading.value = true;
  const {
    serverCurrentPageItems,
    serverTotalItemsLength,
  } = await mockServerItems(serverOptions.value);
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
  { deep: true },
);
</script>
