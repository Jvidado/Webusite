import { getActiveUser } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const user = getActiveUser();

  if (!user) {
    alert("Inicia sesión para ver tus ordenes");
    window.location.href = "login.html";
    return;
  }

  const users = JSON.parse(localStorage.getItem("users"));
  const u = users.find(x => x.id == user.id);

  const ordersList = document.getElementById("ordersList");

  if (!u.orders || u.orders.length === 0) {
    ordersList.innerHTML = "<p>No tienes órdenes todavia.</p>";
    return;
  }

  u.orders.forEach(order => {
    ordersList.innerHTML += `
      <div class="orderCard">
        <h3>Orden #${order.orderId}</h3>
        <p>Fecha: ${order.date}</p>
        <p>Total: $${order.total}</p>
        <h4>Productos:</h4>
        <ul>
          ${order.items.map(i => `<li>${i.title} (x${i.quantity})</li>`).join("")}
        </ul>
        <hr>
      </div>
    `;
  });
});
