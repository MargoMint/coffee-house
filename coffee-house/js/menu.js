document.addEventListener('DOMContentLoaded', () => {
  const menuLink = document.getElementById('menu-link');
  const cardsSection = document.querySelector('.menu__cards');

  if (window.location.pathname.includes('menu.html') && menuLink) {
    menuLink.classList.add('header__menu--active');
  }

  setupTabs();

  cardsSection.classList.add('menu-section--active');
  renderCards(products.coffee);
});

function setupTabs() {
  const tabs = document.querySelectorAll('.menu__tab');
  const cardsSection = document.querySelector('.menu__cards');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('menu__tab--active'));
      tab.classList.add('menu__tab--active');
      const categoryId = tab.id;
      cardsSection.classList.add('menu-section--active');
      renderCards(products[categoryId]);
    });
  });
}

function renderCards(productsArray) {
  const container = document.querySelector('.menu__cards');
  container.innerHTML = '';

  const cardsHTML = productsArray
    .map(
      (item) => `
      <div class="menu-card">
        <img src="${item.image}" alt="${item.name}" class="menu-card__img" />
        <div class="menu-card__content">
          <div class="menu-card__text">
            <h3 class="menu-card__title">${item.name}</h3>
            <p class="menu-card__desc">${item.description}</p>
          </div>
          <span class="menu-card__price">${item.price}</span>
        </div>
      </div>
    `
    )
    .join('');

  container.innerHTML = cardsHTML;
}
