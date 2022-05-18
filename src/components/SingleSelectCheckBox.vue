<template>
  <div
    class="single-select__checkbox"
    @click.stop.prevent="emits('change')"
  >
    <input
      type="checkbox"
      :checked="checked"
    >
    <label for="checbox" />
  </div>
</template>

<script setup lang="ts">
const emits = defineEmits(['change']);

defineProps({
  checked: { type: Boolean, required: true },
});
</script>

<style lang="scss" scoped>
$checkbox-checked-color: rgb(51, 122, 183);
$checkbox-border-color: rgba(0, 0, 0, 0.54);

$checkbox-size: 1.25em;
$checkbox-margin: 1em 0;
$checkbox-padding: .25em;
$checkbox-border-width: 1px;
$checkbox-border-radius: 0.125em;
$checkbox-label-padding: .75em;

$checkmark-width: 0.125em;
$checkmark-color: #fff;

$line-width: 0.125em;
$line-color: #fff;

.single-select__checkbox {
  position: relative;
  label {
    cursor: pointer;
    display: inline;
    line-height: $checkbox-size;
    vertical-align: top;
    clear: both;
    padding-left: 1px;

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

    &:checked {
      + label:before{
        background: $checkbox-checked-color;
        border: none;
      }
      + label:after {
        $checkmark-size: $checkbox-size - 2 * $checkbox-padding;
        transform: translate($checkbox-padding, ($checkbox-size / 2) - ($checkmark-size / 2.6)) rotate(-45deg);
        width: $checkmark-size;
        height: $checkmark-size / 2;
        border: $checkmark-width solid $checkmark-color;
        border-top-style: none;
        border-right-style: none;
      }
    }
  }
}

*, *:before, *:after {
  box-sizing: border-box;
}
</style>
