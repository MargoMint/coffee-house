document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.header__burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuItems = document.querySelectorAll('.mobile-menu__item a');
  if (!burger || !mobileMenu || !menuItems) return;

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    mobileMenu.classList.toggle('open');

    if (mobileMenu.classList.contains('open')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      burger.classList.remove('active');
      mobileMenu.classList.remove('open');
    }
  });
});
