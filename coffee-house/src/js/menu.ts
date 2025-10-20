import { categoryConfig } from './category';
import type { Product, ProductCategory, CategoryConfigItem, SizeOption } from './types';
import { products } from './products';

document.addEventListener('DOMContentLoaded', (): void => {
  const menuLink = document.getElementById('menu-link');
  const cardsSection = document.querySelector<HTMLElement>('.menu__cards');
  const loadMoreButton = document.querySelector<HTMLElement>('.load-more');
  const lastMobileMenuItem = document.querySelector<HTMLElement>('.mobile-menu__item:last-child');

  if (window.location.pathname.includes('menu.html') && menuLink) {
    menuLink.classList.add('header__menu--active');
    if (lastMobileMenuItem) {
      lastMobileMenuItem.style.pointerEvents = 'none';
      lastMobileMenuItem.style.cursor = 'default';
    }
  }

  if (cardsSection) {
    setupTabs();
    cardsSection.classList.add('menu-section--active');
    renderCards(products.coffee);
  }

  window.addEventListener('resize', (): void => {
    const activeTab = document.querySelector<HTMLElement>('.menu__tab--active');
    if (activeTab && cardsSection) {
      const category = activeTab.id as ProductCategory;
      renderCards(products[category]);
    }
  });

  if (loadMoreButton && cardsSection) {
    loadMoreButton.addEventListener('click', (): void => {
      const activeTab = document.querySelector<HTMLElement>('.menu__tab--active');
      if (!activeTab) return;

      const category = activeTab.id as ProductCategory;
      const productsArray = products[category];

      const remainingCards = productsArray.slice(4);
      const moreHTML = remainingCards.map(createCard).join('');
      cardsSection.insertAdjacentHTML('beforeend', moreHTML);

      loadMoreButton.classList.add('hidden');
    });
  }

  function setupTabs(): void {
    const tabs = document.querySelectorAll<HTMLElement>('.menu__tab');

    tabs.forEach((tab) => {
      tab.addEventListener('click', (): void => {
        tabs.forEach((t) => t.classList.remove('menu__tab--active'));
        tab.classList.add('menu__tab--active');

        const categoryId = tab.id as ProductCategory;
        if (cardsSection) {
          cardsSection.classList.add('menu-section--active');
          renderCards(products[categoryId]);
        }
      });
    });
  }

  function renderCards(productsArray: Product[]): void {
    const container = document.querySelector<HTMLElement>('.menu__cards');
    const loadMoreButton = document.querySelector<HTMLElement>('.load-more');

    if (!container || !loadMoreButton) return;

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

  function createCard(item: Product): string {
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

const overlay = document.querySelector<HTMLElement>('.overlay');
const modal = document.querySelector<HTMLElement>('.modal');
const modalContainer = document.querySelector<HTMLElement>('.modal__container');

document.addEventListener('click', (e: MouseEvent): void => {
  const target = e.target as HTMLElement;
  const card = target.closest('.menu-card') as HTMLElement | null;
  if (!card || !modalContainer) return;

  const title = card.querySelector<HTMLElement>('.menu-card__title')?.textContent;
  if (!title) return;

  const activeTab = document.querySelector<HTMLElement>('.menu__tab--active');
  if (!activeTab) return;

  const category = activeTab.id as ProductCategory;
  const product = products[category].find((p) => p.name === title);
  if (product) openModal(product);
});

overlay?.addEventListener('click', closeModal);
modal?.addEventListener('click', (e: MouseEvent): void => {
  const target = e.target as HTMLElement;
  if (target.classList.contains('modal__close')) closeModal();
});

function openModal(product: Product): void {
  const activeTab = document.querySelector<HTMLElement>('.menu__tab--active');
  if (!activeTab || !modalContainer) return;

  const category = activeTab.id as ProductCategory;
  const config: CategoryConfigItem = categoryConfig[category];

  const sizeButtonsHTML = config.sizes
    .map(
      (size: SizeOption, i: number) => `
        <button class="size-btn ${i === 0 ? 'active' : ''}" data-price="${size.price}">
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
  overlay?.classList.add('active');
  modal?.classList.add('active');

  setupPriceLogic(product);
}

function closeModal(): void {
  modal?.classList.remove('active');
  overlay?.classList.remove('active');
  document.body.style.overflow = '';
}

function setupPriceLogic(product: Product): void {
  if (!modal) return;

  const sizeButtons = modal.querySelectorAll<HTMLButtonElement>('.size-btn');
  const addButtons = modal.querySelectorAll<HTMLButtonElement>('.add-btn');
  const priceElement = modal.querySelector<HTMLElement>('.modal__price');
  if (!priceElement) return;
  const priceDisplay: HTMLElement = priceElement;
  let basePrice = parseFloat(product.price.replace('$', '')) || 0;
  let sizeExtra = 0;
  let addExtras = 0;

  sizeButtons.forEach((btn) => {
    btn.addEventListener('click', (): void => {
      sizeButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      sizeExtra = parseFloat(btn.dataset.price ?? '0');
      updatePrice();
    });
  });

  addButtons.forEach((btn) => {
    btn.addEventListener('click', (): void => {
      btn.classList.toggle('active');
      const isActive = btn.classList.contains('active');
      const delta = parseFloat(btn.dataset.price ?? '0');
      addExtras += isActive ? delta : -delta;
      updatePrice();
    });
  });

  function updatePrice(): void {
    const total = (basePrice + sizeExtra + addExtras).toFixed(2);
    priceDisplay.textContent = `$${total}`;
  }
}
