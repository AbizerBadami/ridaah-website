// ============================================================
// main.js – Shared utilities: nav, cart state, toast, guards
// ============================================================

// ────────────────────────────────────────────────────────────
// Cart (localStorage-backed)
// ────────────────────────────────────────────────────────────
const Cart = {
  _key: 'ridah_cart',
  get: () => JSON.parse(localStorage.getItem('ridah_cart') || '[]'),
  save: (items) => localStorage.setItem('ridah_cart', JSON.stringify(items)),
  count: () => Cart.get().reduce((s, i) => s + i.qty, 0),

  add(productId, qty = 1, size = null, customOrderId = null, meta = {}) {
    const items = Cart.get();
    const key = customOrderId ? `custom_${customOrderId}` : `${productId}_${size}`;
    const existing = items.find(i => i._key === key);
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({ _key: key, productId, qty, size, customOrderId, ...meta });
    }
    Cart.save(items);
    Cart.updateBadge();
    Toast.show('Added to cart', 'success');
  },

  update(key, qty) {
    const items = Cart.get().map(i => i._key === key ? { ...i, qty } : i).filter(i => i.qty > 0);
    Cart.save(items);
    Cart.updateBadge();
  },

  remove(key) {
    Cart.save(Cart.get().filter(i => i._key !== key));
    Cart.updateBadge();
  },

  clear() {
    localStorage.removeItem('ridah_cart');
    Cart.updateBadge();
  },

  updateBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
      const c = Cart.count();
      badge.textContent = c;
      badge.style.display = c > 0 ? 'flex' : 'none';
    }
  }
};

// ────────────────────────────────────────────────────────────
// Toast notifications
// ────────────────────────────────────────────────────────────
const Toast = {
  container: null,

  init() {
    if (this.container) return;
    this.container = document.createElement('div');
    this.container.id = 'toast-container';
    document.body.appendChild(this.container);
  },

  show(msg, type = 'info', duration = 3000) {
    this.init();
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    t.innerHTML = `<span>${msg}</span><button onclick="this.parentElement.remove()">✕</button>`;
    this.container.appendChild(t);
    setTimeout(() => { t.classList.add('toast-show'); }, 10);
    setTimeout(() => { t.classList.remove('toast-show'); setTimeout(() => t.remove(), 300); }, duration);
  }
};

// ────────────────────────────────────────────────────────────
// Auth guard – call on protected pages
// ────────────────────────────────────────────────────────────
function requireAuth() {
  if (!Auth.isLoggedIn()) {
    window.location.href = '/login.html?redirect=' + encodeURIComponent(location.pathname + location.search);
    return false;
  }
  return true;
}

// ────────────────────────────────────────────────────────────
// Inject shared header
// ────────────────────────────────────────────────────────────
function injectHeader() {
  const el = document.getElementById('site-header');
  if (!el) return;
  const isLoggedIn = Auth.isLoggedIn();
  const user = Auth.getUser();
  el.innerHTML = `
    <nav class="navbar">
      <a href="/index.html" class="nav-logo">
        <span class="logo-text">Ridah</span>
        <span class="logo-sub">رداء</span>
      </a>
      <button class="nav-burger" id="nav-burger" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>
      <ul class="nav-links" id="nav-links">
        <li><a href="/index.html">Home</a></li>
        <li><a href="/products.html">Shop</a></li>
        <li><a href="/custom-rida.html">Custom Rida</a></li>
        <li><a href="/chat.html">Support</a></li>
        ${isLoggedIn
          ? `<li><a href="/profile.html">👤 ${user?.name?.split(' ')[0] || 'Account'}</a></li>
             <li><a href="#" onclick="Auth.logout()">Sign Out</a></li>`
          : `<li><a href="/login.html">Sign In</a></li>
             <li><a href="/signup.html" class="btn-nav-cta">Join</a></li>`
        }
        <li>
          <a href="/cart.html" class="cart-icon-wrap">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            <span class="cart-badge" id="cart-badge" style="display:none">0</span>
          </a>
        </li>
      </ul>
    </nav>`;

  document.getElementById('nav-burger')?.addEventListener('click', () => {
    document.getElementById('nav-links')?.classList.toggle('open');
  });

  Cart.updateBadge();
}

// ────────────────────────────────────────────────────────────
// Inject shared footer
// ────────────────────────────────────────────────────────────
function injectFooter() {
  const el = document.getElementById('site-footer');
  if (!el) return;
  el.innerHTML = `
    <div class="footer-inner">
      <div class="footer-brand">
        <span class="logo-text">Ridah</span>
        <p>Elegant traditional attire for the Dawoodi Bohra woman. Crafted with devotion.</p>
      </div>
      <div class="footer-links">
        <h4>Shop</h4>
        <ul>
          <li><a href="/products.html">All Products</a></li>
          <li><a href="/custom-rida.html">Custom Rida</a></li>
          <li><a href="/products.html?category=new">New Arrivals</a></li>
        </ul>
      </div>
      <div class="footer-links">
        <h4>Help</h4>
        <ul>
          <li><a href="/chat.html">Contact Us</a></li>
          <li><a href="/order-tracking.html">Track Order</a></li>
          <li><a href="/profile.html">My Orders</a></li>
        </ul>
      </div>
      <div class="footer-links">
        <h4>Connect</h4>
        <ul>
          <li><a href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank">WhatsApp</a></li>
          <li><a href="mailto:hello@ridah.com">Email Us</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© ${new Date().getFullYear()} Ridah. All rights reserved.</p>
    </div>`;
}

// ────────────────────────────────────────────────────────────
// Spinner helpers
// ────────────────────────────────────────────────────────────
function showSpinner(containerId) {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = '<div class="spinner"></div>';
}

function showError(containerId, msg = 'Something went wrong. Please try again.') {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = `<div class="error-state"><p>${msg}</p></div>`;
}

// ────────────────────────────────────────────────────────────
// Utility: format currency
// ────────────────────────────────────────────────────────────
function formatPrice(amount, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

// ────────────────────────────────────────────────────────────
// Utility: URL params
// ────────────────────────────────────────────────────────────
function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

// ────────────────────────────────────────────────────────────
// Init on every page
// ────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  injectHeader();
  injectFooter();
});
