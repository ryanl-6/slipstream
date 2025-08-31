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



// Check if user is logged in on page load
window.onload = function() {
  checkLoginStatus();
};

// Check if the user is logged in
function checkLoginStatus() {
  const user = JSON.parse(localStorage.getItem('user'));
  const loginLinks = document.querySelectorAll('.login-link');
  const profileLinks = document.querySelectorAll('.profile-link');
  
  if (user) {
    // If the user is logged in, show profile link and hide login/register links
    loginLinks.forEach(link => link.style.display = 'none');
    profileLinks.forEach(link => link.style.display = 'inline-block');
  } else {
    // If no user, show login/register links and hide profile link
    loginLinks.forEach(link => link.style.display = 'inline-block');
    profileLinks.forEach(link => link.style.display = 'none');
  }
}

// Registration Logic
document.getElementById('register-form')?.addEventListener('submit', function(event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (localStorage.getItem('users')) {
    const users = JSON.parse(localStorage.getItem('users'));
    // Check if username already exists
    if (users.find(user => user.username === username)) {
      alert('Username already exists!');
      return;
    }
  } else {
    localStorage.setItem('users', JSON.stringify([]));
  }

  const newUser = { username, email, password };
  const users = JSON.parse(localStorage.getItem('users'));
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));

  alert('Registration successful!');
  window.location.href = 'login.html'; // Redirect to login page
});

// Login Logic
document.getElementById('login-form')?.addEventListener('submit', function(event) {
  event.preventDefault();

  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  const users = JSON.parse(localStorage.getItem('users')) || [];

  const user = users.find(user => user.username === username && user.password === password);

  if (user) {
    localStorage.setItem('user', JSON.stringify(user)); // Save user data in localStorage
    window.location.href = 'profile.html'; // Redirect to profile page
  } else {
    alert('Invalid username or password!');
  }
});

// Profile Logic
document.getElementById('profile-form')?.addEventListener('submit', function(event) {
  event.preventDefault();

  const user = JSON.parse(localStorage.getItem('user'));
  const updatedEmail = document.getElementById('profile-email').value;
  const updatedPassword = document.getElementById('profile-password').value;

  user.email = updatedEmail || user.email;
  user.password = updatedPassword || user.password;

  localStorage.setItem('user', JSON.stringify(user));
  alert('Profile updated successfully!');
});

// Populate profile page with user data
function loadProfile() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    document.getElementById('profile-username').value = user.username;
    document.getElementById('profile-email').value = user.email;
  } else {
    window.location.href = 'login.html'; // If no user, redirect to login page
  }
}

loadProfile(); // Call on page load

// Logout Logic
document.getElementById('logout-button')?.addEventListener('click', function() {
  localStorage.removeItem('user');
  window.location.href = 'index.html'; // Redirect to home page
});
