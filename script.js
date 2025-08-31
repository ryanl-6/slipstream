// ---------- PRODUCTS ----------
const products = [
  { id: 1, name: "Red T-shirt", price: 19.99, image: "images/product1.jpg" },
  { id: 2, name: "Blue Jeans", price: 29.99, image: "images/product2.jpg" },
  // Add more products as needed
];

// ---------- CART LOGIC ----------
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCart() {
  const cartCount = document.getElementById('cart-count');
  if (cartCount) cartCount.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (document.getElementById('cart-container')) {
    renderCart();
  }
}

function addToCart(productId) {
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCart();
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
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCart();
}

function renderCart() {
  const container = document.getElementById('cart-container');
  container.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    container.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }

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

  let totalDiv = document.getElementById('total-price');
  if (!totalDiv) {
    totalDiv = document.createElement('div');
    totalDiv.id = 'total-price';
    container.appendChild(totalDiv);
  }
  totalDiv.innerText = `Total: $${total.toFixed(2)}`;

  setupCartActions();
}

function setupCartActions() {
  document.querySelectorAll('.inc').forEach(btn =>
    btn.addEventListener('click', e => changeQuantity(parseInt(e.target.dataset.id), 1)));

  document.querySelectorAll('.dec').forEach(btn =>
    btn.addEventListener('click', e => changeQuantity(parseInt(e.target.dataset.id), -1)));

  document.querySelectorAll('.remove').forEach(btn =>
    btn.addEventListener('click', e => removeFromCart(parseInt(e.target.dataset.id))));
}

// ---------- USER AUTH / PROFILE LOGIC ----------
function checkLoginStatus() {
  const user = JSON.parse(localStorage.getItem('user'));
  const loginLinks = document.querySelectorAll('.login-link');
  const profileLinks = document.querySelectorAll('.profile-link');

  loginLinks.forEach(link => link.style.display = user ? 'none' : 'inline-block');
  profileLinks.forEach(link => link.style.display = user ? 'inline-block' : 'none');
}

function loadProfile() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  document.getElementById('profile-username').value = user.username;
  document.getElementById('profile-email').value = user.email;
}

// ---------- INITIALIZATION ----------
window.addEventListener('DOMContentLoaded', () => {
  updateCart();
  checkLoginStatus();
  loadProfile();

  // Attach addToCart handlers if on index.html
  document.querySelectorAll('.product button[data-id]').forEach(button => {
    button.addEventListener('click', e => {
      const id = parseInt(e.target.dataset.id);
      addToCart(id);
    });
  });

  // Attach register form listener if present
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', e => {
      e.preventDefault();

      const username = document.getElementById('username').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();

      const users = JSON.parse(localStorage.getItem('users')) || [];

      if (users.find(u => u.username === username)) {
        alert('Username already exists!');
        return;
      }

      const newUser = { username, email, password };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      alert('Registration successful!');
      window.location.href = 'login.html';
    });
  }

  // Attach login form listener if present
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();

      const username = document.getElementById('login-username').value.trim();
      const password = document.getElementById('login-password').value.trim();
      const users = JSON.parse(localStorage.getItem('users')) || [];

      const found = users.find(u => u.username === username && u.password === password);
      if (found) {
        localStorage.setItem('user', JSON.stringify(found));
        window.location.href = 'profile.html';
      } else {
        alert('Invalid login.');
      }
    });
  }

  // Attach logout button listener if present
  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('user');
      window.location.href = 'index.html';
    });
  }

  // Attach profile form listener if present
  const profileForm = document.getElementById('profile-form');
  if (profileForm) {
    profileForm.addEventListener('submit', e => {
      e.preventDefault();
      const user = JSON.parse(localStorage.getItem('user'));
      const updatedEmail = document.getElementById('profile-email').value.trim();
      const updatedPassword = document.getElementById('profile-password').value.trim();

      const users = JSON.parse(localStorage.getItem('users')) || [];

      const currentUserIndex = users.findIndex(u => u.username === user.username);
      if (currentUserIndex !== -1) {
        users[currentUserIndex].email = updatedEmail || users[currentUserIndex].email;
        if (updatedPassword) {
          users[currentUserIndex].password = updatedPassword;
        }

        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('user', JSON.stringify(users[currentUserIndex]));
        alert('Profile updated!');
      }
    });
  }
});
