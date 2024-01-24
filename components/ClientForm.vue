<template>
  <div class="flex flex-col space-y-4 max-h-[80vh] w-4/5 min-w-64">
    <TextInput v-model="localClient.name" label="Nome" />
    <TextInput v-model="localClient.surname" label="Sobrenome" />
    <TextInput v-model="localClient.cpf" label="CPF" />

    <h2 class="text-lg font-semibold">Contact</h2>
    <TextInput v-model="localClient.contacts.email" label="Email" />
    <TextInput v-model="localClient.contacts.phone" label="Telefone" />

    <h2 class="text-lg font-semibold">Address</h2>
    <TextInput v-model="localClient.address.zip" label="CEP" />
    <TextInput
      v-model="localClient.address.street"
      label="Rua"
      :disabled="!addressFieldsEditable"
    />
    <TextInput
      v-model="localClient.address.neighborhood"
      label="Bairro"
      :disabled="!addressFieldsEditable"
    />
    <TextInput
      v-model="localClient.address.city"
      label="Cidade"
      :disabled="!addressFieldsEditable"
    />
    <TextInput
      v-model="localClient.address.state"
      label="Estado"
      :disabled="!addressFieldsEditable"
    />
    <label class="text-sm font-medium text-gray-700">Status</label>
    <select
      v-model="localClient.status"
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
import type { Client } from "~/services/clientService";
import { getDefaultClient } from "~/services/clientService";
import { clientService } from "~/services/clientService";
//@ts-ignore
import { debounce } from "lodash";

const props = defineProps({
  modelValue: Object as () => Client,
});
const emit = defineEmits(["update:modelValue", "success", "error"]);

const localClient = ref<Client>(getDefaultClient());

watch(
  () => props.modelValue,
  (newValue) => {
    console.log("aaasdajsdk", newValue);
    if (newValue) {
      localClient.value = { ...localClient.value, ...newValue };
    }
  },
  { immediate: true }
);

const isFormValid = computed(() => {
  const client = localClient.value;
  const contactValid = client.contacts.email && client.contacts.phone;
  const addressValid =
    client.address.zip &&
    client.address.zip.length === 8 &&
    client.address.street &&
    client.address.neighborhood &&
    client.address.city &&
    client.address.state;

  return (
    client.name &&
    client.surname &&
    client.cpf &&
    client.cpf.length === 11 &&
    contactValid &&
    addressValid
  );
});

const handleSubmit = () => {
  if (!isFormValid.value) {
    emit("error", "Por favor, verifique os campos.");
    return;
  }

  try {
    if (localClient.value.id) {
      clientService.updateClient(localClient.value);
    } else {
      clientService.createClient(localClient.value);
    }
    emit("success", "Salvo com sucesso");
  } catch (e) {
    emit("error", e);
  }
};

const addressFieldsEditable = ref(false);

watch(
  () => localClient.value.address.zip,
  debounce(async (newZip: string) => {
    if (newZip && newZip.length === 8) {
      try {
        const addressData = await clientService.getAddressByCEP(newZip);
        if (addressData.erro) {
          throw "not found";
        }
        localClient.value.address.street = addressData.logradouro || "";
        localClient.value.address.neighborhood = addressData.bairro || "";
        localClient.value.address.city = addressData.localidade || "";
        localClient.value.address.state = addressData.uf || "";

        addressFieldsEditable.value = false;
      } catch (error) {
        emit("error", "CEP not found. Please enter the address manually.");
        addressFieldsEditable.value = true;
      }
    }
  }, 300)
);
</script>
