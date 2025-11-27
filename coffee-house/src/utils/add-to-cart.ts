import type { CartItem } from '../ts/types';
import { isLoginned } from './auth';

export function addToCart(counter: HTMLElement): void {
  const currentCount = parseInt(counter.textContent || '0', 10);
  const newCount = currentCount + 1;
  counter.textContent = newCount.toString();

  localStorage.setItem('productCount', newCount.toString());

  const menuBag = document.querySelector<HTMLElement>('#menu-bag');
  if (menuBag) {
    if (isLoginned()) {
      menuBag.classList.remove('hidden');
    } else {
      if (newCount > 0) menuBag.classList.remove('hidden');
      else menuBag.classList.add('hidden');
    }
  }

  const modal = document.querySelector<HTMLElement>('.modal__content');
  if (!modal) return;

  const idStr = modal
    .querySelector<HTMLImageElement>('.modal__img')
    ?.src.split('/')
    .pop()
    ?.split('.')[0];
  const id = idStr ? Number(idStr) : Date.now();

  const name = modal.querySelector<HTMLElement>('.modal__title')?.textContent?.trim() ?? '';

  const img = modal.querySelector<HTMLImageElement>('.modal__img')?.getAttribute('src') ?? '';

  const priceText = modal
    .querySelector<HTMLElement>('.modal__price--old')
    ?.textContent?.replace('$', '')
    .trim();
  const discountText = modal
    .querySelector<HTMLElement>('.modal__price--new')
    ?.textContent?.replace('$', '')
    .trim();

  const price = priceText
    ? parseFloat(priceText)
    : parseFloat(
        modal.querySelector<HTMLElement>('.modal__price')?.textContent?.replace('$', '') ?? '0'
      );
  const discountPrice = discountText ? parseFloat(discountText) : undefined;

  const sizeBtn = modal.querySelector<HTMLButtonElement>('.size-btn.active');
  const size = sizeBtn?.textContent?.trim() ?? '';

  const additives: string[] = Array.from(
    modal.querySelectorAll<HTMLButtonElement>('.add-btn.active')
  ).map((btn) => btn.querySelector('.add-btn__additives')?.textContent?.trim() ?? '');

  const newItem: CartItem = {
    id,
    name,
    size,
    additives,
    price,
    discountPrice,
    img,
  };

  const existingCart = localStorage.getItem('cartItems');
  const cartItems: CartItem[] = existingCart ? JSON.parse(existingCart) : [];

  cartItems.push(newItem);

  localStorage.setItem('cartItems', JSON.stringify(cartItems));
}
