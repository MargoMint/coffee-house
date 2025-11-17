import './main';
import '../utils/add-to-cart';
import '../utils/init-account';
import type { CartItem } from './types';
import { renderCart } from '../utils/cart';
import { renderButtons } from '../utils/cart';
import { isLoginned } from '../utils/auth';
import { getProfile } from './api';

document.addEventListener('DOMContentLoaded', async () => {
  const cartSection = document.querySelector<HTMLElement>('.cart__wrapper');
  const totalEl = document.querySelector<HTMLElement>('.cart__total-price');
  const cartContainer = document.querySelector<HTMLElement>('.cart');
  const btnsContainer = document.querySelector<HTMLElement>('.cart__btns');
  if (!cartSection || !totalEl || !cartContainer || !btnsContainer) return;

  const stored = localStorage.getItem('cartItems');
  const items: CartItem[] = stored ? JSON.parse(stored) : [];
  renderCart(items, cartSection, totalEl);

  if (isLoginned()) {
    let userProfile = JSON.parse(localStorage.getItem('userProfile') || 'null');

    if (!userProfile) {
      const profileData = await getProfile();
      if (profileData) {
        const { city, street, houseNumber, paymentMethod } = profileData;
        userProfile = { city, street, houseNumber, paymentMethod };
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
      }
    }

    const addressBlock = document.createElement('div');
    addressBlock.className = 'cart__address';
    const addressText = document.createElement('p');
    addressText.className = 'cart__address-text';
    addressText.textContent = 'Address:';
    const addressValue = document.createElement('span');
    addressValue.className = 'cart__address-value';
    addressValue.textContent =
      userProfile && userProfile.city
        ? `${userProfile.city}, ${userProfile.street}, ${userProfile.houseNumber}`
        : ' ';
    addressBlock.append(addressText, addressValue);

    const paybyBlock = document.createElement('div');
    paybyBlock.className = 'cart__pay';
    const paybyText = document.createElement('p');
    paybyText.className = 'cart__pay-text';
    paybyText.textContent = 'Pay by:';
    const paybyValue = document.createElement('span');
    paybyValue.className = 'cart__pay-value';
    paybyValue.textContent = userProfile?.paymentMethod ?? ' ';
    paybyBlock.append(paybyText, paybyValue);

    cartContainer.insertBefore(addressBlock, btnsContainer);
    cartContainer.insertBefore(paybyBlock, btnsContainer);
  }

  await renderButtons(btnsContainer);
});
