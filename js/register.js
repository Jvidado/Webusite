import { registerUser } from "./auth.js";

document.getElementById("registerForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const result = registerUser(name, email, password);

  alert(result.message);

  if (result.success) {
    window.location.href = "login.html";
  }
});
