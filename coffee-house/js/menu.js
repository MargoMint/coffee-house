document.addEventListener('DOMContentLoaded', () => {
  const menuLink = document.getElementById('menu-link');

  if (window.location.pathname.includes('menu.html')) {
    menuLink.classList.add('header__menu--active');
  }

  setupTabs();
});

function setupTabs(cards) {
  const tabs = document.querySelectorAll('.menu__tab');
  const sections = document.querySelectorAll('.menu-section');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('menu__tab--active'));
      tab.classList.add('menu__tab--active');

      sections.forEach((section) => {
        section.classList.remove('menu-section--active');
      });

      const categoryId = tab.id;
      const activeSection = document.querySelector(`.${categoryId}`);
      if (activeSection) {
        activeSection.classList.add('menu-section--active');
      }
    });
  });
}
