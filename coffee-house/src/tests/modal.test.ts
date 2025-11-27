import { vi, describe, it, expect, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderModal, closeModal, openModalById, setupModalActions } from '../utils/modal';
import { getProductById } from '../ts/api';
import { isLoginned } from '../utils/auth';
import { showToast } from '../utils/show-toast';
import { addToCart } from '../utils/add-to-cart';
import type { ProductCategory } from '../ts/types';

vi.mock('../ts/api');
vi.mock('../utils/auth');
vi.mock('../utils/show-toast');
vi.mock('../utils/add-to-cart');

const mockedGetProductById = vi.mocked(getProductById);
const mockedIsLoginned = vi.mocked(isLoginned);
const mockedShowToast = vi.mocked(showToast);
const mockedAddToCart = vi.mocked(addToCart);

describe('modal', () => {
  let modalContainer: HTMLElement;
  let modal: HTMLElement;
  let overlay: HTMLElement;

  const product = {
    id: 1,
    name: 'Test Product',
    description: 'Test Description',
    price: '10',
    discountPrice: '8',
    category: 'coffee' as ProductCategory,
  };

  beforeEach(() => {
    document.body.innerHTML = `
      <div class="overlay"></div>
      <div class="modal-wrapper">
        <div class="modal__container"></div>
      </div>
      <div class="menu__tab--active" id="coffee"></div>
      <div class="header__menu-count">0</div>
      <div class="menu-card" data-id="1"></div>
    `;

    modalContainer = document.querySelector('.modal__container')!;
    modal = document.querySelector('.modal-wrapper')!;
    overlay = document.querySelector('.overlay')!;

    vi.clearAllMocks();
  });

  it('closeModal removes active classes and clears content', () => {
    modal.classList.add('active');
    overlay.classList.add('active');
    modalContainer.innerHTML = 'content';

    closeModal(modal, overlay);

    expect(modal.classList.contains('active')).toBe(false);
    expect(overlay.classList.contains('active')).toBe(false);
    expect(modalContainer.innerHTML).toBe('');
  });

  it('setupModalActions calls addToCart and closes modal', async () => {
    mockedIsLoginned.mockReturnValue(true);
    renderModal(product, modalContainer);
    setupModalActions(modalContainer);

    const addBtn = modalContainer.querySelector('.modal__add')!;
    await userEvent.click(addBtn);

    expect(mockedAddToCart).toHaveBeenCalled();
    expect(modal.classList.contains('active')).toBe(false);
  });

  it('openModalById renders modal on successful fetch', async () => {
    mockedGetProductById.mockResolvedValue(product);
    mockedIsLoginned.mockReturnValue(true);

    await openModalById(1, overlay, modal, modalContainer);

    expect(modal.classList.contains('active')).toBe(true);
    expect(overlay.classList.contains('active')).toBe(true);
    expect(mockedGetProductById).toHaveBeenCalledWith(1);
    expect(modalContainer.innerHTML).toContain(product.name);
  });

  it('openModalById shows toast on error', async () => {
    mockedGetProductById.mockRejectedValue(new Error('fail'));

    await openModalById(1, overlay, modal, modalContainer);

    expect(mockedShowToast).toHaveBeenCalledWith('Something went wrong. Please, try again.');
    expect(modal.classList.contains('active')).toBe(false);
    expect(overlay.classList.contains('active')).toBe(false);
  });

  it('price updates when size or additive button clicked', async () => {
    mockedIsLoginned.mockReturnValue(false);
    renderModal(product, modalContainer);

    const sizeBtn = modalContainer.querySelector('.size-btn')!;
    const addBtn = modalContainer.querySelector('.add-btn')!;

    await userEvent.click(sizeBtn);
    expect(modalContainer.querySelector('.modal__price')?.textContent).toContain('10.00');

    await userEvent.click(addBtn);
    expect(modalContainer.querySelector('.modal__price')?.textContent).toContain('10.50');
  });
});
