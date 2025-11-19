import { getActiveUser, logout } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("navLinks");

  if (!nav) {
    console.error("navLinks no encontrado");
    return;
  }

  // Limpia elementos dinámicos previos
  nav.querySelectorAll("#loginLink, #logoutBtn, #ordersLink, #cartLink").forEach(el => el.remove());

  const user = getActiveUser();

  // Agregar Carrito (para todos)
  nav.innerHTML += `
    <h3 id="cartLink"><a href="cart.html">Carrito</a></h3>
  `;

  if (!user) {
    // Usuario invitado
    nav.innerHTML += `
      <h3 id="loginLink"><a href="login.html">Login</a></h3>
    `;
  } else {
    // Usuario logueado
    nav.innerHTML += `
      <h3 id="ordersLink"><a href="orders.html">Ordenes</a></h3>
      <h3>Hola, ${user.name}</h3>
      <h3 id="logoutBtn" style="cursor:pointer; color:red;">Logout</h3>
    `;

    document.getElementById("logoutBtn").addEventListener("click", () => {
      logout();
      window.location.href = "index.html";
    });
  }
});


