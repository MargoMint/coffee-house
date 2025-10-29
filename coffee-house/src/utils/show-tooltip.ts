export function showTooltip(target: HTMLElement, text: string): void {
  const existingTooltip = document.querySelector('.tooltip');
  if (existingTooltip) existingTooltip.remove();

  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.innerHTML = text;
  document.body.appendChild(tooltip);

  const targetRect = target.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();

  const top = window.scrollY + targetRect.top - tooltipRect.height - 8;
  const left = window.scrollX + targetRect.left + (targetRect.width - tooltipRect.width) / 2;

  tooltip.style.top = `${top}px`;
  tooltip.style.left = `${left}px`;
  tooltip.classList.add('visible');

  const removeTooltip = (): void => {
    tooltip.classList.remove('visible');
    tooltip.addEventListener('transitionend', () => tooltip.remove(), { once: true });
    target.removeEventListener('mouseleave', removeTooltip);
    target.removeEventListener('blur', removeTooltip);
  };

  target.addEventListener('mouseleave', removeTooltip);
  target.addEventListener('blur', removeTooltip);
}
