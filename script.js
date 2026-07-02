const links = document.querySelectorAll('.main-nav a');

links.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const targetId = link.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

const orderItem = document.getElementById('orderItem');
const orderSize = document.getElementById('orderSize');
const orderQuantity = document.getElementById('orderQuantity');
const orderTotal = document.getElementById('orderTotal');
const whatsappButton = document.getElementById('whatsappButton');
const previewImage = document.getElementById('orderPreviewImage');
const previewTitle = document.getElementById('orderPreviewTitle');
const previewDescription = document.getElementById('orderPreviewDescription');
const previewPrice = document.querySelector('.order-preview-price');
const menuSearch = document.getElementById('menuSearch');
const menuFilter = document.getElementById('menuFilter');
const menuItemsContainer = document.getElementById('menuItems');
const menuEmpty = document.getElementById('menuEmpty');
const cartList = document.getElementById('cartList');
const cartTotal = document.getElementById('cartTotal');
const placeCartOrderButton = document.getElementById('placeCartOrderButton');
const reservationForm = document.getElementById('reservationForm');
const reservationName = document.getElementById('reservationName');
const reservationDate = document.getElementById('reservationDate');
const reservationTime = document.getElementById('reservationTime');
const reservationGuests = document.getElementById('reservationGuests');
const checkAvailabilityButton = document.getElementById('checkAvailabilityButton');
const tableCount = document.getElementById('tableCount');
const reservationFeedback = document.getElementById('reservationFeedback');
const whatsappPhone = '1234567890';

const menuData = [
  {
    id: 'fried-chips',
    category: 'food',
    name: 'Fried Chips',
    description: 'Chinese Yam, sliced piece meat, onions, seasoned pepper.',
    price: 50,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80',
    available: true,
  },
  {
    id: 'spicy-indomie',
    category: 'food',
    name: 'Spicy Indomie',
    description: 'Indomie, cured meats, olives, seasonal accoutrements.',
    price: 38,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80',
    available: false,
  },
  {
    id: 'charcuterie-share',
    category: 'food',
    name: 'Charcuterie Share',
    description: 'Assorted cured meats, cheeses, olives, and house pickles.',
    price: 68,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80',
    available: true,
  },
  {
    id: 'velvet-negroni',
    category: 'drinks',
    name: 'Velvet Negroni',
    description: 'Gin, vermouth, amaro, fresh citrus.',
    price: 55,
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80',
    available: true,
  },
  {
    id: 'old-fashioned',
    category: 'drinks',
    name: 'Old Fashioned',
    description: 'Bourbon, house bitters, candied orange, smoked cherry.',
    price: 52,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80',
    available: false,
  },
];

let cartItems = [];

function formatCurrency(value) {
  return `$${value.toFixed(2)}`;
}

function updateOrderTotal() {
  const basePrice = Number(orderItem.selectedOptions[0].dataset.price || 0);
  const sizeMultiplier = Number(orderSize.selectedOptions[0].dataset.multiplier || 1);
  const quantity = Number(orderQuantity.value || 1);
  const total = basePrice * sizeMultiplier * quantity;
  orderTotal.textContent = formatCurrency(total);
}

function updatePreview() {
  const selected = orderItem.selectedOptions[0];
  previewImage.src = selected.dataset.image;
  previewImage.alt = selected.value;
  previewTitle.textContent = selected.value;
  previewDescription.textContent = selected.dataset.description;
  previewPrice.textContent = `Starting at $${selected.dataset.price}`;
}

function getPaymentMethod() {
  const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked');
  return selectedPayment ? selectedPayment.value : 'Pay at lounge';
}

function buildOrderMessage() {
  const item = orderItem.value;
  const size = orderSize.value;
  const quantity = orderQuantity.value;
  const total = orderTotal.textContent;
  const payment = getPaymentMethod();

  return `Hello Oak Lounge, I would like to order ${quantity} x ${size} ${item}. Total: ${total}. Payment: ${payment}. Please confirm availability.`;
}

function filterMenuItems() {
  const search = menuSearch.value.trim().toLowerCase();
  const filter = menuFilter.value;

  return menuData.filter((menuItem) => {
    const matchesSearch =
      menuItem.name.toLowerCase().includes(search) ||
      menuItem.description.toLowerCase().includes(search) ||
      menuItem.category.toLowerCase().includes(search);

    const matchesFilter =
      filter === 'all' ||
      (filter === 'food' && menuItem.category === 'food') ||
      (filter === 'drinks' && menuItem.category === 'drinks') ||
      (filter === 'available' && menuItem.available) ||
      (filter === 'outofstock' && !menuItem.available);

    return matchesSearch && matchesFilter;
  });
}

