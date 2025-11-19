import { loginUser } from "./auth.js";
import { mergeGuestCartToUser } from "./cart.js";

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const res = loginUser(email, password);

  if (!res.success) {
    alert(res.message);
    return;
  }

  // Fusión del carrito invitado → usuario
  mergeGuestCartToUser(res.user.id);

  alert("Bienvenido, " + res.user.name);
  window.location.href = "index.html";
});
