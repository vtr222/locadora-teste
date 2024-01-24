<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import type { User } from "@/services/userService";
import type { Client } from "@/services/clientService";

onMounted(() => {
  //setup mock database
  if (!localStorage.getItem("users") && !localStorage.getItem("clients")) {
    const adminUser: User = {
      id: 1,
      name: "Admin",
      document: "123456789",
      password: "admin123",
      status: "active",
    };

    const sampleClients: Client[] = [
      {
        id: 1,
        name: "João",
        surname: "Silva",
        cpf: "123.456.789-09",
        contacts: { email: "joao.silva@example.com", phone: "(11) 98765-4321" },
        address: {
          zip: "01001-000",
          street: "Rua Haddock Lobo",
          neighborhood: "Centro",
          city: "São Paulo",
          state: "SP",
        },
        status: "active",
        locacaoAtiva: false,
      },
      {
        id: 2,
        name: "Ana",
        surname: "Oliveira",
        cpf: "987.654.321-00",
        contacts: {
          email: "ana.oliveira@example.com",
          phone: "(21) 12345-6789",
        },
        address: {
          zip: "20031-170",
          street: "Avenida Rio Branco",
          neighborhood: "Centro",
          city: "Rio de Janeiro",
          state: "RJ",
        },
        status: "active",
        locacaoAtiva: false,
      },
      {
        id: 3,
        name: "Carlos",
        surname: "Pereira",
        cpf: "456.123.789-10",
        contacts: {
          email: "carlos.pereira@example.com",
          phone: "(31) 99876-5432",
        },
        address: {
          zip: "30170-110",
          street: "Rua Goiás",
          neighborhood: "Funcionários",
          city: "Belo Horizonte",
          state: "MG",
        },
        status: "active",
        locacaoAtiva: false,
      },
    ];

    localStorage.setItem("users", JSON.stringify([adminUser]));
    localStorage.setItem("clients", JSON.stringify(sampleClients));
  }
});
</script>
