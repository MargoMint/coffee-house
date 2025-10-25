document.addEventListener('DOMContentLoaded', () => {
  const counter = document.querySelector<HTMLElement>('.header__menu-count');
  const savedCount = localStorage.getItem('productCount');

  const burger = document.querySelector('.header__burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuItems = document.querySelectorAll('.mobile-menu__item a');
  if (!burger || !mobileMenu || !menuItems.length) return;

  if (counter) {
    counter.textContent = savedCount || '0';
  }

  const closeMenu = (): void => {
    burger.classList.remove('active');
    mobileMenu.classList.remove('open');

    setTimeout(() => {
      document.body.style.overflow = '';
    }, 600);
  };

  burger.addEventListener('click', () => {
    const isOpening = !mobileMenu.classList.contains('open');
    burger.classList.toggle('active');
    mobileMenu.classList.toggle('open');

    if (isOpening) {
      document.body.style.overflow = 'hidden';
    } else {
      closeMenu();
    }
  });

  menuItems.forEach((item) => {
    item.addEventListener('click', () => {
      closeMenu();
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      burger.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
});
