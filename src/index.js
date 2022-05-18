import DataTable from './components/DataTable.vue';

export default {
  install: (app) => {
    app.component('EasyDataTable', DataTable);
  },
};
