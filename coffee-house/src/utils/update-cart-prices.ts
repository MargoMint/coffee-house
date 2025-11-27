import type { CartItem, Product } from '../ts/types';
import { isLoginned } from './auth';
import { getProducts } from '../ts/api';

export async function updateCartPricesAfterLogin(): Promise<void> {
  if (!isLoginned()) return;

  const stored = localStorage.getItem('cartItems');
  if (!stored) return;

  const items: CartItem[] = JSON.parse(stored);
  if (!items.length) return;

  try {
    const products: Product[] = await getProducts();

    const updatedItems = items.map((cartItem) => {
      const product = products.find((p) => p.name === cartItem.name);

      if (!product) return cartItem;

      if (product.discountPrice) {
        return {
          ...cartItem,
          discountPrice: Number(product.discountPrice),
        };
      }

      const { ...rest } = cartItem;
      return rest;
    });

    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
  } catch {
    console.error('Failed to update cart prices after login');
  }
}
