<template>
  <button :class="buttonClasses" :disabled="disabled" @click="onClick">
    <slot />
  </button>
</template>

<script setup>
import { defineProps, computed } from "vue";
const emit = defineEmits(["click"]);

const props = defineProps({
  isRound: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String, //info, positive, negative, warning
    default: "info",
  },
  disabled: Boolean,
});

const buttonClasses = computed(() =>
  [
    "flex items-center justify-center",
    "focus:outline-none",
    "transition duration-150 ease-in-out",
    props.isRound ? "rounded-full w-10 h-10" : "rounded-md py-2 px-4",
    "text-white",
    props.disabled ? "opacity-40" : "",
    props.color === "info"
      ? "bg-blue-500 hover:bg-blue-700"
      : props.color === "negative"
      ? "bg-red-500 hover:bg-red-700"
      : props.color === "warning"
      ? "bg-orange-500 hover:bg-orange-700"
      : "bg-green-500 hover:bg-green-700",
  ].join(" ")
);

const onClick = (event) => {
  if (!props.isLink) {
    emit("click", event);
  }
};
</script>
