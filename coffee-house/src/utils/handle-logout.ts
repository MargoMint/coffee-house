import { setIsLoginned } from '../utils/auth';
import { confirmToast } from '../utils/show-toast';

export function handleLogout(e: MouseEvent): void {
  e.stopPropagation();

  const cartElement = document.getElementById('menu-bag');
  if (!cartElement) return;

  const confirmMessage =
    'Your cart items will be cleared after logout.<br>Do you want to continue?';

  confirmToast(confirmMessage, () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('productCount');
    setIsLoginned(false);
    window.location.href = 'signin.html';
  });
}
