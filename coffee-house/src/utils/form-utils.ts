import {
  validateLogin,
  validatePassword,
  validateConfirmPassword,
  validateCity,
  validateStreet,
  validateHouseNumber,
} from './validation-scheme';

export function showFormError(input: HTMLInputElement | HTMLSelectElement, message: string): void {
  const field = input.closest('.form__field');
  const errorEl = field?.querySelector('.form__error');
  input.classList.add('invalid');
  input.classList.remove('valid');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('visible');
  }
}

export function clearFormError(input: HTMLInputElement | HTMLSelectElement): void {
  const field = input.closest('.form__field');
  const errorEl = field?.querySelector('.form__error');
  input.classList.remove('invalid');
  input.classList.remove('valid');
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
  }
}

export function showValid(input: HTMLInputElement | HTMLSelectElement): void {
  input.classList.remove('invalid');
  input.classList.add('valid');
  const field = input.closest('.form__field');
  const errorEl = field?.querySelector('.form__error');
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
  }
}

export function setFormButtonState(button: HTMLButtonElement, enabled: boolean): void {
  button.disabled = !enabled;
}

export function initFormValidation(form: HTMLFormElement): void {
  const inputs = form.querySelectorAll<HTMLInputElement | HTMLSelectElement>('.form__input');
  const button = form.querySelector<HTMLButtonElement>('.button-registration')!;

  inputs.forEach((input) => {
    input.addEventListener('blur', () => validateField(input, form));
    input.addEventListener('focus', () => clearFormError(input));
  });

  form.addEventListener('input', () => {
    const allValid = Array.from(inputs).every((input) => !validateField(input, form, false));
    setFormButtonState(button, allValid);
  });
}

function validateField(input: HTMLInputElement | HTMLSelectElement, form: HTMLFormElement, show = true): boolean {
  let error: string | null = null;

  switch (input.name) {
    case 'login':
      error = validateLogin(input.value);
      break;
    case 'password':
      error = validatePassword(input.value);
      break;
    case 'confirm-password':
      const password = form.querySelector<HTMLInputElement>('#password')!;
      error = validateConfirmPassword(password.value, input.value);
      break;
    case 'city':
      error = validateCity(input.value);
      break;
    case 'street':
      error = validateStreet(input.value);
      break;
    case 'house':
      error = validateHouseNumber(input.value);
      break;
  }

  if (show) {
    if (error) showFormError(input, error);
    else showValid(input);
  }
  if (!show) clearFormError(input);

  return !!error;
}