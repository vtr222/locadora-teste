<template>
  <div class="flex flex-col space-y-1">
    <label :for="label" class="text-sm font-medium text-gray-700">Ano</label>
    <select
      :value="value"
      @change="updateValue($event.target.value)"
      class="border-2 border-gray-300 rounded-md py-2 px-4 w-36 text-gray-700 transition ease-in-out duration-150"
    >
      <option disabled value="">Selecione o ano</option>
      <option v-for="year in years" :key="year" :value="year">
        {{ year }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from "vue";

const props = defineProps({
  value: String,
});

const emits = defineEmits(["update:modelValue"]);

const currentYear = new Date().getFullYear();
const years = computed(() => {
  let yearsArray = ["Todos"];
  for (let i = 0; i < 90; i++) {
    yearsArray.push(currentYear - i);
  }
  return yearsArray;
});

const updateValue = (newValue) => {
  emits("update:modelValue", newValue);
};
</script>
