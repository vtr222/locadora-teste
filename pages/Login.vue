<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="max-w-md w-full space-y-8 p-10 bg-white shadow-lg rounded-lg">
      <div class="flex justify-center">
        <img class="h-12 w-auto" src="/logo.png" alt="Your Logo" />
      </div>
      <div class="mt-8 space-y-6">
        <TextInput
          label="Username"
          placeholder="Enter your username"
          v-model="username"
        />
        <TextInput
          v-model="password"
          label="Password"
          placeholder="Enter your password"
          type="password"
        />
        <div>
          <Button class="w-full" @click="doLogin">Login</Button>
        </div>
      </div>
    </div>
    <Alert />
  </div>
</template>

<script setup lang="jsx">
import { loginUser, logoutUser } from "~/services/authService";
import { useAlertMessage } from "~/composables/useAlert";
const { showMessage } = useAlertMessage();
definePageMeta({
  layout: false,
});

import { ref } from "vue";

const username = ref("");
const password = ref("");

onMounted(() => {
  logoutUser();
});

const doLogin = () => {
  const success = loginUser(username.value, password.value);
  if (!success) {
    showMessage("Login ou senha incorretos", "error");
  } else {
    navigateTo("/");
  }
};
</script>

<style>
/* Additional styles if needed */
</style>
