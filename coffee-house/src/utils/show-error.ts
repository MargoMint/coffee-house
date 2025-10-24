export function showError(container: HTMLElement): void {
  container.innerHTML = '';

  const error = document.createElement('p');
  error.className = 'error-message';
  error.textContent = 'Something went wrong. Please, refresh the page';

  container.appendChild(error);
}
