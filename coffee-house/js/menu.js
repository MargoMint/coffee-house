document.addEventListener('DOMContentLoaded', () => {
  const menuLink = document.getElementById('menu-link');
  const cardsSection = document.querySelector('.menu__cards');
  const loadMoreButton = document.querySelector('.load-more');

  if (window.location.pathname.includes('menu.html') && menuLink) {
    menuLink.classList.add('header__menu--active');
  }

  setupTabs();
  cardsSection.classList.add('menu-section--active');
  renderCards(products.coffee);

  window.addEventListener('resize', () => {
    const activeTab = document.querySelector('.menu__tab--active');
    if (activeTab) {
      const category = activeTab.id;
      renderCards(products[category]);
    }
  });

  loadMoreButton.addEventListener('click', () => {
    const activeTab = document.querySelector('.menu__tab--active');
    if (!activeTab) return;

    const category = activeTab.id;
    const productsArray = products[category];

    const remainingCards = productsArray.slice(4);
    const moreHTML = remainingCards.map(createCard).join('');
    cardsSection.insertAdjacentHTML('beforeend', moreHTML);

    loadMoreButton.classList.add('hidden');
  });

  function setupTabs() {
    const tabs = document.querySelectorAll('.menu__tab');

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
    const loadMoreButton = document.querySelector('.load-more');

    container.innerHTML = '';
    loadMoreButton.classList.add('hidden');

    const isMobile = window.innerWidth <= 768;
    const maxInitialCards = isMobile ? 4 : productsArray.length;
    const visibleProducts = productsArray.slice(0, maxInitialCards);

    container.innerHTML = visibleProducts.map(createCard).join('');

    if (isMobile && productsArray.length > 4) {
      loadMoreButton.classList.remove('hidden');
    }
  }

  function createCard(item) {
    return `
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
    `;
  }
});
