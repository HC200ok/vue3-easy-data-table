<template>
  server-side mode:
  <DataTable
    v-model:itemsSelected="itemsSelected"
    v-model:serverOptions="serverOptions"
    :headers="headers"
    :items="items"
    :server-items-length="100"
    :loading="isServerLoading"
    @click-item="showItem"
  >
  </DataTable>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import DataTable from './components/DataTable.vue';

import type { Header, Item } from './types/table';

const headers: Header[] = [
  {
    text: 'Name',
    value: 'name',
  },
  {
    text: 'Address',
    value: 'address',
  },
  {
    text: 'Height',
    value: 'height',
    sortable: true,
  },
  {
    text: 'Weight',
    value: 'weight',
    sortable: true,
  },
  {
    text: 'Age',
    value: 'calories',
    sortable: true,
  },
  {
    text: 'Calories',
    value: 'calories',
  },
  { text: 'Fat (g)', value: 'fat' },
  { text: 'Carbs (g)', value: 'carbs' },
  { text: 'Protein (g)', value: 'protein' },
  { text: 'Iron (%)', value: 'iron' },
];

const showItem = (item: Item): void => {
  console.log(item);
};

const itemsSelected = ref([]);

const serverOptions = ref({});

watch(serverOptions, (value) => {
  // trigger api request to load data from server
  console.log(value);
}, { deep: true });

const isServerLoading = ref(false);

const mockServerLoadPage = (pageNumber: number, rows: number): Item[] => {
  const mockItems = [];
  for (let i = 1; i <= rows; i += 1) {
    const rowIdentification = (pageNumber - 1) * rows + i;
    mockItems.push({
      name: `name-page-${pageNumber}-row-${rowIdentification}`,
      address: `address-page-${pageNumber}-row-${rowIdentification}`,
      height: rowIdentification,
      weight: rowIdentification,
      age: rowIdentification,
      calories: rowIdentification,
      fat: rowIdentification,
      carbs: rowIdentification,
      protein: rowIdentification,
      iron: rowIdentification,
    });
  }
  return mockItems;
};

const items = ref(mockServerLoadPage(1, 5));

const serverLoadMore = async (loadQuery: {pageNumber: number, rows: number}) => {
  isServerLoading.value = true;
  console.log('serverLoadMore');
  const { pageNumber, rows } = loadQuery;
  // eslint-disable-next-line no-promise-executor-return
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const newPageItems = mockServerLoadPage(pageNumber, rows);
  console.log(newPageItems);
  items.value = items.value.concat(newPageItems);
  isServerLoading.value = false;
};
</script>
