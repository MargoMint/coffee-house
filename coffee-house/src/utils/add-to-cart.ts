export function addToCart(counter: HTMLElement): void {
  const currentCount = parseInt(counter.textContent || '0', 10);
  const newCount = currentCount + 1;
  counter.textContent = newCount.toString();

  localStorage.setItem('productCount', newCount.toString());
}
