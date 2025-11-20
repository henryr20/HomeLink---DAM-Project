//-------------------------//
// PARALLAX
//-------------------------//

document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".section-tone");

  function parallax() {
    const scroll = window.scrollY;

    sections.forEach(section => {
      const speed = -0.2;
      const offset = scroll * speed;

      section.style.backgroundPosition = `center ${offset}px`;
    });
  }

  window.addEventListener("scroll", parallax);
  parallax();

  // --------------------------//
  // INITIALIZATION
  // --------------------------//
  renderDeviceList();
  renderUserDeviceList();
  renderSummary();

  const deviceForm = document.getElementById("device-form");
  if (deviceForm) {
    deviceForm.addEventListener("submit", handleDeviceFormSubmit);
  }

  const yearSpan = document.getElementById("current-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  const btn = document.getElementById('dropdown-button');
  const menu = document.getElementById('mobile-nav');

  btn.addEventListener('click', () => {
    menu.classList.toggle('is-open');
  });

  initGalleryLightbox();

});

//-------------------------//
// UTILITIES
//-------------------------//

// RESET
function formatPriceUSD(value) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD"
  });
}

// LABELS
const categoryLabels = {
  lighting: "Lighting",
  energy: "Energy",
  security: "Security",
  comfort: "Comfort"
};

//-------------------------//
// TRENDING (READ)
//-------------------------//

const trendingProducts = [
  {
    id: 1,
    name: "White & Color Smart Bulb",
    brand: "Philips",
    room: "Living Room",
    category: "lighting",
    price: 49.99
  },
  {
    id: 2,
    name: "Lightstrip Plus LED Strip",
    brand: "Philips",
    room: "Bedroom",
    category: "lighting",
    price: 79.99
  },
  {
    id: 3,
    name: "Smart Thermostat",
    brand: "Tado",
    room: "Living Room",
    category: "energy",
    price: 199.0
  },
  {
    id: 4,
    name: "WiFi Smart Plug",
    brand: "TP-Link",
    room: "Kitchen",
    category: "energy",
    price: 18.99
  },
  {
    id: 5,
    name: "Indoor Security Camera",
    brand: "Xiaomi",
    room: "Hallway",
    category: "security",
    price: 39.99
  },
  {
    id: 6,
    name: "Door & Window Sensor Kit",
    brand: "Aqara",
    room: "Entrance",
    category: "security",
    price: 59.99
  },
  {
    id: 7,
    name: "Nest Hub",
    brand: "Google",
    room: "Kitchen",
    category: "comfort",
    price: 99.0
  },
  {
    id: 8,
    name: "Robot Vacuum",
    brand: "Roborock",
    room: "Living Room",
    category: "comfort",
    price: 349.0
  },
  {
    id: 9,
    name: "Video Doorbell",
    brand: "Ring",
    room: "Entrance",
    category: "security",
    price: 129.0
  },
  {
    id: 10,
    name: "Portable Solar Panel",
    brand: "Anker",
    room: "Outdoor / Terrace",
    category: "energy",
    price: 249.0
  }
];

// TRENDING RENDER

function renderDeviceList() {
  const container = document.getElementById("device-list-container");
  if (!container) return;

  container.innerHTML = "";

  trendingProducts.forEach((product, index) => {
    const card = document.createElement("div");
    card.classList.add("device-card");

    // ===== LEFT COLUMN =====
    const leftCol = document.createElement("div");
    leftCol.classList.add("device-left-col");

    const header = document.createElement("div");
    header.classList.add("device-header");

    const dot = document.createElement("span");
    dot.classList.add("legend-dot", `legend-dot-${product.category}`);

    const nameEl = document.createElement("p");
    nameEl.classList.add("device-name");
    nameEl.textContent = product.name;

    header.appendChild(dot);
    header.appendChild(nameEl);

    const brandEl = document.createElement("p");
    brandEl.classList.add("device-brand");
    brandEl.textContent = product.brand;

    leftCol.appendChild(header);
    leftCol.appendChild(brandEl);

    // CENTRAL COLUMN
    const centerCol = document.createElement("div");
    centerCol.classList.add("device-attributes");

    const meta = document.createElement("div");
    meta.classList.add("device-meta");

    const roomPill = document.createElement("span");
    roomPill.classList.add("device-pill");
    roomPill.textContent = product.room;

    const categoryPill = document.createElement("span");
    categoryPill.classList.add("device-pill");
    categoryPill.textContent = categoryLabels[product.category] || product.category;

    const rankPill = document.createElement("span");
    rankPill.classList.add("device-pill");
    rankPill.textContent = `Top ${index + 1}º`;

    meta.appendChild(roomPill);
    meta.appendChild(categoryPill);
    meta.appendChild(rankPill);
    centerCol.appendChild(meta);

    // RIGHT COLUMN
    const rightCol = document.createElement("div");
    rightCol.classList.add("device-price-col");

    const priceTag = document.createElement("div");
    priceTag.classList.add("device-price-tag");
    priceTag.textContent = formatPriceUSD(product.price);

    rightCol.appendChild(priceTag);

    // CREATE CARD
    card.appendChild(leftCol);
    card.appendChild(centerCol);
    card.appendChild(rightCol);

    container.appendChild(card);
  });
}

