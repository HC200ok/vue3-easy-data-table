import { createApp } from 'vue';
import Vue3EasyDataTable from 'vue3-easy-data-table';
import App from './App.vue';
import 'vue3-easy-data-table/dist/style.css';

const app = createApp(App);
app.component('EasyDataTable', Vue3EasyDataTable);
app.mount('#app');
