<p align="center">
<img src="logo.png"  width="400"/ />
</p>

## Introduction
vue3-easy-data-table is a customizable and easy-to-use data table component made with Vue.js 3.x.

## Website
https://hc200ok.github.io/vue3-easy-data-table-doc/

<img src="./images/demo.png"  />

## Features
1. [Item slot](https://hc200ok.github.io/vue3-easy-data-table-doc/features/item-slot.html)
2. [Buttons pagination](https://hc200ok.github.io/vue3-easy-data-table-doc/features/buttons-pagination.html)
3. [Multiple selecting](https://hc200ok.github.io/vue3-easy-data-table-doc/features/multiple-selecting.html)
4. [Pagination slot](https://hc200ok.github.io/vue3-easy-data-table-doc/features/pagination-slot.html)
5. [Single field sorting](https://hc200ok.github.io/vue3-easy-data-table-doc/features/single-field-sorting.html)
6. [Searching](https://hc200ok.github.io/vue3-easy-data-table-doc/features/searching.html)
7. [Server side paginate and sort](https://hc200ok.github.io/vue3-easy-data-table-doc/features/server-side-paginate-and-sort.html)
8. [Color customization](https://hc200ok.github.io/vue3-easy-data-table-doc/features/color-customization.html)
9. [Loading slot](https://hc200ok.github.io/vue3-easy-data-table-doc/features/loading-slot.html)
10. [Footer customization](https://hc200ok.github.io/vue3-easy-data-table-doc/features/footer-customization.html)
11. [Filtering](https://hc200ok.github.io/vue3-easy-data-table-doc/features/filtering.html) (new feature since version `1.2.3`)
12. [Click row](https://hc200ok.github.io/vue3-easy-data-table-doc/features/click-row.html) (new feature since version `1.2.4`)
13. [Column width](https://hc200ok.github.io/vue3-easy-data-table-doc/features/column-width.html) (new feature since version `1.2.10`)
14. [Fixed columns](https://hc200ok.github.io/vue3-easy-data-table-doc/features/fixed-column.html) (new feature since version `1.2.10`)
14. [Header slot](https://hc200ok.github.io/vue3-easy-data-table-doc/features/header-slot.html) (new feature since version `1.2.25`)

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

## Todo
1. refactory (use render function instead of slot)
2. Migrate from color properties to css variables.
3. Make table header customizable 🎛️.
4. Vitual table rows.

## ⭐ Stargazers
[![Stargazers repo roster for @HC200ok/vue3-easy-data-table](https://reporoster.com/stars/dark/notext/HC200ok/vue3-easy-data-table)](https://github.com/HC200ok/vue3-easy-data-table/stargazers)

## Contribution
If you find any bug or demand any other features, plese let me know by reporting issues.

And making pull requests is also very welcomed!
