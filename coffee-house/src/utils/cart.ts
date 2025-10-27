import type { CartItem } from '../ts/types';

export function renderCart(items: CartItem[], container: HTMLElement, totalEl: HTMLElement): void {
  container.innerHTML = items
    .map(
      (item, index) => `
      <div class="cart-item" data-index="${index}">
        <button class="cart-item__remove" aria-label="Remove">
          <img src="/icons/trash.svg" alt="remove item" class="cart-item__remove-img" />
        </button>
        <img src="${item.img}" alt="${item.name}" class="cart-item__img" />
        <div class="cart-item__info">
          <h4 class="cart-item__title">${item.name}</h4>
          <div class="cart-item__descr">
            <p>${[item.size, ...item.additives].filter(Boolean).join(', ')}</p>
          </div>
        </div>
        <div class="cart-item__price-block">
          ${
            item.discountPrice
              ? `
              <p class="cart-item__price price--old">$${item.price.toFixed(2)}</p>
              <p class="cart-item__price price--new">$${item.discountPrice.toFixed(2)}</p>
            `
              : `<p class="cart-item__price">$${item.price.toFixed(2)}</p>`
          }
        </div>
      </div>
    `
    )
    .join('');

  updateTotal(items, totalEl);

  container.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.closest('.cart-item__remove')) {
      const itemEl = target.closest('.cart-item') as HTMLElement | null;
      if (!itemEl) return;
      const idx = Number(itemEl.dataset.index);
      removeCartItem(idx);
    }
  });
}

function updateTotal(items: CartItem[], totalEl: HTMLElement): void {
  const total = items.reduce((sum, i) => sum + (i.discountPrice ?? i.price), 0);
  const originalTotal = items.reduce((sum, i) => sum + i.price, 0);

  if (total !== originalTotal) {
    totalEl.innerHTML = `
      <span class="price--old">$${originalTotal.toFixed(2)}</span>
      <span class="price--new">$${total.toFixed(2)}</span>
    `;
  } else {
    totalEl.textContent = `$${total.toFixed(2)}`;
  }
}

function removeCartItem(index: number): void {
  const stored = localStorage.getItem('cartItems');
  const items: CartItem[] = stored ? JSON.parse(stored) : [];

  items.splice(index, 1);
  localStorage.setItem('cartItems', JSON.stringify(items));

  const counter = document.querySelector<HTMLElement>('.header__menu-count');
  const count = items.length;
  localStorage.setItem('productCount', count.toString());
  if (counter) counter.textContent = count > 0 ? count.toString() : '';

  const container = document.querySelector<HTMLElement>('.cart__wrapper');
  const totalEl = document.querySelector<HTMLElement>('.cart__total-price');
  if (container && totalEl) renderCart(items, container, totalEl);
}
