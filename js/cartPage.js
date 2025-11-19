import { getActiveUser } from "./auth.js";
import { 
    getGuestCart, 
    saveGuestCart, 
    getUserCart, 
    saveUserCart 
} from "./cart.js";

const cartList = document.getElementById("cartList");
const totalPriceSpan = document.getElementById("totalPrice");
const checkoutBtn = document.getElementById("checkoutBtn");

let currentCart = [];
let activeUser = getActiveUser();

function loadCart() {
    currentCart = activeUser 
        ? getUserCart(activeUser.id)
        : getGuestCart();

    renderCart();
}

function renderCart() {
    cartList.innerHTML = "";

    if (currentCart.length === 0) {
        cartList.innerHTML = `<p style="color:white;">Tu carrito está vacío.</p>`;
        totalPriceSpan.textContent = "0";
        return;
    }

    let total = 0;

    currentCart.forEach((item, index) => {
        total += item.price * item.quantity;

        const div = document.createElement("div");
        div.classList.add("productCard");
        div.style.background = "#111";
        div.style.marginBottom = "20px";

        div.innerHTML = `
            <div style="display:flex; gap:20px; align-items:center;">
                <img src="${item.image}" style="width:120px; border-radius:10px;">
                
                <div style="flex:1;">
                    <h3>${item.title}</h3>
                    <p>$${item.price}</p>

                    <div style="display:flex; align-items:center; gap:10px;">
                        <button class="qtyBtn" data-index="${index}" data-type="minus">−</button>
                        <span>${item.quantity}</span>
                        <button class="qtyBtn" data-index="${index}" data-type="plus">+</button>

                        <button class="removeBtn" data-index="${index}" 
                          style="margin-left:20px; color:red;">Eliminar</button>
                    </div>
                </div>
            </div>
        `;

        cartList.appendChild(div);
    });

    totalPriceSpan.textContent = total.toFixed(2);
}

function saveCart() {
    if (activeUser) saveUserCart(activeUser.id, currentCart);
    else saveGuestCart(currentCart);
}

cartList.addEventListener("click", (e) => {
    const index = e.target.dataset.index;

    if (e.target.classList.contains("qtyBtn")) {
        const type = e.target.dataset.type;

        if (type === "plus") currentCart[index].quantity++;
        if (type === "minus") currentCart[index].quantity = Math.max(1, currentCart[index].quantity - 1);

        saveCart();
        renderCart();
    }

    if (e.target.classList.contains("removeBtn")) {
        currentCart.splice(index, 1);
        saveCart();
        renderCart();
    }
});

checkoutBtn.addEventListener("click", async () => {
    if (!activeUser) {
        alert("Debes iniciar sesión para completar la compra.");
        return;
    }

    const date = new Date().toISOString().split("T")[0];

    // total
    const total = currentCart.reduce((acc, p) => acc + p.price * p.quantity, 0);

    // payload para FakeStore API
    const payload = {
        userId: activeUser.id,
        date,
        products: currentCart.map(item => ({
            productId: item.id,
            quantity: item.quantity
        }))
    };

    // POST real a la FakeStore API
    const res = await fetch("https://fakestoreapi.com/carts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    const data = await res.json(); // recibe un id generado por la API

    // 🔥 Guardar orden en localStorage en el usuario
    let users = JSON.parse(localStorage.getItem("users"));
    let u = users.find(x => x.id == activeUser.id);

    if (!u.orders) u.orders = [];

    u.orders.push({
        orderId: data.id,     // generado por API
        date,
        total: total.toFixed(2),
        items: currentCart     // productos del carrito
    });

    localStorage.setItem("users", JSON.stringify(users));

    // limpiar carrito
    currentCart = [];
    saveCart();
    renderCart();

    alert(`Compra registrada exitosamente. Orden #${data.id}`);
});


loadCart();

