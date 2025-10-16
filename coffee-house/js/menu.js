document.addEventListener('DOMContentLoaded', () => {
  const menuLink = document.getElementById('menu-link');
  const cardsSection = document.querySelector('.menu__cards');
  const loadMoreButton = document.querySelector('.load-more');
  const lastMobileMenuItem = document.querySelector(
    '.mobile-menu__item:last-child'
  );

  if (window.location.pathname.includes('menu.html') && menuLink) {
    menuLink.classList.add('header__menu--active');
    if (lastMobileMenuItem) {
      lastMobileMenuItem.style.pointerEvents = 'none';
      lastMobileMenuItem.style.cursor = 'default';
    }
  }

  setupTabs();
  cardsSection.classList.add('menu-section--active');
  renderCards(products.coffee);

  window.addEventListener('resize', () => {
    const activeTab = document.querySelector('.menu__tab--active');
    if (activeTab) {
      const category = activeTab.id;
      renderCards(products[category]);
    }
  });

  loadMoreButton.addEventListener('click', () => {
    const activeTab = document.querySelector('.menu__tab--active');
    if (!activeTab) return;

    const category = activeTab.id;
    const productsArray = products[category];

    const remainingCards = productsArray.slice(4);
    const moreHTML = remainingCards.map(createCard).join('');
    cardsSection.insertAdjacentHTML('beforeend', moreHTML);

    loadMoreButton.classList.add('hidden');
  });

  function setupTabs() {
    const tabs = document.querySelectorAll('.menu__tab');

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.classList.remove('menu__tab--active'));
        tab.classList.add('menu__tab--active');

        const categoryId = tab.id;
        cardsSection.classList.add('menu-section--active');
        renderCards(products[categoryId]);
      });
    });
  }

  function renderCards(productsArray) {
    const container = document.querySelector('.menu__cards');
    const loadMoreButton = document.querySelector('.load-more');

    container.innerHTML = '';
    loadMoreButton.classList.add('hidden');

    const isMobile = window.innerWidth <= 768;
    const maxInitialCards = isMobile ? 4 : productsArray.length;
    const visibleProducts = productsArray.slice(0, maxInitialCards);

    container.innerHTML = visibleProducts.map(createCard).join('');

    if (isMobile && productsArray.length > 4) {
      loadMoreButton.classList.remove('hidden');
    }
  }

  function createCard(item) {
    return `
    <div class="menu-card">
      <div class="menu-card__img-wrapper">
        <img src="${item.image}" alt="${item.name}" class="menu-card__img" />
      </div>
      <div class="menu-card__content">
        <div class="menu-card__text">
          <h3 class="menu-card__title">${item.name}</h3>
          <p class="menu-card__desc">${item.description}</p>
        </div>
        <span class="menu-card__price">${item.price}</span>
      </div>
    </div>
  `;
  }
});

const overlay = document.querySelector('.overlay');
const modal = document.querySelector('.modal');
const modalContainer = document.querySelector('.modal__container');

document.addEventListener('click', (e) => {
  const card = e.target.closest('.menu-card');
  if (card) {
    const title = card.querySelector('.menu-card__title').textContent;
    const category = document.querySelector('.menu__tab--active').id;
    const product = products[category].find((p) => p.name === title);
    openModal(product);
  }
});

overlay.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal__close')) closeModal();
});

function openModal(product) {
  const category = document.querySelector('.menu__tab--active').id;
  const config = categoryConfig[category];

  const sizeButtonsHTML = config.sizes
    .map(
      (size, i) => `
      <button class="size-btn ${i === 0 ? 'active' : ''}" data-price="${
        size.price
      }">
        <span class="size-btn__label">${size.label}</span>
        <span class="size-btn__volume">${size.volume}</span>
      </button>
    `
    )
    .join('');

  const addButtonsHTML = config.additives
    .map(
      (additive, i) => `
      <button class="add-btn" data-price="0.5">
        <span class="add-btn__number">${i + 1}</span>
        <span class="add-btn__additives">${additive}</span>
      </button>
    `
    )
    .join('');

  modalContainer.innerHTML = `
    <div class="modal__content">
      <img src="${product.image}" alt="${product.name}" class="modal__img" />
      <div class="modal__info">
        <div class="modal__header">
          <h3 class="modal__title">${product.name}</h3>
          <p class="modal__desc">${product.description}</p>
        </div>

        <div class="modal__sizes">
          <p class="modal__subtitle">Size</p>
          <div class="modal__btns">${sizeButtonsHTML}</div>
        </div>

        <div class="modal__additives">
          <p class="modal__subtitle">Additives</p>
          <div class="modal__btns">${addButtonsHTML}</div>
        </div>

        <div class="modal__total">
          <p class="modal__total-text">Total:</p>
          <span class="modal__price">${product.price}</span>
        </div>

        <div class="modal__alert">
          <img src="icons/info.svg" alt="Info" class="modal__alert-img"/>
          <p class="modal__alert-text">The cost is not final. Download our mobile app to see the final price and place your order. Earn loyalty points and enjoy your favorite coffee with up to 20% discount.</p>
        </div>

        <button class="button button-secondary modal__close">Close</button>
      </div>
    </div>
  `;

  document.body.style.overflow = 'hidden';
  overlay.classList.add('active');
  modal.classList.add('active');

  setupPriceLogic(product);
}

function closeModal() {
  modal.classList.remove('active');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

function setupPriceLogic(product) {
  const sizeButtons = modal.querySelectorAll('.size-btn');
  const addButtons = modal.querySelectorAll('.add-btn');
  const priceElement = modal.querySelector('.modal__price');

  let basePrice = parseFloat(product.price.replace('$', ''));
  let sizeExtra = 0;
  let addExtras = 0;

  sizeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      sizeButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      sizeExtra = parseFloat(btn.dataset.price);
      updatePrice();
    });
  });

  addButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      const isActive = btn.classList.contains('active');
      addExtras += isActive
        ? parseFloat(btn.dataset.price)
        : -parseFloat(btn.dataset.price);
      updatePrice();
    });
  });

  function updatePrice() {
    const total = (basePrice + sizeExtra + addExtras).toFixed(2);
    priceElement.textContent = `$${total}`;
  }
}
