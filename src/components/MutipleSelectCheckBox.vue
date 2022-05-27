<template>
  <div
    class="multi-select__checkbox"
    @click.stop.prevent="toggleChecked"
  >
    <input
      type="checkbox"
      :checked="isChecked"
      :class="status"
    >
    <label for="checbox" />
  </div>
</template>

<script setup lang="ts">
import { PropType, computed, inject } from 'vue';

const emits = defineEmits(['change']);

const props = defineProps({
  status: { type: String as PropType<'noneSelected' | 'partSelected' | 'allSelected'>, required: true },
});

const isChecked = computed(() => props.status === 'allSelected');

const toggleChecked = () => {
  emits('change', !isChecked.value);
};

const themeColor = inject('themeColor');
</script>

<style lang="scss" scoped>
@import '../scss/checbox.scss';

$checkbox-checked-color: v-bind(themeColor);

.multi-select__checkbox {
  position: relative;
  width: $checkbox-size;
  height: $checkbox-size;

  label {
    cursor: pointer;
    display: inline;
    line-height: $checkbox-size;
    vertical-align: top;
    clear: both;

    &:before, &:after {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
    }

    &:before {
      width: $checkbox-size;
      height: $checkbox-size;
      background: #fff;
      border: $checkbox-border-width solid $checkbox-border-color;
      border-radius: $checkbox-border-radius;
      cursor: pointer;
      transition: background .3s;
    }
  }

  input[type="checkbox"] {
    outline: 0;
    visibility: hidden;
    width: $checkbox-size;
    margin: 0;
    display: block;
    float: left;
    font-size: inherit;

    &.allSelected {
      + label:before{
        background: $checkbox-checked-color;
        border: none;
      }
      + label:after {
        $checkmark-size: $checkbox-size - 2 * $checkbox-padding;
        transform: translate($checkbox-padding, calc($checkbox-size / 2) - calc($checkmark-size / 2.6)) rotate(-45deg);
        width: $checkmark-size;
        height: calc($checkmark-size / 2);
        border: $checkmark-width solid $checkmark-color;
        border-top-style: none;
        border-right-style: none;
      }
    }
    &.partSelected {
      + label:before{
        background: $checkbox-checked-color;
        border: none;
      }
      + label:after {
        $line-size: $checkbox-size - 2 * $checkbox-padding;
        transform: translate($checkbox-padding, calc($checkbox-size / 2) - calc($line-width / 2));
        width: $line-size;
        height: calc($line-size / 2);
        border: $line-width solid $line-color;
        border-bottom-style: none;
        border-right-style: none;
        border-left-style: none;
      }
    }
  }
}

*, *:before, *:after {
  box-sizing: border-box;
}
</style>
