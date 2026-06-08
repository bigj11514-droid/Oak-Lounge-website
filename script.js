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

  return `Hello Perissos Lounge, I would like to order ${quantity} x ${size} ${item}. Total: ${total}. Please confirm availability.`;
}

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
