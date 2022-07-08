<template>
  <div class="loader-line"></div>
</template>

<script lang="ts" setup>
import { inject } from 'vue';

const themeColor = inject('themeColor');
</script>

<style lang="scss" scoped>
.loader-line {
  width: 100%;
  height: 3px;
  position: relative;
  overflow: hidden;
  background-color: #ddd;
  margin: 0x auto;
}

.loader-line:before {
  content: "";
  position: absolute;
  left: -50%;
  height: 3px;
  width: 40%;
  background-color: v-bind(themeColor);
  -webkit-animation: lineAnim 1s linear infinite;
  -moz-animation: lineAnim 1s linear infinite;
  animation: lineAnim 1s linear infinite;
}

@keyframes lineAnim {
  0% {
    left: -40%;
  }
  50% {
    left: 20%;
    width: 80%;
  }
  100% {
    left: 100%;
    width: 100%;
  }
}
</style>
