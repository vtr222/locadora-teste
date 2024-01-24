export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    if (to.path === "/login") {
      return;
    } else {
      const isLoggedIn = localStorage.getItem("currentUser") !== null;

      if (!isLoggedIn) {
        window.location.pathname = "/login";
      }
    }
  }
});
