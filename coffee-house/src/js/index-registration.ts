import './main';
import { initFormValidation } from '../utils/form-utils';
import { registerUser } from './api';

if (localStorage.getItem('isRegistered') === 'true') {
  window.location.href = 'cart.html';
}

const citiesWithStreets: Record<string, string[]> = {
  city1: [
    'Dluga',
    'Mariacka',
    'Targowa',
    'Grunwaldzka',
    'Waly Jagiellonskie',
    'Hucisko',
    'Garncarska',
    'Rajska',
    'Chlebnicka',
    'Piwna',
  ],
  city2: [
    'Marszalkowska',
    'Nowy Swiat',
    'Krolewska',
    'Swietokrzyska',
    'Kasztanowa',
    'Malczewskiego',
    'Zielona',
    'Lipowa',
    'Jasna',
    'Cicha',
  ],
  city3: [
    'Stary Rynek',
    'Wroclawska',
    'Polna',
    'Sikorskiego',
    'Kosciuszki',
    'Ogrodowa',
    'Sadowa',
    'Krucza',
    'Mickiewicza',
    'Kwiatowa',
  ],
};

const form = document.getElementById('registration-form') as HTMLFormElement;
const submitError = document.getElementById('submit-error') as HTMLParagraphElement;

const citySelect = document.getElementById('city') as HTMLSelectElement;
const streetSelect = document.getElementById('street') as HTMLSelectElement;

function updateStreets(city: string): void {
  if (city && citiesWithStreets[city]) {
    citiesWithStreets[city].forEach((street, i) => {
      const option = document.createElement('option');
      option.value = `street${i + 1}`;
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
    localStorage.setItem('isRegistered', 'true');
    form.reset();
    window.location.href = 'menu.html';
  }
});
