const products = window.PIPA_PRODUCTS || [];
const productGrid = document.querySelector("#productGrid");
const filters = document.querySelectorAll("[data-filter]");
const filterLinks = document.querySelectorAll("[data-filter-link]");
const cartCount = document.querySelector("#cartCount");
const cartDrawer = document.querySelector("#cartDrawer");
const cartItems = document.querySelector("#cartItems");
const cartTotal = document.querySelector("#cartTotal");
const productModal = document.querySelector("#productModal");
const sideMenu = document.querySelector("#sideMenu");
const waitlistForm = document.querySelector("#waitlistForm");
const success = document.querySelector("#success");
const cartPreorder = document.querySelector("#cartPreorder");
const modalAdd = document.querySelector("#modalAdd");

let currentFilter = "all";
let currentProduct = null;
let cart = [];

const preorderCopy = {
  label: "Pre-order",
  short: "Pre-order • exp. mi-juillet",
};

const formatPrice = (price) =>
  price.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

const illustration = (product) => {
  const color = product.colors?.[0] || "#f873a8";
  return `
    <div class="product-illustration" style="background:${product.colors?.[1] || "#fff5e6"}">
      <div class="shoe" style="background:${color}"></div>
    </div>
  `;
};

const imageMarkup = (product) =>
  product.image
    ? `<img src="${product.image}" alt="${product.name}" loading="lazy" />`
    : illustration(product);

const productMediaMarkup = (product) => {
  const primary = imageMarkup(product);
  const hover = product.hoverImage
    ? `<img class="hover-image" src="${product.hoverImage}" alt="" loading="lazy" />`
    : "";
  return `${primary}${hover}`;
};

const swatches = (product) =>
  `<span class="swatches">${(product.colors || [])
    .map((color) => `<i style="background:${color}"></i>`)
    .join("")}</span>`;

const isPreorder = (product) => product.status === "preorder";
const isComingSoon = (product) => product.status === "coming-soon";
const canAddToCart = (product) => product && !isComingSoon(product);

const actionLabel = (product) => {
  if (isComingSoon(product)) return "Notify";
  if (isPreorder(product)) return "Pre-order";
  return "Ajouter";
};

const priceLabel = (product) => {
  if (isComingSoon(product)) return "Coming soon";
  return formatPrice(product.price);
};

function renderProducts() {
  const visibleProducts =
    currentFilter === "all"
      ? products
      : products.filter((product) => product.category === currentFilter);

  productGrid.innerHTML = visibleProducts
    .map(
      (product) => `
        <article class="product-card reveal" data-product-id="${product.id}">
          <div class="product-media" data-open-product="${product.id}">
            ${isComingSoon(product) ? '<span class="badge">Soon</span>' : ""}
            ${isPreorder(product) ? '<span class="badge preorder">Pre-order</span>' : ""}
            ${productMediaMarkup(product)}
            <button class="heart" data-add-cart="${product.id}" aria-label="Ajouter ${product.name} au panier">♡</button>
          </div>
          <div class="product-info">
            <h3>${product.name}</h3>
            <p>${product.mood}</p>
            <span class="price">${priceLabel(product)}</span>
            ${swatches(product)}
            <div class="quick-actions">
              <button class="mini-button" data-open-product="${product.id}">Voir</button>
              <button class="mini-button" data-add-cart="${product.id}">${actionLabel(product)}</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");

  attachProductEvents();
  observeReveal();
}

function setFilter(filter) {
  currentFilter = filter;
  filters.forEach((button) => button.classList.toggle("active", button.dataset.filter === filter));
  renderProducts();
}

function attachProductEvents() {
  document.querySelectorAll("[data-open-product]").forEach((button) => {
    button.addEventListener("click", () => openProduct(button.dataset.openProduct));
  });

  document.querySelectorAll("[data-add-cart]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      addToCart(button.dataset.addCart);
    });
  });
}

function openProduct(productId) {
  currentProduct = products.find((product) => product.id === productId);
  if (!currentProduct) return;

  document.querySelector("#modalCategory").textContent = currentProduct.mood;
  document.querySelector("#modalTitle").textContent = currentProduct.name;
  document.querySelector("#modalDescription").textContent = currentProduct.description;
  document.querySelector("#modalPrice").textContent = priceLabel(currentProduct);
  document.querySelector("#modalImage").innerHTML = imageMarkup(currentProduct);
  document.querySelector("#modalSwatches").innerHTML = (currentProduct.colors || [])
    .map((color) => `<i style="background:${color}"></i>`)
    .join("");
  modalAdd.textContent = isPreorder(currentProduct) ? "Pre-order" : "Add to bag";

  productModal.classList.add("open");
  productModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeProduct() {
  productModal.classList.remove("open");
  productModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!canAddToCart(product)) {
    openProduct(productId);
    return;
  }

  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  renderCart();
  openCart();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  renderCart();
}

function renderCart() {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  cartCount.textContent = count;
  cartTotal.textContent = formatPrice(total);
  cartPreorder.hidden = !cart.some(isPreorder);

  cartItems.innerHTML =
    cart.length === 0
      ? "<p>Ton panier est vide pour le moment.</p>"
      : cart
          .map(
            (item) => `
              <div class="cart-item">
                <div class="cart-thumb">${imageMarkup(item)}</div>
                <div>
                  <h3>${item.name}</h3>
                  <p>${item.quantity} x ${formatPrice(item.price)}</p>
                  ${isPreorder(item) ? `<p class="cart-meta">${preorderCopy.short}</p>` : ""}
                </div>
                <button class="remove" data-remove="${item.id}" aria-label="Retirer ${item.name}">×</button>
              </div>
            `
          )
          .join("");

  document.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => removeFromCart(button.dataset.remove));
  });
}

function openCart() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("drawer-open");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("drawer-open");
}

function observeReveal() {
  const items = document.querySelectorAll(".reveal:not(.is-visible)");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  items.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    observer.observe(item);
  });
}

filters.forEach((button) => {
  button.addEventListener("click", () => setFilter(button.dataset.filter));
});

filterLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const filter = link.dataset.filterLink;
    if (filter) setFilter(filter);
  });
});

document.querySelector(".menu-button").addEventListener("click", () => {
  sideMenu.classList.add("open");
  sideMenu.setAttribute("aria-hidden", "false");
});

document.querySelectorAll("[data-close-menu]").forEach((element) => {
  element.addEventListener("click", () => {
    sideMenu.classList.remove("open");
    sideMenu.setAttribute("aria-hidden", "true");
  });
});

document.querySelectorAll("#openCart, #openCart2").forEach((button) => {
  button.addEventListener("click", openCart);
});

document.querySelector("[data-close-cart]").addEventListener("click", closeCart);
document.querySelector("[data-close-modal]").addEventListener("click", closeProduct);
modalAdd.addEventListener("click", () => {
  if (currentProduct) addToCart(currentProduct.id);
});

productModal.addEventListener("click", (event) => {
  if (event.target === productModal) closeProduct();
});

waitlistForm.addEventListener("submit", (event) => {
  event.preventDefault();
  success.classList.add("visible");
  waitlistForm.reset();
});

renderProducts();
renderCart();
observeReveal();
