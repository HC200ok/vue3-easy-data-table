import DataTable from './components/DataTable.vue';

/* tslint:disable */
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.createApp({}).component('Vue3EasyDataTable', DataTable);
}

export default DataTable;
