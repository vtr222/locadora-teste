<template>
  <div
    v-if="isShown"
    class="absolute inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-40"
    @click="toggleVisibility"
  >
    <div
      class="bg-white rounded-lg shadow-lg p-8 m-4 max-w-xl max-h-full overflow-auto"
      @click.stop
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const isShown = ref(false);

const toggleVisibility = () => {
  isShown.value = !isShown.value;
};

defineExpose({ toggleVisibility });
</script>
