// --- USERS LOCAL STORAGE ---
// Estructura:
// users = [{ id, name, email, password, cart: [] }]
//

function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

export function getActiveUser() {
  const id = localStorage.getItem("activeUser");
  if (!id) return null;

  const users = getUsers();
  return users.find(u => u.id == id) || null;
}

export function logout() {
  localStorage.removeItem("activeUser");
}


// --- REGISTER ---
export function registerUser(name, email, password) {
  const users = getUsers();

  // evitar duplicados
  if (users.some(u => u.email === email)) {
    return { success: false, message: "El correo ya está registrado" };
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    cart: []
  };

  users.push(newUser);
  saveUsers(users);

  return { success: true, message: "Usuario registrado con éxito" };
}


// --- LOGIN ---
export function loginUser(email, password) {
  const users = getUsers();

  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return { success: false, message: "Credenciales incorrectas" };
  }

  // Establece sesión
  localStorage.setItem("activeUser", user.id);

  return { success: true, user };
}
