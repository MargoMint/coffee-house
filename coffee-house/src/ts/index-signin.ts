import './main';
import { initFormValidation } from '../utils/form-utils';
import { loginUser, getProfile } from './api';
import { setIsLoginned, isLoginned } from '../utils/auth';
import { updateCartPricesAfterLogin } from '../utils/update-cart-prices';

if (isLoginned()) {
  window.location.href = 'menu.html';
}

const form = document.getElementById('signin-form') as HTMLFormElement;
const submitError = document.getElementById('submit-error') as HTMLParagraphElement;
const button = form.querySelector<HTMLButtonElement>('.button-signin')!;

initFormValidation(form, '.button-signin');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  submitError.textContent = '';
  submitError.classList.remove('visible');

  const formData = new FormData(form);
  const data = {
    login: formData.get('login') as string,
    password: formData.get('password') as string,
  };

  button.disabled = true;

  const error = await loginUser(data);

  if (error) {
    submitError.textContent = error;
    submitError.classList.add('visible');
    button.disabled = false;
  } else {
    setIsLoginned(true);
    form.reset();

    const profile = await getProfile();

    if (profile) {
      const { city, street, houseNumber, paymentMethod } = profile;

      localStorage.setItem(
        'userProfile',
        JSON.stringify({ city, street, houseNumber, paymentMethod })
      );
    }

    await updateCartPricesAfterLogin();
    window.location.href = 'menu.html';
  }
});
