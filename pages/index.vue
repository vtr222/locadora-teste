<template>
  <div>
    <NuxtLayout name="main">
      <template #page-title>Aluguel de Filmes</template>
      <div class="p-4">
        <div class="flex items-center space-x-4">
          <TextInput
            label="Filme"
            placeholder="Buscar por título do filme..."
            class="w-2/5 min-w-64"
            v-model="filter.name"
          />
          <YearSelector v-model="filter.year" />
          <Button isRound class="mt-6" @click="doSearch()">🔍</Button>
        </div>
        <!-- TanStack Table will be here -->
        <Table :columns="columns" :data="movies"> </Table>
      </div>

      <Cart
        :movies="selectedMovies"
        @save="confirmSelection"
        @emptyCart="cancelSelection"
      />
    </NuxtLayout>
    <Alert />
  </div>
</template>

<script setup lang="jsx">
import { h } from "vue";
import { searchMovies } from "~/services/movieService";
import { useAlertMessage } from "~/composables/useAlert.ts";
import { rentalService } from "~/services/rentalService";
import { getClientById, updateClient } from "~/services/clientService";
const { showMessage } = useAlertMessage();

definePageMeta({
  layout: false,
});

const movies = ref([]);
const selectedMovies = ref([]);

const filter = ref({
  name: "",
  year: "",
});

async function doSearch() {
  showMessage("Buscando...", "info");
  try {
    const response = await searchMovies(filter.value.name, filter.value.year);
    if (response.Response === "False") {
      showMessage("Nenhum filme encontrado", "error");
    }
    movies.value = response.Search;
  } catch (error) {
    showMessage("Erro ao buscar os filmes", "error");
  }
}

function addToCart(movie) {
  const isMovieAlreadySelected = selectedMovies.value.some(
    (selectedMovie) => selectedMovie.imdbID === movie.imdbID
  );

  if (!isMovieAlreadySelected) {
    selectedMovies.value.push(movie);
    showMessage("Filme adicionado no carrinho", "success");
  } else {
    showMessage("Filme já selecionado no carrinho", "info");
  }
}

function confirmSelection(rental) {
  try {
    rentalService.createRental({
      rental,
    });
    const client = getClientById(rental.client);
    client.locacaoAtiva = true;
    updateClient(client);
    showMessage("Locação criada com sucesso", "success");
  } catch (e) {
    console.log(e);
    showMessage("Erro ao salvar locação", "info");
  }
}
function cancelSelection() {
  selectedMovies.value = [];
}

const columns = ref([
  {
    accessorKey: "Poster",
    header: "Poster",

    cell: ({ row }) =>
      h(
        <div>
          <img class={"h-[70px]"} src={row.original.Poster} />
        </div>,
        { id: row.original.id }
      ),
  },
  { accessorKey: "Year", header: "Ano" },
  { accessorKey: "Title", header: "Título" },

  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row }) =>
      h(
        <Button
          title="Adicionar ao carrinho"
          onClick={() => {
            addToCart(row.original);
          }}
          isRound
          color="positive"
        >
          ➕
        </Button>,
        { id: row.original.id }
      ),
    enableSorting: false,
  },
]);
</script>
