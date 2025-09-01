// ---------- PRODUCTS ----------
const products = [
  { id: 1, name: "Red T-shirt", price: 19.99, image: "images/product1.jpg" },
  { id: 2, name: "Blue Jeans", price: 29.99, image: "images/product2.jpg" },
];

// ---------- CART ----------
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCart() {
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  const container = document.getElementById('cart-container');
  if (container) {
    renderCart(container);
  }
}

function renderCart(container) {
  container.innerHTML = '';
  if (cart.length === 0) {
    container.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }

  let total = 0;
  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    total += product.price * item.quantity;

    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <h3>${product.name}</h3>
      <p>Price: $${product.price}</p>
      <p>Quantity: ${item.quantity}</p>
      <button class="inc" data-id="${item.id}">+</button>
      <button class="dec" data-id="${item.id}">-</button>
      <button class="remove" data-id="${item.id}">Remove</button>
    `;
    container.appendChild(div);
  });

  const totalDiv = document.createElement('div');
  totalDiv.id = 'total-price';
  totalDiv.textContent = `Total: $${total.toFixed(2)}`;
  container.appendChild(totalDiv);

  setupCartActions();
}

function setupCartActions() {
  document.querySelectorAll('.inc').forEach(btn =>
    btn.addEventListener('click', e => {
      const id = parseInt(e.target.dataset.id);
      changeQuantity(id, 1);
    })
  );

  document.querySelectorAll('.dec').forEach(btn =>
    btn.addEventListener('click', e => {
      const id = parseInt(e.target.dataset.id);
      changeQuantity(id, -1);
    })
  );

  document.querySelectorAll('.remove').forEach(btn =>
    btn.addEventListener('click', e => {
      const id = parseInt(e.target.dataset.id);
      removeFromCart(id);
    })
  );
}

function addToCart(productId) {
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCart();
  alert('Item added to cart!');
}

function changeQuantity(productId, change) {
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      cart = cart.filter(i => i.id !== productId);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
  }
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCart();
}

// ---------- INIT ----------
window.addEventListener('DOMContentLoaded', () => {
  updateCart();

  // Add-to-cart buttons (on index.html)
  document.querySelectorAll('.product button[data-id]').forEach(button => {
    button.addEventListener('click', e => {
      const id = parseInt(e.target.dataset.id);
      addToCart(id);
    });
  });
});
