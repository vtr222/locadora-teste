<template>
  <div
    class="fixed bottom-0 right-0 mb-4 mr-4 w-2/5 min-w-64 max-w-[400px] text-center"
    @mouseenter="expand"
    @mouseleave="collapse"
  >
    <div
      v-show="isExpanded"
      class="bg-white rounded-lg shadow-lg p-4 transition-opacity duration-300 ease-in-out"
    >
      <div class="flex items-center space-x-4 mb-2 text-left">
        <TextInput
          placeholder="Insira o nome do cliente"
          class="w-1/5 min-w-64"
          label="Buscar Cliente por nome ou CPF"
          v-model="filter"
        />
        <Button isRound class="mt-6" @click="doSearch()">🔍</Button>
      </div>

      <div class="flex flex-col mb-6 text-left" v-if="clientsFound.length">
        <label class="text-sm font-medium text-gray-700 text-left"
          >Clientes encontrados</label
        >
        <select
          v-model="selectedClient"
          class="border-2 border-gray-300 rounded-md py-2 px-4 w-full transition ease-in-out duration-150"
        >
          <option
            v-for="client in clientsFound"
            :value="client"
            :disabled="client.locacaoAtiva"
          >
            {{
              client.name +
              " " +
              client.surname +
              (client.locacaoAtiva ? " -- Locação ativa" : "")
            }}
          </option>
        </select>
      </div>

      <hr />

      <div class="mb-6 mt-2">
        <div class="flex flex-col" v-for="movie in movies">
          <div class="flex space-x-1">
            <b>{{ movie.Title }}</b>
            <span>{{ movie.Year }}</span>
          </div>
        </div>
      </div>

      <div class="mb-6 flex items-center space-x-1" v-if="selectedClient.name">
        <span>Alugando para:</span>
        <b> {{ selectedClient.name + " " + selectedClient.surname }}</b
        >,
        <span>CPF: {{ selectedClient.cpf }}</span>
      </div>

      <!-- insert client finder -->
      <div class="flex items-center space-x-2">
        <Button color="negative" class="w-32" @click="emptyCart"
          >Empty Cart</Button
        >
        <Button color="info" class="w-32" @click="save">Alugar</Button>
      </div>
    </div>
    <div class="bg-blue-500 text-white py-2 px-4 rounded-t-lg">
      Filmes selecionados: {{ movies?.length }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  getClientsForRental,
  type Client,
  getDefaultClient,
} from "~/services/clientService";
import { type Movie } from "~/services/movieService";
import { useAlertMessage } from "~/composables/useAlert";
import { getDefaultUser, type User } from "~/services/userService";
const currentUser: Ref<User> = ref(getDefaultUser());
onMounted(() => {
  //@ts-ignore
  currentUser.value = JSON.parse(localStorage.getItem("currentUser")) as User;
});

const { showMessage } = useAlertMessage();

const filter = ref("");

const props = defineProps({
  movies: Array<Movie>,
});

const isExpanded = ref(false);
const selectedClient: Ref<Client> = ref(getDefaultClient());
const clientsFound: Ref<Client[]> = ref([]);

function doSearch() {
  clientsFound.value = getClientsForRental(filter.value);
  if (!clientsFound.value.length) {
    showMessage("Não foram encontrados clientes com esse nome/cpf", "error");
  }
}

const expand = () => {
  isExpanded.value = true;
};

const collapse = () => {
  isExpanded.value = false;
};

const emit = defineEmits(["emptyCart", "save"]);

function emptyCart() {
  emit("emptyCart");
}

const save = () => {
  if (!props?.movies?.length) {
    showMessage("Nenhum filme selecionado", "error");
    return;
  }

  if (!selectedClient.value.id) {
    showMessage("Nenhum cliente selecionado", "error");
    return;
  }
  emit("save", {
    client: selectedClient.value.id,
    movies: props?.movies?.map((x) => x.imdbID),
    rentalDate: new Date().toISOString().split("T")[0],
    returnDate: null,
    userId: currentUser.value.id,
    status: "rented",
    clientName: selectedClient.value.name + " " + selectedClient.value.surname,
    movieNames: props?.movies?.map((x) => x.Title).join(", "),
    userName: currentUser.value.name,
  });

  emit("emptyCart");
  selectedClient.value = getDefaultClient();
  clientsFound.value = [];
};
</script>
