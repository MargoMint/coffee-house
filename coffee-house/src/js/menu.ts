import { categoryConfig } from './category';
import type { Product, ProductCategory, CategoryConfigItem, SizeOption } from './types';
import { getProducts, getProductById } from './api';
import { showError } from '../utils/show-error';

document.addEventListener('DOMContentLoaded', () => {
  const menuLink = document.getElementById('menu-link');
  const cardsSection = document.querySelector<HTMLElement>('.menu__cards');
  const loadMoreButton = document.querySelector<HTMLButtonElement>('.load-more');
  const lastMobileMenuItem = document.querySelector<HTMLElement>('.mobile-menu__item:last-child');

  if (window.location.pathname.includes('menu.html') && menuLink) {
    menuLink.classList.add('header__menu--active');
    if (lastMobileMenuItem) {
      lastMobileMenuItem.style.pointerEvents = 'none';
      lastMobileMenuItem.style.cursor = 'default';
    }
  }

  if (!cardsSection) return;

  setupTabs();
  setDefaultActiveTab('coffee');
  renderCards('coffee');
  setupLoadMore(loadMoreButton, cardsSection);
  setupModalListeners();
});

function setDefaultActiveTab(defaultCategory: ProductCategory): void {
  const defaultTab = document.getElementById(defaultCategory);
  if (!defaultTab) return;
  const tabs = document.querySelectorAll<HTMLElement>('.menu__tab');
  tabs.forEach((t) => t.classList.remove('menu__tab--active'));
  defaultTab.classList.add('menu__tab--active');
}

function setupTabs(): void {
  const tabs = document.querySelectorAll<HTMLElement>('.menu__tab');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('menu__tab--active'));
      tab.classList.add('menu__tab--active');

      const categoryId = (tab.id as ProductCategory) || 'coffee';
      renderCards(categoryId);
    });
  });
}

async function renderCards(category: ProductCategory): Promise<void> {
  const container = document.querySelector<HTMLElement>('.menu__cards');
  const loadMoreButton = document.querySelector<HTMLButtonElement>('.load-more');

  if (!container) return;

  try {
    const productsArray = await getProducts(category);
    const products = Array.isArray(productsArray) ? productsArray : [];

    container.innerHTML = '';

    const isMobile = window.innerWidth <= 768;
    const maxInitialCards = isMobile ? 4 : products.length;
    const visibleProducts = products.slice(0, maxInitialCards);

    container.innerHTML = visibleProducts.map(createCard).join('');

    if (loadMoreButton) {
      if (isMobile && products.length > maxInitialCards) {
        loadMoreButton.classList.remove('hidden');
        loadMoreButton.dataset.category = category;
      } else {
        loadMoreButton.classList.add('hidden');
        delete loadMoreButton.dataset.category;
      }
    }
  } catch (err) {
    console.error('renderCards error:', err);
    showError(container);
    const loadMoreButtonLocal = document.querySelector<HTMLButtonElement>('.load-more');
    if (loadMoreButtonLocal) loadMoreButtonLocal.classList.add('hidden');
  }
}

function setupLoadMore(button: HTMLButtonElement | null, container: HTMLElement): void {
  if (!button) return;

  button.addEventListener('click', async () => {
    const category = button.dataset.category as ProductCategory | undefined;
    if (!category) return;

    const loaderEl = document.createElement('div');
    loaderEl.className = 'loader loader--small';
    button.insertAdjacentElement('afterend', loaderEl);

    try {
      const productsArray = await getProducts(category);
      const products = Array.isArray(productsArray) ? productsArray : [];
      const remainingCards = products.slice(4);
      container.insertAdjacentHTML('beforeend', remainingCards.map(createCard).join(''));
      button.classList.add('hidden');
    } catch (e) {
      console.error('load more error:', e);
      showError(container);
    } finally {
      loaderEl.remove();
    }
  });
}

function createCard(item: Product): string {
  const category = item.category || 'coffee';
  const imgPath = `/img/products/${category}/${item.id}.jpg`;
  const priceText = item.discountPrice
    ? `<span class="menu-card__price--discount">$${item.discountPrice}</span>
        <span class="menu-card__price--old">$${item.price}</span>`
    : `<span class="menu-card__price">$${item.price}</span>`;

  return `
    <div class="menu-card" data-id="${item.id}">
      <div class="menu-card__img-wrapper">
        <img src="${imgPath}" alt="${item.name}" class="menu-card__img" />
      </div>
      <div class="menu-card__content">
        <div class="menu-card__text">
          <h3 class="menu-card__title">${item.name}</h3>
          <p class="menu-card__desc">${item.description}</p>
        </div>
        <div class="menu-card__price">${priceText}</div>
      </div>
    </div>
  `;
}

