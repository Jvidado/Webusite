import { getActiveUser } from "./auth.js";

function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// CARRITO INVITADO
export function getGuestCart() {
  return JSON.parse(localStorage.getItem("cartGuest")) || [];
}

export function saveGuestCart(cart) {
  localStorage.setItem("cartGuest", JSON.stringify(cart));
}


// CARRITO DE USUARIO
export function getUserCart(userId) {
  const users = getUsers();
  const user = users.find(u => u.id == userId);

  return user?.cart || [];
}

export function saveUserCart(userId, cart) {
  const users = getUsers();
  const user = users.find(u => u.id == userId);

  user.cart = cart;
  saveUsers(users);
}


// AGREGAR AL CARRITO
export function addToCart(product) {
  const user = getActiveUser();

  if (!user) {
    // Invitado
    let cart = getGuestCart();

    const found = cart.find(p => p.id === product.id);
    if (found) found.quantity++;
    else cart.push({ ...product, quantity: 1 });

    saveGuestCart(cart);
    alert("Producto agregado (invitado)");
    return;
  }

  // Usuario logueado
  let cart = getUserCart(user.id);
  const found = cart.find(p => p.id === product.id);

  if (found) found.quantity++;
  else cart.push({ ...product, quantity: 1 });

  saveUserCart(user.id, cart);
  alert("Producto agregado a tu cuenta");
}


// FUSION CUANDO INICIA SESIÓN
export function mergeGuestCartToUser(userId) {
  const guest = getGuestCart();
  const userCart = getUserCart(userId);

  guest.forEach(item => {
    const found = userCart.find(u => u.id === item.id);
    if (found) found.quantity += item.quantity;
    else userCart.push(item);
  });

  saveUserCart(userId, userCart);
  localStorage.removeItem("cartGuest");
}
