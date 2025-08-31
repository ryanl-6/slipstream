function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '{}');
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId) {
  const cart = getCart();
  cart[productId] = (cart[productId] || 0) + 1;
  saveCart(cart);
}

function removeFromCart(productId) {
  const cart = getCart();
  delete cart[productId];
  saveCart(cart);
}

function incrementQuantity(productId) {
  addToCart(productId);
}

function decrementQuantity(productId) {
  const cart = getCart();
  if (cart[productId]) {
    cart[productId] -= 1;
    if (cart[productId] <= 0) {
      delete cart[productId];
    }
    saveCart(cart);
  }
}

function updateCartCount() {
  const cart = getCart();
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  document.getElementById('cart-count').textContent = count;
}
