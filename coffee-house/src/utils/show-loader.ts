export function showLoader(container: HTMLElement): void {
  container.innerHTML = '';

  const loader = document.createElement('p');
  loader.className = 'loader';

  loader.textContent = 'Loading...';

  container.appendChild(loader);
}
