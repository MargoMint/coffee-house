import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import * as api from '../ts/api';
import * as auth from '../utils/auth';
import * as updates from '../utils/update-cart-prices';

vi.mock('../ts/api');
vi.mock('../utils/auth');
vi.mock('../utils/form-utils');
vi.mock('../utils/update-cart-prices');

function createDOM(): {
  form: HTMLFormElement;
  submitError: HTMLParagraphElement;
  button: HTMLButtonElement;
} {
  const form = document.createElement('form');
  form.id = 'signin-form';

  const loginInput = document.createElement('input');
  loginInput.name = 'login';
  loginInput.value = 'ExampleUser';

  const passwordInput = document.createElement('input');
  passwordInput.name = 'password';
  passwordInput.value = 'pass123';

  const button = document.createElement('button');
  button.className = 'button-signin';

  const submitError = document.createElement('p');
  submitError.id = 'submit-error';

  form.append(loginInput, passwordInput, button);
  document.body.append(form, submitError);

  return { form, submitError, button };
}

describe('login', () => {
  let form: HTMLFormElement;
  let submitError: HTMLParagraphElement;
  let button: HTMLButtonElement;

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    const dom = createDOM();
    form = dom.form;
    submitError = dom.submitError;
    button = dom.button;

    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    });

    Object.defineProperty(window, 'localStorage', {
      value: {
        setItem: vi.fn(),
        getItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    });

    vi.mocked(auth.isLoginned).mockReturnValue(false);
    vi.mocked(auth.setIsLoginned).mockImplementation(() => {});
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('redirects to menu if user already logged in', async () => {
    vi.mocked(auth.isLoginned).mockReturnValue(true);

    await import('../ts/index-signin');

    expect(window.location.href).toBe('menu.html');
  });

  it('shows error when loginUser returns error', async () => {
    vi.mocked(api.loginUser).mockResolvedValue('Invalid credentials');

    await import('../ts/index-signin');

    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    await vi.waitFor(() => {
      expect(submitError.textContent).toBe('Invalid credentials');
      expect(submitError.classList.contains('visible')).toBe(true);
      expect(button.disabled).toBe(false);
    });
  });

  it('successful login saves profile, calls updateCartPrices and redirects', async () => {
    vi.mocked(api.loginUser).mockResolvedValue(null);

    vi.mocked(api.getProfile).mockResolvedValue({
      id: 1,
      login: 'ExampleUser',
      city: 'Gdansk',
      street: 'Dluga',
      houseNumber: 10,
      paymentMethod: 'card',
      createdAt: '2025-01-01',
    });

    vi.mocked(updates.updateCartPricesAfterLogin).mockResolvedValue();

    await import('../ts/index-signin');

    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    await vi.waitFor(() => {
      expect(auth.setIsLoginned).toHaveBeenCalledWith(true);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'userProfile',
        JSON.stringify({
          city: 'Gdansk',
          street: 'Dluga',
          houseNumber: 10,
          paymentMethod: 'card',
        })
      );

      expect(updates.updateCartPricesAfterLogin).toHaveBeenCalled();

      expect(window.location.href).toBe('menu.html');
    });
  });
});