function setupModalListeners(): void {
  const overlay = document.querySelector<HTMLElement>('.overlay');
  const modal = document.querySelector<HTMLElement>('.modal-wrapper');
  const modalContainer = document.querySelector<HTMLElement>('.modal__container');

  if (!overlay || !modal || !modalContainer) return;

  document.addEventListener('click', async (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.modal__content') || target.closest('.modal')) return;

    const card = target.closest('.menu-card') as HTMLElement | null;
    if (!card) return;

    const idStr = card.dataset.id;
    const productId = idStr ? Number(idStr) : NaN;
    if (Number.isNaN(productId)) return;

    await openModalById(productId, overlay, modal, modalContainer);
  });

  overlay.addEventListener('click', () => closeModal(modal, overlay));

  modal.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('modal__close') || target.closest('.modal__close')) {
      closeModal(modal, overlay);
    }
  });

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeModal(modal, overlay);
  });
}

function setupModalActions(modalContainer: HTMLElement): void {
  const modal = document.querySelector<HTMLElement>('.modal-wrapper');
  const overlay = document.querySelector<HTMLElement>('.overlay');
  const addToCartBtn = modalContainer.querySelector<HTMLButtonElement>('.modal__add');
  const closeIcon = modalContainer.querySelector<HTMLButtonElement>('.modal__close');
  let counter = document.querySelector('.header__menu-count');

  if (!modal || !overlay) return;

  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      if (counter instanceof HTMLElement) {
        addToCart(counter);
      }
      closeModal(modal, overlay);
    });
  }

  if (closeIcon) {
    closeIcon.addEventListener('click', () => {
      closeModal(modal, overlay);
    });
  }
}

async function openModalById(
  productId: number,
  overlay: HTMLElement,
  modal: HTMLElement,
  modalContainer: HTMLElement
): Promise<void> {
  overlay.classList.add('active');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  try {
    const product = await getProductById(productId);
    if (!product) throw new Error('Product not found');
    renderModal(product, modalContainer);
  } catch (err) {
    console.error('openModalById error:', err);
    closeModal(modal, overlay);
  }
}

function renderModal(product: Product, modalContainer: HTMLElement): void {
  const activeTab = document.querySelector<HTMLElement>('.menu__tab--active');
  const category = (activeTab?.id as ProductCategory) || 'coffee';
  const imgPath = `/img/products/${category}/${product.id}.jpg`;

  const config: CategoryConfigItem = categoryConfig[category];

  const sizeButtonsHTML = (config.sizes || [])
    .map(
      (size: SizeOption, i: number) => `
      <button class="size-btn ${i === 0 ? 'active' : ''}" data-price="${size.price}">
        <span class="size-btn__label">${size.label}</span>
        <span class="size-btn__volume">${size.volume}</span>
      </button>`
    )
    .join('');

  const addButtonsHTML = (config.additives || [])
    .map(
      (additive, i) => `
      <button class="add-btn" data-price="0.5">
        <span class="add-btn__number">${i + 1}</span>
        <span class="add-btn__additives">${additive}</span>
      </button>`
    )
    .join('');

  const priceText = product.price;

  modalContainer.innerHTML = `
    <div class="modal__content" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <img src="${imgPath}" alt="${product.name}" class="modal__img" />
      <div class="modal__info">
        <h3 id="modal-title" class="modal__title">${product.name}</h3>
        <p class="modal__desc">${product.description}</p>
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
          <span class="modal__price">${priceText}</span>
        </div>
        <button class="button button-secondary modal__add" type="button">Add to cart</button>
      </div>
    </div>
  `;

  setupPriceLogic(product, modalContainer);
  setupModalActions(modalContainer);
}

function setupPriceLogic(product: Product, modalContainer: HTMLElement): void {
  const sizeButtons = Array.from(modalContainer.querySelectorAll<HTMLButtonElement>('.size-btn'));
  const addButtons = Array.from(modalContainer.querySelectorAll<HTMLButtonElement>('.add-btn'));
  const priceElement = modalContainer.querySelector<HTMLElement>('.modal__price');
  if (!priceElement) return;

  const basePrice = parseFloat(String(product.price).replace(/[^0-9.]/g, '')) || 0;
  let sizeExtra = 0;
  let addExtras = 0;

  const updatePrice = (): void => {
    const total = (basePrice + sizeExtra + addExtras).toFixed(2);
    priceElement.textContent = `$${total}`;
  };

  sizeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      sizeButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      sizeExtra = parseFloat(String(btn.dataset.price ?? '0')) || 0;
      updatePrice();
    });
  });

  addButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      const isActive = btn.classList.contains('active');
      const delta = parseFloat(String(btn.dataset.price ?? '0')) || 0;
      addExtras += isActive ? delta : -delta;
      updatePrice();
    });
  });

  updatePrice();
}

function closeModal(modal: HTMLElement, overlay: HTMLElement): void {
  modal.classList.remove('active');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
  const modalContainer = modal.querySelector<HTMLElement>('.modal__container');
  if (modalContainer) modalContainer.innerHTML = '';
}

function addToCart(counter: HTMLElement): void {
  const currentCount = parseInt(counter.textContent || '0', 10);
  const newCount = currentCount + 1;
  counter.textContent = newCount.toString();
  console.log('Product added to cart');
}
