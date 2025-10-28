import type { CartItem, OrderItem, ConfirmOrderRequest } from '../ts/types';
import { showToast } from './show-toast';
import { confirmOrder } from '../ts/api';

export async function handleConfirmOrder(): Promise<void> {
  const stored = localStorage.getItem('cartItems');
  const items: CartItem[] = stored ? JSON.parse(stored) : [];
  const counter = document.querySelector<HTMLElement>('.header__menu-count');

  if (!counter) return;

  if (items.length === 0) {
    showToast('Your cart is empty');
    return;
  }

  const orderItems: OrderItem[] = items.map((item) => ({
    productId: item.id,
    size: item.size,
    additives: item.additives,
    quantity: 1,
  }));

  const totalPrice = items.reduce((sum, item) => sum + (item.discountPrice ?? item.price), 0);

  const orderData: ConfirmOrderRequest = {
    items: orderItems,
    totalPrice,
  };

  try {
    const error = await confirmOrder(orderData);

    if (error) {
      showToast(error);
      return;
    }

    localStorage.removeItem('cartItems');
    localStorage.setItem('productCount', '0');

    const cartWrapper = document.querySelector('.cart__wrapper') as HTMLElement;
    const cartTotalPrice = document.querySelector('.cart__total-price') as HTMLElement;
    cartWrapper.innerHTML = '';
    cartTotalPrice.textContent = '$0.00';
    counter.textContent = '';
    showToast('Thank you for your order! Our manager will contact you shortly');
  } catch {
    showToast('Something went wrong. Please, try again');
  }
}
