import type { Product, ProductCategory } from './types';
import { getProducts } from './api';
import { showError } from '../utils/show-error';
import { setupModalListeners } from '../utils/modal';

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
    ? `<span class="menu-card__price--new">$${item.discountPrice}</span>
        <span class="menu-card__price--old price--old">$${item.price}</span>`
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
