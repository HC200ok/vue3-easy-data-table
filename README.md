<p align="center">
<img src="logo.png"  width="400"/ />
</p>

## Introduction
vue3-easy-data-table is a simple and easy-to-use data table component made with Vue.js 3.x.

## Website
https://hc200ok.github.io/vue3-easy-data-table-doc/

<img src="./images/demo.png"  />

## Why
I am doing the Vue2 to Vue3 migration for the project of my company  recently, In the Vue2 version, we were using the data table component of Vuetify2. But for the new Vue3 version, Vuetify3 Beta seems not ready for the production environment yet, and the data table component in Vuetify3 is still in development, so I made vue3-easy-data-table by referring to the API and UI of the data table component in Vuetify2. If you are also waiting for the release of the data table component of Vuetify3, what about trying this component first?

## Getting started
### Install
```js
npm install vue3-easy-data-table
// or
yarn add vue3-easy-data-table
```

### Regist
```js
import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';

const app = createApp(App);
app.component('EasyDataTable', Vue3EasyDataTable);
```

### Use
```js
<template>
  <EasyDataTable
    :headers="headers"
    :items="items"
  />
</template>

<script lang="ts">
import type { Header, Item } from "vue3-easy-data-table";

export default defineComponent({
  setup() {
    const headers: Header[] = [
      { text: "Name", value: "name" },
      { text: "Height (cm)", value: "height", sortable: true },
      { text: "Weight (kg)", value: "weight", sortable: true },
      { text: "Age", value: "age", sortable: true }
    ];

    const items: Item[] = [
      { "name": "Curry", "height": 178, "weight": 77, "age": 20 },
      { "name": "James", "height": 180, "weight": 75, "age": 21 },
      { "name": "Jordan", "height": 181, "weight": 73, "age": 22 }
    ];

    return {
      headers,
      items
    };
  },
});
</script>
```