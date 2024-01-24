<template>
  <div>
    <NuxtLayout name="main">
      <template #page-title>Usuários</template>
      <div class="p-4 flex flex-col space-y-4">
        <Button color="positive" class="w-64" @click="newUser"
          >Novo Usuário</Button
        >
        <Table :columns="columns" :data="users"> </Table>
      </div>

      <Modal ref="userModal">
        <UserForm
          v-model="userFormData"
          @success="
            (m) => {
              userModal.toggleVisibility();
              showMessage(m, 'success');
              getUsers();
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
        message="Confimar desativação do usuário"
        @confirm="deleteUser(idToDelete)"
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
import { getDefaultUser } from "~/services/userService";
import { userService } from "../services/userService";

const users = ref([]);
const userFormData = ref(getDefaultUser());

function getUsers() {
  users.value = userService.getUsers();
}

onMounted(() => {
  getUsers();
});

const userModal = ref(null);

function newUser() {
  userFormData.value = getDefaultUser();
  userModal.value.toggleVisibility();
}

function editUser(user) {
  userModal.value.toggleVisibility();
  userFormData.value = { ...user };
}

const confirmExclusionRef = ref(null);
const idToDelete = ref(null);
const showConfirmDialog = (userId) => {
  idToDelete.value = userId;
  confirmExclusionRef.value.openModal();
};
function deleteUser(id) {
  userService.deactivateUser(id);
  getUsers();
  showMessage("Desativado com sucesso", "success");
}

const columns = ref([
  { accessorKey: "id", header: "ID" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (row.original.status === "active" ? "Ativo" : "Inativo"),
  },
  { accessorKey: "name", header: "Nome" },
  { accessorKey: "document", header: "Documento" },

  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div class="flex space-x-2">
        <Button
          title="Editar"
          onClick={() => {
            editUser(row.original);
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
          color="negative"
          disabled={row.original.status !== "active"}
        >
          🗑️
        </Button>
      </div>
    ),
    enableSorting: false,
  },
]);
</script>
