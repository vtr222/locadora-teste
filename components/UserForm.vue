<template>
  <div class="flex flex-col space-y-4">
    <TextInput v-model="localUser.name" label="Nome" placeholder="Enter name" />
    <TextInput v-model="localUser.document" label="Documento" />
    <TextInput v-model="localUser.password" label="Senha" type="password" />

    <label class="text-sm font-medium text-gray-700">Status</label>
    <select
      v-model="localUser.status"
      class="border-2 border-gray-300 rounded-md py-2 px-4 w-full transition ease-in-out duration-150"
    >
      <option value="active">Ativo</option>
      <option value="inactive">Inativo</option>
    </select>

    <Button @click="handleSubmit">Salvar</Button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from "vue";
import TextInput from "./TextInput.vue";
import Button from "./Button.vue";
import { getDefaultUser, type User } from "~/services/userService";
import { userService } from "~/services/userService";

const props = defineProps({
  modelValue: Object as () => User,
});
const emit = defineEmits(["update:modelValue", "success", "error"]);

const localUser = ref<User>(getDefaultUser());

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      localUser.value = { ...localUser.value, ...newValue };
    }
  },
  { immediate: true, deep: true }
);

const isFormValid = computed(() => {
  return (
    localUser.value.name && localUser.value.document && localUser.value.password
  );
});

const handleSubmit = () => {
  if (!isFormValid.value) {
    emit("error", "Please fill all the fields.");
    return;
  }

  try {
    if (localUser.value.id) {
      userService.updateUser(localUser.value);
    } else {
      userService.createUser(localUser.value);
    }
    emit("success", "Salvo com sucesso");
  } catch (e) {
    emit("error", e);
  }
};
</script>
