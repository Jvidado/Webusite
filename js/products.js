import { fetchProducts } from "./api.js";

const productList = document.getElementById("productList");
const filterSelect = document.getElementById("categoryFilter");
const sortSelect = document.getElementById("sortSelect"); // ← NUEVO

let allProducts = [];
let filteredProducts = []; // ← productos después de filtrar

// 🔥 Render original (lo mantengo tal cual)
function renderProducts(products) {
  productList.innerHTML = "";

  products.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("productCard");

    card.innerHTML = `
      <a href="producto.html?id=${p.id}">
        <img src="${p.image}">
        <h3>${p.title}</h3>
        <p>${p.description.substring(0, 80)}...</p>
        <span class="price">$${p.price}</span>
      </a>
    `;

    productList.appendChild(card);
  });
}

// ===============================
//  CARGAR CATEGORÍAS
// ===============================
function loadCategories(products) {
  const categories = [...new Set(products.map(p => p.category))];

  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    filterSelect.appendChild(opt);
  });
}

// ===============================
//  ORDENAMIENTO
// ===============================
function sortProducts() {
  const val = sortSelect.value;

  if (val === "price-asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  }
  if (val === "price-desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }
  if (val === "name-asc") {
    filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
  }
  if (val === "name-desc") {
    filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
  }
}

// ===============================
//  APLICAR FILTRO + ORDEN
// ===============================
function applyFilters() {
  const category = filterSelect.value;

  if (category === "all") {
    filteredProducts = [...allProducts];
  } else {
    filteredProducts = allProducts.filter(p => p.category === category);
  }

  sortProducts();
  renderProducts(filteredProducts);
}

// ===============================
// EVENTOS
// ===============================

// Filtro categoría
filterSelect.addEventListener("change", applyFilters);

// Ordenamiento
sortSelect.addEventListener("change", applyFilters);

// ===============================
// CARGAR PRODUCTOS PRINCIPAL
// ===============================
async function loadProducts() {
  productList.innerHTML = `<p style="color:white;">Cargando productos...</p>`;

  allProducts = await fetchProducts();
  filteredProducts = [...allProducts];

  loadCategories(allProducts);
  renderProducts(filteredProducts);
}

loadProducts();
