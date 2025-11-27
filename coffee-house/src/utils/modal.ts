import { addToCart } from './add-to-cart';
import { getProductById } from '../ts/api';
import type { Product, ProductCategory, CategoryConfigItem, SizeOption } from '../ts/types';
import { categoryConfig } from './category-data';
import { showToast } from './show-toast';
import { isLoginned } from './auth';
import { showTooltip } from './show-tooltip';

export function renderModal(product: Product, modalContainer: HTMLElement): void {
  const activeTab = document.querySelector<HTMLElement>('.menu__tab--active');
  const category = (activeTab?.id as ProductCategory) || 'coffee';
  const imgPath = `/img/products/${category}/${product.id}.jpg`;

  const config: CategoryConfigItem = categoryConfig[category];

  const userLoggedIn = isLoginned();

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

  let priceText: string;
  if (userLoggedIn && product.discountPrice) {
    priceText = `
      <span class="modal__price modal__price--old">$${Number(product.price).toFixed(2)}</span>
      <span class="modal__price modal__price--new">$${Number(product.discountPrice).toFixed(2)}</span>
    `;
  } else {
    priceText = `<span class="modal__price">$${Number(product.price).toFixed(2)}</span>`;
  }

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
        <div class="modal__price-block">${priceText}</div>
      </div>
      <button class="button button-secondary modal__add" type="button">Add to cart</button>
    </div>
  </div>
`;

  setupPriceLogic(product, modalContainer);
  setupModalActions(modalContainer);
}

export function setupModalListeners(): void {
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

export function setupModalActions(modalContainer: HTMLElement): void {
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

export async function openModalById(
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
  } catch {
    closeModal(modal, overlay);
    showToast('Something went wrong. Please, try again.');
  }
}

export function setupPriceLogic(product: Product, modalContainer: HTMLElement): void {
  const sizeButtons = Array.from(modalContainer.querySelectorAll<HTMLButtonElement>('.size-btn'));
  const addButtons = Array.from(modalContainer.querySelectorAll<HTMLButtonElement>('.add-btn'));
  const priceBlock = modalContainer.querySelector<HTMLElement>('.modal__price-block');
  if (!priceBlock) return;

  const userLoggedIn = isLoginned();
  const basePrice = Number(product.price);
  const baseDiscount = userLoggedIn && product.discountPrice ? Number(product.discountPrice) : null;
  let sizeExtra = 0;
  let addExtras = 0;

  const updatePrice = (): void => {
    const total = basePrice + sizeExtra + addExtras;
    const totalDiscount = baseDiscount ? baseDiscount + sizeExtra + addExtras : null;

    priceBlock.innerHTML = totalDiscount
      ? `<span class="modal__price modal__price--old">$${total.toFixed(2)}</span>
          <span class="modal__price modal__price--new">$${totalDiscount.toFixed(2)}</span>`
      : `<span class="modal__price">$${total.toFixed(2)}</span>`;
  };

  sizeButtons.forEach((btn) => {
    const price = parseFloat(btn.dataset.price ?? '0') || 0;

    const tooltipText =
      userLoggedIn && product.discountPrice
        ? `<span class="tooltip__old">$${(basePrice + price).toFixed(2)}</span>
      <span>$${(baseDiscount! + price).toFixed(2)}</span>`
        : `$${(basePrice + price).toFixed(2)}`;

    btn.addEventListener('mouseenter', () => {
      showTooltip(btn, tooltipText);
    });

    btn.addEventListener('click', () => {
      sizeButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      sizeExtra = price;
      updatePrice();
    });
  });

  addButtons.forEach((btn) => {
    const price = parseFloat(btn.dataset.price ?? '0') || 0;
    const tooltipText = `+$${price.toFixed(2)}`;

    btn.addEventListener('mouseenter', () => {
      showTooltip(btn, tooltipText);
    });

    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      addExtras += btn.classList.contains('active') ? price : -price;
      updatePrice();
    });
  });

  updatePrice();
}

export function closeModal(modal: HTMLElement, overlay: HTMLElement): void {
  modal.classList.remove('active');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
  const modalContainer = modal.querySelector<HTMLElement>('.modal__container');
  if (modalContainer) modalContainer.innerHTML = '';
}
