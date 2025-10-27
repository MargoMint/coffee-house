import './main';
import '../utils/add-to-cart';
import type { CartItem } from './types';
import { renderCart } from '../utils/cart';

document.addEventListener('DOMContentLoaded', () => {
  const cartSection = document.querySelector<HTMLElement>('.cart__wrapper');
  const totalEl = document.querySelector<HTMLElement>('.cart__total-price');

  if (!cartSection || !totalEl) return;

  const stored = localStorage.getItem('cartItems');
  const items: CartItem[] = stored ? JSON.parse(stored) : [];

  renderCart(items, cartSection, totalEl);
});