//-------------------------//
// CRUD uList (CREATE + READ)
//-------------------------//

let deviceList = [];

function handleDeviceFormSubmit(event) {
  event.preventDefault();

  // INPUTS
  const nameInput = document.getElementById("device-name");
  const brandInput = document.getElementById("device-brand");
  const roomInput = document.getElementById("device-room");
  const categoryInput = document.getElementById("device-category");
  const priceInput = document.getElementById("device-price");

  // ERRORS
  const nameError = document.getElementById("device-name-error");
  const brandError = document.getElementById("device-brand-error");
  const roomError = document.getElementById("device-room-error");
  const categoryError = document.getElementById("device-category-error");
  const priceError = document.getElementById("device-price-error");

  // HELPERS

  function showError(errorEl, message, inputEl) {
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = "block";
    }
    if (inputEl) {
      inputEl.classList.add("invalid");
    }
  }

  function clearError(errorEl, inputEl) {
    if (errorEl) {
      errorEl.textContent = "";
      errorEl.style.display = "none";
    }
    if (inputEl) {
      inputEl.classList.remove("invalid");
    }
  }

  // CLEAR ERRORS

  clearError(nameError, nameInput);
  clearError(brandError, brandInput);
  clearError(roomError, roomInput);
  clearError(categoryError, categoryInput);
  clearError(priceError, priceInput);

  const nameValue = nameInput.value.trim();
  const brandValue = brandInput.value.trim();
  const roomValue = roomInput.value.trim();
  const categoryValue = categoryInput.value;
  const priceValue = parseFloat(priceInput.value);

  let hasError = false;

  if (!nameValue) {
    showError(nameError, "Set the name of the device.", nameInput);
    hasError = true;
  }

  if (!brandValue) {
    showError(brandError, "Set the brand of the device.", brandInput);
    hasError = true;
  }

  if (!roomValue) {
    showError(roomError, "Set the room of the device.", roomInput);
    hasError = true;
  }

  if (!categoryValue) {
    showError(categoryError, "Select the category of the device.", categoryInput);
    hasError = true;
  }

  if (Number.isNaN(priceValue) || priceValue <= 0) {
    showError(priceError, "Set a valid price greater than zero.", priceInput);
    hasError = true;
  }

  if (hasError) return;

  const newDevice = {
    id: Date.now(),
    name: nameValue,
    brand: brandValue,
    room: roomValue,
    category: categoryValue,
    price: priceValue
  };

  deviceList.push(newDevice);

  renderUserDeviceList();
  renderSummary();

  event.target.reset();
}

function renderUserDeviceList() {
  const listEl = document.getElementById("user-device-list");
  const emptyEl = document.getElementById("user-device-list-empty");
  if (!listEl || !emptyEl) return;

  listEl.innerHTML = "";

  if (!deviceList.length) {
    emptyEl.style.display = "block";
    return;
  }

  emptyEl.style.display = "none";

  deviceList.forEach(device => {
    const li = document.createElement("li");
    li.classList.add("user-device-item");

    // LEFT COLUMN
    const leftCol = document.createElement("div");
    leftCol.classList.add("device-left-col");

    const header = document.createElement("div");
    header.classList.add("device-header");

    const dot = document.createElement("span");
    dot.classList.add("legend-dot", `legend-dot-${device.category}`);

    const title = document.createElement("p");
    title.classList.add("device-name");
    title.textContent = device.name;

    header.appendChild(dot);
    header.appendChild(title);

    const brandRoom = document.createElement("p");
    brandRoom.classList.add("device-brand");
    brandRoom.textContent = `${device.brand}`;

    leftCol.appendChild(header);
    leftCol.appendChild(brandRoom);

    // CENTRAL COLUMN
    const centerCol = document.createElement("div");
    centerCol.classList.add("device-attributes");

    const meta = document.createElement("div");
    meta.classList.add("device-meta");

    const roomPill = document.createElement("span");
    roomPill.classList.add("device-pill");
    roomPill.textContent = device.room;

    const categoryPill = document.createElement("span");
    categoryPill.classList.add("device-pill");
    categoryPill.textContent =
      categoryLabels[device.category] || device.category;

    meta.appendChild(roomPill);
    meta.appendChild(categoryPill);
    centerCol.appendChild(meta);

    // RIGHT COLUMN
    const rightCol = document.createElement("div");
    rightCol.classList.add("device-price-col");

    const priceTag = document.createElement("div");
    priceTag.classList.add("device-price-tag");
    priceTag.textContent = formatPriceUSD(device.price);

    rightCol.appendChild(priceTag);

    // MOUNT LIST ITEM
    li.classList.add("device-card");
    li.appendChild(leftCol);
    li.appendChild(centerCol);
    li.appendChild(rightCol);

    listEl.appendChild(li);

  });
}


