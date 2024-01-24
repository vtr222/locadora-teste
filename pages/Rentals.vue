<template>
  <div>
    <NuxtLayout name="main">
      <template #page-title>Aluguéis</template>
      <div class="p-4 flex flex-col space-y-4">
        <div class="flex items-center space-x-4">
          <TextInput
            placeholder="Insira o nome do cliente"
            class="w-1/5 min-w-64"
            label="Cliente"
            v-model="filter.name"
          />

          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700">Aluguel</label>
            <input
              type="date"
              v-model="filter.rentalDate"
              class="border-2 border-gray-300 rounded-md py-2 px-4 w-full transition ease-in-out duration-150"
              placeholder="Enter rental date"
            />
          </div>

          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700">Devolução</label>
            <input
              type="date"
              v-model="filter.returnDate"
              class="border-2 border-gray-300 rounded-md py-2 px-4 w-full transition ease-in-out duration-150"
              placeholder="Enter return date"
            />
          </div>

          <Button isRound class="mt-6" @click="getRentals()">🔍</Button>
        </div>
      </div>

      <div class="p-4 flex flex-col space-y-4">
        <Table :columns="columns" :data="rentals"></Table>
      </div>

      <ConfirmExclusion
        ref="confirmExclusionRef"
        id="idToReturn"
        message="Confirmar devolução do(s) filme(s)"
        @confirm="returnRental(idToReturn)"
      />
    </NuxtLayout>

    <Alert />
  </div>
</template>

<script setup lang="jsx">
import { useAlertMessage } from "~/composables/useAlert.ts";
import { rentalService } from "~/services/rentalService.ts";
import { ref, onMounted } from "vue";
import { getClientById, updateClient } from "~/services/clientService";

definePageMeta({
  layout: false,
});

const { showMessage } = useAlertMessage();
const rentals = ref([]);
const filter = ref({
  name: "",
  rentalDate: "",
  returnDate: "",
});

function getRentals() {
  rentals.value = rentalService.getRentals(
    filter.value.name,
    filter.value.rentalDate,
    filter.value.returnDate
  );
}

onMounted(() => {
  getRentals();
});

const confirmExclusionRef = ref(null);
const idToReturn = ref(null);
const showConfirmDialog = (rentalId) => {
  idToReturn.value = rentalId;
  confirmExclusionRef.value.openModal();
};

function returnRental(id) {
  const rental = rentalService.getRentalById(id);
  if (rental) {
    rental.rental.status = "returned";
    rental.rental.returnDate = new Date().toISOString().split("T")[0];
    rentalService.updateRental(rental);
    const client = getClientById(rental.rental.client);
    client.locacaoAtiva = false;
    updateClient(client);
    getRentals();
    showMessage("Devolução realizada com sucesso", "success");
  }
}

const columns = ref([
  { accessorKey: "id", header: "ID" },
  { accessorKey: "rental.clientName", header: "Cliente" },
  { accessorKey: "rental.movieNames", header: "Filmes" },
  { accessorKey: "rental.rentalDate", header: "Dia de Locação" },
  { accessorKey: "rental.returnDate", header: "Dia de Retorno" },
  { accessorKey: "rental.userId", header: "ID Usuário" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) =>
      row.original.rental.status === "rented" ? "Alugado" : "Devolvido",
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div class="flex space-x-2">
        <Button
          title="Devolver"
          onClick={() => showConfirmDialog(row.original.id)}
          isRound
          color="negative"
          disabled={row.original.rental.status !== "rented"}
        >
          🔄
        </Button>
      </div>
    ),
    enableSorting: false,
  },
]);
</script>
