import { fetchProducts } from "./api.js";
import { addToCart } from "./cart.js";

const container = document.getElementById("productDetailContainer");

// Obtener ID del producto desde la URL
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

async function loadProductDetail() {
  const products = await fetchProducts();
  const product = products.find(p => p.id == productId);

  if (!product) {
    container.innerHTML = `<p style="color:white;">Producto no encontrado.</p>`;
    return;
  }

  container.innerHTML = `
    <div class="productImage">
      <img src="${product.image}" alt="${product.title}">
    </div>

    <div class="productInfo">
      <h1>${product.title}</h1>
      <p class="price">$${product.price}</p>
      <p class="description">${product.description}</p>

      <button id="addToCartBtn" class="addToCart">Agregar al carrito</button>

      <a href="products.html" class="backButton">← Volver a productos</a>
    </div>
  `;

  // Evento correcto que usa el carrito real
  document.getElementById("addToCartBtn").addEventListener("click", () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image
    });
  });
}

loadProductDetail();
