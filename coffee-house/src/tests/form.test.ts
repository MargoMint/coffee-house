import { describe, it, expect, beforeEach } from 'vitest';
import { showFormError, clearFormError, showValid, setFormButtonState } from '../utils/form-utils';

describe('Form', () => {
  let input: HTMLInputElement;
  let errorEl: HTMLElement;
  let button: HTMLButtonElement;

  beforeEach(() => {
    document.body.innerHTML = `
      <form class="form">
        <div class="form__field">
          <input class="form__input" name="login" id="login" />
          <span class="form__error"></span>
        </div>
        <input type="password" name="password" id="password" class="form__input" />
        <button class="button-registration"></button>
      </form>
    `;
    input = document.querySelector<HTMLInputElement>('#login')!;
    errorEl = input.closest('.form__field')!.querySelector('.form__error')!;
    button = document.querySelector<HTMLButtonElement>('.button-registration')!;
  });

  it('showFormError adds invalid class and sets error message', () => {
    showFormError(input, 'Error message');
    expect(input.classList.contains('invalid')).toBe(true);
    expect(input.classList.contains('valid')).toBe(false);
    expect(errorEl.textContent).toBe('Error message');
    expect(errorEl.classList.contains('visible')).toBe(true);
  });

  it('clearFormError removes classes and clears error message', () => {
    input.classList.add('invalid', 'valid');
    errorEl.textContent = 'Error';
    errorEl.classList.add('visible');
    clearFormError(input);
    expect(input.classList.contains('invalid')).toBe(false);
    expect(input.classList.contains('valid')).toBe(false);
    expect(errorEl.textContent).toBe('');
    expect(errorEl.classList.contains('visible')).toBe(false);
  });

  it('showValid adds valid class and removes error message', () => {
    input.classList.add('invalid');
    errorEl.textContent = 'Error';
    errorEl.classList.add('visible');
    showValid(input);
    expect(input.classList.contains('valid')).toBe(true);
    expect(input.classList.contains('invalid')).toBe(false);
    expect(errorEl.textContent).toBe('');
    expect(errorEl.classList.contains('visible')).toBe(false);
  });

  it('setFormButtonState enables or disables button', () => {
    setFormButtonState(button, true);
    expect(button.disabled).toBe(false);
    setFormButtonState(button, false);
    expect(button.disabled).toBe(true);
  });
});
