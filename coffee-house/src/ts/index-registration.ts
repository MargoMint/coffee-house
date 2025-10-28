import './main';
import { initFormValidation } from '../utils/form-utils';
import { registerUser } from './api';
import { citiesWithStreets } from '../utils/cities-data';
import { setIsLoginned, isLoginned } from '../utils/auth';
import { getProfile } from './api';

if (isLoginned()) {
  window.location.href = 'menu.html';
}

const form = document.getElementById('registration-form') as HTMLFormElement;
const submitError = document.getElementById('submit-error') as HTMLParagraphElement;

const citySelect = document.getElementById('city') as HTMLSelectElement;
const streetSelect = document.getElementById('street') as HTMLSelectElement;

function updateStreets(city: string): void {
  if (city && citiesWithStreets[city]) {
    citiesWithStreets[city].forEach((street) => {
      const option = document.createElement('option');
      option.value = street;
      option.textContent = street;
      streetSelect.appendChild(option);
    });
  }
}

citySelect.addEventListener('change', () => updateStreets(citySelect.value));
initFormValidation(form);

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  submitError.textContent = '';
  submitError.classList.remove('visible');

  const formData = new FormData(form);
  const data = {
    login: formData.get('login') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirm-password') as string,
    city: formData.get('city') as string,
    street: formData.get('street') as string,
    houseNumber: Number(formData.get('house')),
    paymentMethod: formData.get('payment') as string,
  };

  const error = await registerUser(data);
  if (error) {
    submitError.textContent = error;
    submitError.classList.add('visible');
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

    window.location.href = 'menu.html';
  }
});