// SUMMARY
function renderSummary() {
  const container = document.getElementById("room-summary-container");
  if (!container) return;

  container.innerHTML = "";

  if (!deviceList.length) {
    const empty = document.createElement("p");
    empty.textContent = "No data yet. Add some devices to see the summary.";
    empty.style.color = "#6e6e73";
    empty.style.fontSize = "0.9rem";
    container.appendChild(empty);
    return;
  }

  // GROUP BY ROOM
  const byRoom = deviceList.reduce((acc, device) => {
    if (!acc[device.room]) {
      acc[device.room] = { count: 0, total: 0 };
    }
    acc[device.room].count += 1;
    acc[device.room].total += device.price;
    return acc;
  }, {});

  Object.entries(byRoom).forEach(([room, data]) => {
    const card = document.createElement("div");
    card.classList.add("room-summary-card");

    const info = document.createElement("div");
    info.classList.add("room-summary-info");

    const title = document.createElement("h3");
    title.textContent = room;

    const subtitle = document.createElement("small");
    subtitle.textContent = `${data.count} device(s)`;

    info.appendChild(title);
    info.appendChild(subtitle);

    const total = document.createElement("div");
    total.classList.add("room-summary-total");
    total.textContent = formatPriceUSD(data.total);

    card.appendChild(info);
    card.appendChild(total);
    container.appendChild(card);
  });
}

//-------------------------//
// CONTACT
//-------------------------//

const form = document.getElementById("contactForm");
const successMsg = document.getElementById("successMsg");

function validateInput(input) {
  if (!input.checkValidity()) {
    input.classList.add("invalid");
    input.parentElement.querySelector(".error-msg").style.display = "block";
    return false;
  } else {
    input.classList.remove("invalid");
    input.parentElement.querySelector(".error-msg").style.display = "none";
    return true;
  }
}

form.addEventListener("input", e => {
  if (e.target.matches("input, textarea")) {
    validateInput(e.target);
  }
});

form.addEventListener("submit", e => {
  e.preventDefault();

  const inputs = [...form.querySelectorAll("input, textarea")];
  const allValid = inputs.every(i => validateInput(i));

  if (!allValid) return;

  successMsg.style.display = "block";
  form.reset();

  setTimeout(() => {
    successMsg.style.display = "none";
  }, 3500);
});

//-------------------------//
// LIGHTBOX GALLERY
//-------------------------//

function initGalleryLightbox() {
  const modal = document.getElementById("image-modal");
  const modalImg = document.getElementById("img-modal-picture");
  const modalCaption = document.getElementById("img-modal-caption");
  const closeBtn = modal ? modal.querySelector(".img-modal-close") : null;
  const galleryImgs = document.querySelectorAll("#gallery-container img");

  if (!modal || !modalImg || !modalCaption || !closeBtn || !galleryImgs.length) return;

  function openModalFromImage(img) {

    modalImg.src = img.src;
    modalImg.alt = img.alt || "";

    let captionText = img.alt || "";
    const figure = img.closest("figure");
    if (figure) {
      const p = figure.querySelector("figcaption p");
      if (p) captionText = p.textContent;
    }
    modalCaption.textContent = captionText;

    modal.classList.add("is-open");
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modalImg.src = "";
  }

  galleryImgs.forEach(img => {
    img.addEventListener("click", () => openModalFromImage(img));
  });

  closeBtn.addEventListener("click", closeModal);

  // CLOSE 1
  modal.addEventListener("click", e => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // CLOSE 2
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closeModal();
    }
  });
}
