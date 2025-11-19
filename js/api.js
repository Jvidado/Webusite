// js/api.js

export async function fetchProducts() {
  try {
    const res = await fetch("https://fakestoreapi.com/products");
    return await res.json();
  } catch (error) {
    console.error("Error cargando productos:", error);
    return [];
  }
}

export async function fetchCategories() {
  try {
    const res = await fetch("https://fakestoreapi.com/products/categories");
    return await res.json();
  } catch (error) {
    console.error("Error cargando categorías:", error);
    return [];
  }
}