function renderMenuItems() {
  const items = filterMenuItems();
  menuItemsContainer.innerHTML = '';

  if (!items.length) {
    menuEmpty.style.display = 'block';
    return;
  }

  menuEmpty.style.display = 'none';

  items.forEach((menuItem) => {
    const card = document.createElement('article');
    card.className = 'menu-card';
    card.innerHTML = `
      <img src="${menuItem.image}" alt="${menuItem.name}" />
      <div class="menu-card-body">
        <div class="menu-card-header">
          <h4>${menuItem.name}</h4>
          <span class="menu-price">${menuItem.price}gh</span>
        </div>
        <p>${menuItem.description}</p>
        <div class="menu-card-meta">
          <span>${menuItem.category.toUpperCase()}</span>
          <span class="menu-status ${menuItem.available ? 'available' : 'out-of-stock'}">
            ${menuItem.available ? 'Available' : 'Out of Stock'}
          </span>
        </div>
        <button type="button" class="btn btn-secondary menu-add-button" data-id="${menuItem.id}" ${menuItem.available ? '' : 'disabled'}>
          ${menuItem.available ? 'Add to Cart' : 'Unavailable'}
        </button>
      </div>
    `;
    menuItemsContainer.appendChild(card);
  });
}

function updateCartDisplay() {
  cartList.innerHTML = '';

  if (!cartItems.length) {
    cartList.innerHTML = '<p class="menu-empty">Your cart is empty. Add items from the Digital Menu.</p>';
    cartTotal.textContent = '$0.00';
    return;
  }

  cartItems.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div>
        <strong>${item.name}</strong>
        <span>${item.quantity} x ${item.price}gh</span>
      </div>
      <button type="button" class="btn btn-secondary cart-remove-button" data-id="${item.id}">
        Remove
      </button>
    `;
    cartList.appendChild(row);
  });

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotal.textContent = `$${totalAmount.toFixed(2)}`;
}

function addItemToCart(itemId) {
  const menuItem = menuData.find((item) => item.id === itemId);
  if (!menuItem || !menuItem.available) {
    return;
  }

  const cartItem = cartItems.find((item) => item.id === itemId);
  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cartItems.push({ id: menuItem.id, name: menuItem.name, price: menuItem.price, quantity: 1 });
  }

  updateCartDisplay();
}

function removeItemFromCart(itemId) {
  cartItems = cartItems.filter((item) => item.id !== itemId);
  updateCartDisplay();
}

function buildCartOrderMessage() {
  if (!cartItems.length) {
    return '';
  }

  const payment = getPaymentMethod();
  const items = cartItems
    .map((item) => `${item.quantity} x ${item.name}`)
    .join(', ');
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return `Hello Oak Lounge, I would like to place a cart order: ${items}. Total: $${totalAmount.toFixed(2)}. Payment: ${payment}. Please confirm order and pick-up details.`;
}

function formatReservationDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function showReservationStatus(message, type = 'success') {
  reservationFeedback.textContent = message;
  reservationFeedback.className = type;
}

function getAvailableTables() {
  const guests = Number(reservationGuests.value || 1);
  const base = 5;
  const reserved = Math.max(0, Math.ceil((guests - 2) / 2));
  return Math.max(0, base - reserved);
}

checkAvailabilityButton.addEventListener('click', () => {
  const available = getAvailableTables();
  tableCount.textContent = `Tables available: ${available}`;
  showReservationStatus(`Select your preferred date and time, then book online.`, 'success');
});

reservationForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = reservationName.value.trim();
  const date = reservationDate.value;
  const time = reservationTime.value;
  const guests = reservationGuests.value;
  const available = getAvailableTables();

  if (!name || !date || !time || !guests) {
    showReservationStatus('Please complete every field before booking.', 'error');
    return;
  }

  if (available === 0) {
    showReservationStatus('No tables are available at this time. Please choose another slot.', 'error');
    return;
  }

  showReservationStatus(`Confirmed! ${name}, your table for ${guests} at ${formatReservationDate(date)} ${time} is reserved.`, 'success');
});

whatsappButton.addEventListener('click', () => {
  updateOrderTotal();
  const message = encodeURIComponent(buildOrderMessage());
  const url = `https://wa.me/${whatsappPhone}?text=${message}`;
  window.open(url, '_blank');
});

menuSearch.addEventListener('input', renderMenuItems);
menuFilter.addEventListener('change', renderMenuItems);
menuItemsContainer.addEventListener('click', (event) => {
  const button = event.target.closest('.menu-add-button');
  if (!button) return;
  const itemId = button.dataset.id;
  addItemToCart(itemId);
});

cartList.addEventListener('click', (event) => {
  const button = event.target.closest('.cart-remove-button');
  if (!button) return;
  const itemId = button.dataset.id;
  removeItemFromCart(itemId);
});

placeCartOrderButton.addEventListener('click', () => {
  if (!cartItems.length) {
    alert('Your cart is empty. Add items from the Digital Menu first.');
    return;
  }

  const message = encodeURIComponent(buildCartOrderMessage());
  const url = `https://wa.me/${whatsappPhone}?text=${message}`;
  window.open(url, '_blank');
});

[orderItem, orderSize, orderQuantity].forEach((input) => {
  input.addEventListener('change', () => {
    updateOrderTotal();
    updatePreview();
  });
});

renderMenuItems();
updateCartDisplay();
updateOrderTotal();
updatePreview();
