let cart = [];

// --- Toast ---
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

// --- Actualizar contador ---
function updateCartCounter() {
  document.getElementById("cart-counter").textContent = cart.length;
}

// --- Renderizar carrito ---
function renderCart() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  cartItems.innerHTML = "";

  let total = 0;
  cart.forEach((item, index) => {
    total += item.price;
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} - $${item.price.toFixed(2)}
      <button class="btn-remove" data-index="${index}">❌</button>
    `;
    cartItems.appendChild(li);
  });

  cartTotal.innerHTML = `<strong>Total:</strong> $${total.toFixed(2)}`;

  // Eliminar producto
  document.querySelectorAll(".btn-remove").forEach(btn => {
    btn.addEventListener("click", e => {
      const idx = e.target.dataset.index;
      cart.splice(idx, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCounter();
      renderCart();
    });
  });
}

// --- Agregar producto ---
function addToCart(product) {
  cart.push(product);
  updateCartCounter();
  renderCart();
  showToast(`${product.name} agregado al carrito`);
  localStorage.setItem("cart", JSON.stringify(cart));
}

// --- Modal ---
const cartModal = document.getElementById("cart-modal");
document.getElementById("open-cart").addEventListener("click", () => {
  cartModal.style.display = "block";
  renderCart();
});
document.getElementById("close-cart").addEventListener("click", () => {
  cartModal.style.display = "none";
});
document.getElementById("checkout-btn").addEventListener("click", () => {
  showToast("Compra finalizada (demo)");
  cart = [];
  localStorage.removeItem("cart");
  updateCartCounter();
  renderCart();
  cartModal.style.display = "none";
});

// --- Cargar productos ---
fetch("/api/products")
  .then(res => res.json())
  .then(products => {
    const container = document.getElementById("products");

    products.forEach(p => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${p.image}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p class="price">$${p.price}</p>
        <button class="btn">Agregar al carrito</button>
      `;
      card.querySelector(".btn").addEventListener("click", () => addToCart(p));
      container.appendChild(card);
    });

    // Recuperar carrito guardado
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = savedCart;
    updateCartCounter();
  })
  .catch(err => console.error("Error cargando productos:", err));
