<template>
  client mode:
  <DataTable
    v-model:itemsSelected="itemsSelected"
    :headers="headers"
    :items="items"
    :rows-per-page="10"
    :rows-items="[10, 25, 50]"
    :body-font-size="15"
    sort-by="height"
    sort-type="desc"
    :buttons-pagination="true"
    show-index
    loading
  >
    <template #loading>
      <img
        src="https://i.pinimg.com/originals/94/fd/2b/94fd2bf50097ade743220761f41693d5.gif"
        style="width: 100px;height: 80px;"
      >
    </template>
    <template #address="{ address }">
      <div style="color: red">
        {{ address }}
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Header, Item } from 'vue3-easy-data-table';

import DataTable from '../components/DataTable.vue';

const headers: Header[] = [
  { text: 'Name', value: 'name' },
  { text: 'Address', value: 'address' },
  { text: 'Height', value: 'height', sortable: true },
  { text: 'Weight', value: 'weight', sortable: true },
  { text: 'Age', value: 'calories', sortable: true },
  { text: 'Calories', value: 'calories' },
  { text: 'Fat (g)', value: 'fat' },
  { text: 'Carbs (g)', value: 'carbs' },
  { text: 'Protein (g)', value: 'protein' },
  { text: 'Iron (%)', value: 'iron' },
];

const showItem = (item: Item): void => {
  console.log(item);
};
const itemsSelected = ref([]);

const createMockItems = (): Item[] => {
  const mockItems = [];
  for (let i = 1; i < 2501; i += 1) {
    mockItems.push({
      name: `name-${i}`,
      address: `address-${i}`,
      height: i,
      weight: i,
      age: i,
      calories: i,
      fat: i,
      carbs: i,
      protein: i,
      iron: i,
    });
  }
  return mockItems;
};

const items = createMockItems();
console.log(createMockItems());

</script>
