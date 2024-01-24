<template>
  <div v-if="alertState.isVisible" :class="alertClasses">
    {{ alertState.message }}
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useAlertMessage } from "~/composables/useAlert";

const { alertState } = useAlertMessage();

const alertClasses = computed(() => [
  "absolute",
  "top-5",
  "right-5",
  "p-4",
  "rounded-lg",
  "shadow-md",
  "text-white",
  "font-bold",
  "z-50",

  {
    "bg-green-500": alertState.value.type === "success",
    "bg-red-500": alertState.value.type === "error",
    "bg-blue-500": alertState.value.type === "info",
  },
]);
</script>
