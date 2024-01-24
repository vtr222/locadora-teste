<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-16 h-full bg-white shadow-md">
      <div class="px-3 py-4">
        <ul class="space-y-2">
          <li>
            <NuxtLink to="/" title="Filmes">
              <Button isRound>🎬</Button>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/clients" title="Clientes">
              <Button isRound>👥</Button>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/users" title="Usuários">
              <Button isRound>👤</Button>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/rentals" title="Aluguéis">
              <Button isRound>🤝</Button>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </aside>

    <!-- Main container -->
    <div class="flex flex-col flex-1 min-h-screen">
      <!-- Header -->
      <header class="w-full bg-white shadow-md h-14">
        <div class="px-4 py-2 flex items-center w-full justify-between">
          <h1 class="text-xl font-semibold text-gray-800">
            <slot name="page-title"></slot>
          </h1>
          <div class="flex items-center space-x-4">
            <span>{{ currentUser?.name }}</span>
            <Button
              isRound
              @click="
                logoutUser();
                navigateTo('/login');
              "
              >🚪</Button
            >
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { logoutUser } from "~/services/authService";

const currentUser = ref(null);
onMounted(() => {
  currentUser.value = JSON.parse(localStorage.getItem("currentUser"));
});
</script>

<!-- Rest of the script and style -->
