<template>
  <div class="flex flex-col space-y-1">
    <label :for="label" class="text-sm font-medium text-gray-700">{{
      label
    }}</label>
    <input
      :id="label"
      :placeholder="placeholder"
      :value="modelValue"
      :disabled="disabled"
      @input="updateValue($event.target.value)"
      class="border-2 border-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-transparent rounded-md py-2 px-4 w-full transition ease-in-out duration-150"
      :type="type"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  modelValue: String,
  label: String,
  placeholder: String,
  disabled: Boolean,
  type: { type: String, default: "text" }, //text, password
});

const emit = defineEmits(["update:modelValue"]);

const updateValue = (value) => {
  emit("update:modelValue", value);
};
</script>
