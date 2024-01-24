export const loginUser = (username: string, password: string): boolean => {
  const users = JSON.parse(localStorage.getItem("users") || "[]");

  const foundUser = users.find(
    (user: any) => user.name === username && user.password === password
  );

  if (foundUser && foundUser.status === "active") {
    localStorage.setItem("currentUser", JSON.stringify(foundUser));
    return true;
  }

  return false;
};

export const logoutUser = (): void => {
  localStorage.removeItem("currentUser");
};

export const isUserLoggedIn = (): boolean => {
  return !!localStorage.getItem("currentUser");
};

export const getCurrentUser = (): any => {
  const currentUser = localStorage.getItem("currentUser");
  return currentUser ? JSON.parse(currentUser) : null;
};
