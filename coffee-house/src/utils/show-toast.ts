export function showToast(message: string, duration = 3000): void {
  if (document.querySelector('.toast')) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

export function confirmToast(message: string, onConfirm: () => void): void {
  let overlay = document.querySelector<HTMLElement>('.overlay');

  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);
  }

  overlay.classList.add('active');

  const toast = document.createElement('div');

  toast.className = 'toast toast--confirm';

  toast.innerHTML = `
    <p class="toast__text">${message}</p>
    <div class="toast__buttons">
      <button class="button button-secondary toast__btn--cancel">Cancel</button>
      <button class="button button-secondary toast__btn--confirm">Logout</button>
    </div>
  `;

  document.body.appendChild(toast);

  const cancelBtn = document.querySelector('.toast__btn--cancel');
  const confirmBtn = document.querySelector('.toast__btn--confirm');

  if (!cancelBtn || !confirmBtn) return;

  cancelBtn.addEventListener('click', () => {
    toast.remove();
    overlay.classList.remove('active');
  });
  overlay.addEventListener('click', () => toast.remove());

  confirmBtn?.addEventListener('click', () => {
    onConfirm();
    toast.remove();
  });
}
