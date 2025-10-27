import './main';
import { initFormValidation } from '../utils/form-utils';
import { loginUser } from './api';

if (localStorage.getItem('isLoginned') === 'true') {
  window.location.href = 'cart.html';
}

const form = document.getElementById('sign-in-form') as HTMLFormElement;
const submitError = document.getElementById('submit-error') as HTMLParagraphElement;
const button = form.querySelector<HTMLButtonElement>('.button-sign-in')!;

initFormValidation(form, '.button-sign-in');

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
    localStorage.setItem('isLoginned', 'true');
    form.reset();
    window.location.href = 'menu.html';
  }
});
