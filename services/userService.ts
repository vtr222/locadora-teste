export interface User {
  id?: number;
  name: string;
  document: string;
  password: string;
  status: "active" | "inactive";
}

export const getDefaultUser = () => {
  return {
    id: 0,
    name: "",
    document: "",
    password: "",
    status: "active",
  } as User;
};

export const getUsers = (): User[] => {
  return JSON.parse(localStorage.getItem("users") || "[]");
};

const saveUsers = (users: User[]): void => {
  localStorage.setItem("users", JSON.stringify(users));
};

export const createUser = (user: User): void => {
  const users = getUsers();
  user.id = Date.now();
  users.push(user);
  saveUsers(users);
};

export const getUserById = (id: number): User | undefined => {
  const users = getUsers();
  return users.find((user) => user.id === id);
};

export const updateUser = (updatedUser: User): void => {
  let users = getUsers();
  users = users.map((user) =>
    user.id === updatedUser.id ? updatedUser : user
  );
  saveUsers(users);
};

export const deactivateUser = (id: number): void => {
  const users = getUsers();
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex !== -1) {
    users[userIndex].status = "inactive";
    saveUsers(users);
  }
};

export const userService = {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deactivateUser,
};
