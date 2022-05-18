<template>
  <div class="rows-selector">
    <div
      class="rows-input__wrapper"
      @click="showList=!showList"
    >
      <div class="rows-input">
        {{ rowsComputed }}
      </div>
      <div class="triangle"></div>
    </div>
    <ul
      class="select-items"
      :class="{show: showList}"
    >
      <li
        v-for="item in rowsItems"
        :key="item"
        :class="{selected: item === rowsComputed }"
        @click="changeSelectedRows(item)"
      >
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, PropType } from 'vue';

const props = defineProps({
  modelValue: { type: Number, required: true },
  rowsItems: { type: Array as PropType<number[]>, required: true },
});

const emits = defineEmits(['update:modelValue']);

const showList = ref(false);

const rowsComputed = computed({
  get: (): number => props.modelValue,
  set: (value: number): void => {
    emits('update:modelValue', value);
  },
});

const changeSelectedRows = (value: number) => {
  rowsComputed.value = value;
  showList.value = false;
};
</script>

<style scoped lang="scss">
  .rows-selector{
    display: inline-block;
    min-width: 50px;
    position: relative;
    margin: 0px 10px;
    .rows-input__wrapper {
      height: 20px;
      border-bottom: 1px solid black;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0px 5px;
      cursor: pointer;
      .triangle {
        display: inline-block;
        vertical-align: middle;
        width: 0px;
        height: 0px;
        border-top: solid 8px black;
        border-left: solid 8px transparent;
        border-right: solid 8px transparent;
      }
    }
    ul.select-items {
      &.show {
        display: block;
      }
      position: absolute;
      top: 20px;
      left: 0px;
      width: 100%;
      display: none;
      margin: 0px;
      padding: 0px;
      text-align: left;
      list-style-type: none;
      box-shadow: 0 5px 5px -3px rgb(0 0 0 / 20%), 0 8px 10px 1px rgb(0 0 0 / 14%), 0 3px 14px 2px rgb(0 0 0 / 12%);
      li {
        cursor: pointer;
        padding: 5px;
        background-color: #fff;

        &.selected {
          color: #1867c0;
          background-color: #dbe7f5;
        }
      }
    }
  }
</style>
