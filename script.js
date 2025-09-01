// Initialize the cart from localStorage or start with an empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to update the cart display (cart count and total)
function updateCart() {
  const cartCount = document.getElementById('cart-count');
  cartCount.innerText = cart.length;

  // Update cart in cart.html
  if (document.getElementById('cart-container')) {
    renderCart();
  }
}

// Function to render the cart items in the cart page
function renderCart() {
  const cartContainer = document.getElementById('cart-container');
  cartContainer.innerHTML = ''; // Clear the cart container before re-rendering

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  let total = 0;
  cart.forEach((item, index) => {
    // Example item structure: { id: 1, quantity: 1 }
    const product = products.find(p => p.id === item.id); // Find product details by ID

    total += product.price * item.quantity;

    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `
      <h3>${product.name}</h3>
      <p>Price: $${product.price}</p>
      <p>Quantity: <span id="quantity-${item.id}">${item.quantity}</span></p>
      <button class="inc" data-id="${item.id}">+</button>
      <button class="dec" data-id="${item.id}">-</button>
      <button class="remove" data-id="${item.id}">Remove</button>
    `;
    cartContainer.appendChild(cartItem);
  });

  // Display total price
  const totalPrice = document.getElementById('total-price');
  totalPrice.innerText = `Total: $${total.toFixed(2)}`;

  // Set up event listeners for increase, decrease, and remove buttons
  setupCartActions();
}

// Function to setup event listeners for cart actions
function setupCartActions() {
  // Increase quantity
  document.querySelectorAll('.inc').forEach(button => {
    button.addEventListener('click', (e) => {
      const productId = parseInt(e.target.getAttribute('data-id'));
      changeQuantity(productId, 1);
    });
  });

  // Decrease quantity
  document.querySelectorAll('.dec').forEach(button => {
    button.addEventListener('click', (e) => {
      const productId = parseInt(e.target.getAttribute('data-id'));
      changeQuantity(productId, -1);
    });
  });

  // Remove item
  document.querySelectorAll('.remove').forEach(button => {
    button.addEventListener('click', (e) => {
      const productId = parseInt(e.target.getAttribute('data-id'));
      removeFromCart(productId);
    });
  });
}

// Function to add a product to the cart
function addToCart(productId) {
  const existingProduct = cart.find(item => item.id === productId);
  if (existingProduct) {
    existingProduct.quantity += 1; // Increase quantity if product already in cart
  } else {
    const product = products.find(p => p.id === productId);
    cart.push({ id: product.id, quantity: 1 });
  }

  // Save the updated cart to localStorage and update the display
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCart();
}

// Function to change the quantity of a product in the cart (increase or decrease)
function changeQuantity(productId, change) {
  const product = cart.find(item => item.id === productId);
  if (product) {
    product.quantity += change;
    if (product.quantity <= 0) {
      removeFromCart(productId); // Remove item if quantity is 0 or less
    } else {
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCart();
    }
  }
}

// Function to remove a product from the cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCart();
}

// Define the products (you could get this from a backend or database)
const products = [
  { id: 1, name: "Red T-shirt", price: 19.99, image: "images/product1.jpg" },
  { id: 2, name: "Blue Jeans", price: 29.99, image: "images/product2.jpg" },
  // Add more products as needed
];

// Handle "Add to Cart" buttons on the home page (index.html)
document.querySelectorAll('.product button').forEach(button => {
  button.addEventListener('click', (e) => {
    const productId = parseInt(e.target.getAttribute('data-id'));
    addToCart(productId);
  });
});

// Initialize cart count on page load
updateCart();
