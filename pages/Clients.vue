<template>
  <div>
    <NuxtLayout name="main">
      <template #page-title>Clientes</template>
      <div class="p-4 flex flex-col space-y-4">
        <div class="flex items-center space-x-4">
          <TextInput
            placeholder="Insira o nome do cliente"
            class="w-1/5 min-w-64"
            label="Cliente"
            v-model="filter.name"
          />
          <TextInput
            placeholder="Insira o documento do cliente"
            class="w-1/5 min-w-64"
            label="CPF"
            v-model="filter.cpf"
          />
          <div class="flex flex-col space-y-1">
            <label class="text-sm font-medium text-gray-700">Status</label>
            <select
              v-model="filter.status"
              class="border-2 border-gray-300 rounded-md py-2 px-4 transition ease-in-out duration-150 w-32"
            >
              <option value="todos">Todos</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <Button isRound class="mt-6" @click="getClients()">🔍</Button>
        </div>
        <Button @click="newClient" color="positive" class="w-64"
          >Novo Cliente</Button
        >
        <Table :columns="columns" :data="clients"> </Table>
      </div>

      <Modal ref="clientModal">
        <ClientForm
          v-model="clientFormData"
          @success="
            (m) => {
              clientModal.toggleVisibility();
              showMessage(m, 'success');
              getClients();
            }
          "
          @error="
            (m) => {
              showMessage(m, 'error', 3000);
            }
          "
        />
      </Modal>

      <ConfirmExclusion
        ref="confirmExclusionRef"
        id="idToDelete"
        message="Confimar desativação do cliente"
        @confirm="deleteClient(idToDelete)"
      />
    </NuxtLayout>
    <Alert />
  </div>
</template>

<script setup lang="jsx">
import { useAlertMessage } from "~/composables/useAlert.ts";
const { showMessage } = useAlertMessage();
definePageMeta({
  layout: false,
});

import { getDefaultClient } from "~/services/clientService";
import { clientService } from "../services/clientService";

const clients = ref([]);
const clientFormData = ref(getDefaultClient());

function getClients() {
  clients.value = clientService.getClients(filter.value);
}

onMounted(() => {
  getClients();
});

const clientModal = ref(null);

function newClient() {
  clientFormData.value = getDefaultClient();
  clientModal.value.toggleVisibility();
}
function editClient(client) {
  clientModal.value.toggleVisibility();
  clientFormData.value = { ...client };
}

const confirmExclusionRef = ref(null);
const idToDelete = ref(null);
const showConfirmDialog = (userId) => {
  idToDelete.value = userId;
  confirmExclusionRef.value.openModal();
};
function deleteClient(id) {
  clientService.deactivateClient(id);
  getClients();
  showMessage("Desativado com sucesso", "success");
}

const filter = ref({
  name: "",
  cpf: "",
  status: "todos",
});

const columns = ref([
  { accessorKey: "id", header: "ID" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (row.original.status === "active" ? "Ativo" : "Inativo"),
  },
  { accessorKey: "name", header: "Primeiro Nome" },
  { accessorKey: "surname", header: "Último Nome" },
  { accessorKey: "cpf", header: "CPF" },
  { accessorKey: "contacts.email", header: "Email" },
  { accessorKey: "contacts.phone", header: "Telefone" },
  { accessorKey: "address.zip", header: "CEP" },
  { accessorKey: "address.street", header: "Rua" },
  { accessorKey: "address.neighborhood", header: "Bairro" },
  { accessorKey: "address.city", header: "Cidade" },
  { accessorKey: "address.state", header: "Estado" },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div class="flex space-x-2">
        <Button
          title="Editar"
          onClick={() => {
            editClient(row.original);
          }}
          isRound
          color="warning"
        >
          ✏️
        </Button>
        <Button
          title="Excluir"
          onClick={() => showConfirmDialog(row.original.id)}
          isRound
          disabled={row.original.status !== "active"}
          color="negative"
        >
          🗑️
        </Button>
      </div>
    ),
    enableSorting: false,
  },
]);
</script>
