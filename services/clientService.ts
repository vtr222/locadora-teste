// server/services/clientService.ts

interface Contact {
  email: string;
  phone: string;
}

interface Address {
  zip: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface Client {
  id: number;
  name: string;
  surname: string;
  cpf: string;
  contacts: Contact;
  address: Address;
  status: "active" | "inactive";
  locacaoAtiva: boolean;
}

export const getDefaultClient = () => {
  return {
    id: 0,
    name: "",
    surname: "",
    cpf: "",
    contacts: {
      email: "",
      phone: "",
    },
    address: {
      zip: "",
      street: "",
      neighborhood: "",
      city: "",
      state: "",
    },
    status: "active",
    locacaoAtiva: false,
  } as Client;
};

export const getClientsForRental = (stringFilter: string) => {
  let clients = JSON.parse(localStorage.getItem("clients") || "[]");

  clients = clients.filter((client: Client) => {
    const fullName = (client.name + " " + client.surname).toLowerCase();
    const filterLower = stringFilter.toLowerCase();

    return (
      (fullName.includes(filterLower) || client.cpf.includes(stringFilter)) &&
      client.status === "active"
    );
  });

  return clients;
};

export const getClients = (
  filters = { name: "", cpf: "", status: "" }
): Client[] => {
  let clients = JSON.parse(localStorage.getItem("clients") || "[]");

  if (filters.name) {
    clients = clients.filter((client: Client) =>
      (client.name + " " + client.surname)
        .toLowerCase()
        .includes(filters.name.toLowerCase())
    );
  }

  if (filters.cpf) {
    clients = clients.filter((client: Client) =>
      client.cpf.includes(filters.cpf)
    );
  }

  if (filters.status && filters.status.toLowerCase() !== "todos") {
    clients = clients.filter(
      (client: Client) => client.status === filters.status
    );
  }

  return clients;
};

const saveClients = (clients: Client[]): void => {
  localStorage.setItem("clients", JSON.stringify(clients));
};

export const createClient = (client: Client): void => {
  const clients = getClients();
  client.id = Date.now();
  clients.push(client);
  saveClients(clients);
};

export const getClientById = (id: number): Client | undefined => {
  const clients = getClients();
  return clients.find((client) => client.id === id);
};

export const updateClient = (updatedClient: Client): void => {
  let clients = getClients();
  clients = clients.map((client) =>
    client.id === updatedClient.id ? updatedClient : client
  );
  saveClients(clients);
};

export const deactivateClient = (id: number): void => {
  const clients = getClients();
  const clientIndex = clients.findIndex((client) => client.id === id);
  if (clientIndex !== -1) {
    clients[clientIndex].status = "inactive";
    saveClients(clients);
  }
};

export const getAddressByCEP = async (cep: string) => {
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  if (!response.ok) {
    throw new Error("CEP not found");
  }
  return response.json();
};

export const clientService = {
  createClient,
  getClientById,
  updateClient,
  deactivateClient,
  getAddressByCEP,
  getClients,
};
