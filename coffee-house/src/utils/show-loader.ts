export function showLoader(container: HTMLElement): void {
  container.innerHTML = '';

  const loader = document.createElement('div');
  loader.className = 'loader';

  container.appendChild(loader);
}
