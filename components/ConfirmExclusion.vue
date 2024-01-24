<template>
  <Modal ref="modalRef">
    <div class="flex flex-col space-y-2 items-center">
      <div>{{ message }}</div>
      <Button color="negative" @click="confirmDelete" class="w-32"
        >Confirmar</Button
      >
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from "vue";
import Modal from "./Modal.vue";

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
  message: {
    type: String,
    default: "Confirmar ação",
  },
});
const emits = defineEmits(["confirm"]);

const modalRef = ref(null) as Ref<{ toggleVisibility: () => void }> | Ref<null>;

const confirmDelete = () => {
  emits("confirm", props.id);
  modalRef?.value?.toggleVisibility();
};

const openModal = () => {
  modalRef?.value?.toggleVisibility();
};

defineExpose({ openModal });
</script>
