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
const reservationForm = document.getElementById('reservationForm');
const reservationName = document.getElementById('reservationName');
const reservationDate = document.getElementById('reservationDate');
const reservationTime = document.getElementById('reservationTime');
const reservationGuests = document.getElementById('reservationGuests');
const checkAvailabilityButton = document.getElementById('checkAvailabilityButton');
const tableCount = document.getElementById('tableCount');
const reservationFeedback = document.getElementById('reservationFeedback');
const whatsappPhone = '1234567890';

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

function buildOrderMessage() {
  const item = orderItem.value;
  const size = orderSize.value;
  const quantity = orderQuantity.value;
  const total = orderTotal.textContent;

  return `Hello Oak Lounge, I would like to order ${quantity} x ${size} ${item}. Total: ${total}. Please confirm availability.`;
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

[orderItem, orderSize, orderQuantity].forEach((input) => {
  input.addEventListener('change', () => {
    updateOrderTotal();
    updatePreview();
  });
});

updateOrderTotal();
updatePreview();
