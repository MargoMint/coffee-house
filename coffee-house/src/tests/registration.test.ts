import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import * as api from '../ts/api';
import * as auth from '../utils/auth';

vi.mock('../ts/api');
vi.mock('../utils/auth');
vi.mock('../utils/form-utils');
vi.mock('../utils/cities-data');

function createDom(): {
  form: HTMLFormElement;
  submitError: HTMLParagraphElement;
} {
  const form = document.createElement('form');
  form.id = 'registration-form';

  const submitError = document.createElement('p');
  submitError.id = 'submit-error';

  const citySelect = document.createElement('select');
  citySelect.id = 'city';

  const streetSelect = document.createElement('select');
  streetSelect.id = 'street';

  document.body.append(form, submitError, citySelect, streetSelect);

  return { form, submitError };
}

describe('registration', () => {
  let form: HTMLFormElement;
  let submitError: HTMLParagraphElement;

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();

    const dom = createDom();
    form = dom.form;
    submitError = dom.submitError;

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

    vi.mocked(auth.setIsLoginned).mockImplementation(() => {});
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('isLoginned check', () => {
    it('redirects to menu when user is logged in', async () => {
      vi.mocked(auth.isLoginned).mockReturnValue(true);

      await import('../ts/index-registration');

      expect(window.location.href).toBe('menu.html');
    });
  });

  describe('form submission', () => {
    it('handles successful registration', async () => {
      vi.mocked(auth.isLoginned).mockReturnValue(false);
      vi.mocked(api.registerUser).mockResolvedValue(null);
      vi.mocked(api.getProfile).mockResolvedValue({
        id: 1,
        login: 'ExampleUser',
        city: 'Gdansk',
        street: 'Dluga',
        houseNumber: 10,
        paymentMethod: 'card',
        createdAt: '2025-01-01',
      });

      await import('../ts/index-registration');

      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      form.dispatchEvent(submitEvent);

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

        expect(window.location.href).toBe('menu.html');
      });
    });

    it('shows error message when registration fails', async () => {
      vi.mocked(auth.isLoginned).mockReturnValue(false);
      vi.mocked(api.registerUser).mockResolvedValue('Registration failed');

      await import('../ts/index-registration');

      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      form.dispatchEvent(submitEvent);

      await vi.waitFor(() => {
        expect(submitError.textContent).toBe('Registration failed');
        expect(submitError.classList.contains('visible')).toBe(true);
        expect(auth.setIsLoginned).not.toHaveBeenCalled();
      });
    });
  });
});
