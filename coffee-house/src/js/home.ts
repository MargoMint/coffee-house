import { sliderData } from './products';

const SLIDE_INTERVAL = 6000;
let currentIndex = 0;
let autoTimer: number | undefined;
let isPaused = false;

document.addEventListener('DOMContentLoaded', () => {
  renderSlider();
  initSlider();
});

function renderSlider(): void {
  const sliderLine = document.querySelector('.slider__line') as HTMLElement;
  const controlsContainer = document.querySelector('.slider__controls') as HTMLElement;

  sliderLine.innerHTML = '';
  controlsContainer.innerHTML = '';

  sliderData.forEach((item, i) => {
    const slide = document.createElement('div');
    slide.className = 'slider__item';
    if (i === 0) slide.classList.add('active');
    slide.innerHTML = `
      <div class="slider__img-container"><img src="${item.img}" alt="${item.title}"></div>
      <div class="slider__content">
        <h3 class="slider__title">${item.title}</h3>
        <p class="slider__text">${item.text}</p>
        <span class="slider__price">${item.price}</span>
      </div>
    `;
    sliderLine.appendChild(slide);

    const control = document.createElement('span');
    control.className = 'slider__control-item';
    if (i === 0) control.classList.add('active');
    controlsContainer.appendChild(control);
  });
}

function initSlider(): void {
  const line = document.querySelector('.slider__line') as HTMLElement;
  const slides = document.querySelectorAll('.slider__item');
  const controls = document.querySelectorAll('.slider__control-item');
  const prevBtn = document.querySelector('.slider__btn_left') as HTMLElement;
  const nextBtn = document.querySelector('.slider__btn_right') as HTMLElement;

  const updateSlider = (index: number): void => {
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    controls.forEach((c, i) => c.classList.toggle('active', i === index));
    line.style.transform = `translateX(-${index * 100}%)`;
  };

  const nextSlide = (): void => {
    currentIndex = (currentIndex + 1) % slides.length;
    restartProgress();
    updateSlider(currentIndex);
  };

  const prevSlide = (): void => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    restartProgress();
    updateSlider(currentIndex);
  };

  const startAuto = (): void => {
    stopAuto();
    autoTimer = setInterval(() => {
      if (!isPaused) nextSlide();
    }, SLIDE_INTERVAL);
    restartProgress();
  };

  const stopAuto = (): void => clearInterval(autoTimer);

  const restartProgress = (): void => {
    controls.forEach((ctrl) => ctrl.classList.remove('active'));
    controls[currentIndex].classList.add('active');
  };

  line.addEventListener('mouseenter', () => (isPaused = true));
  line.addEventListener('mouseleave', () => (isPaused = false));

  let startX = 0;
  line.addEventListener('touchstart', (e) => (startX = e.touches[0].clientX));
  line.addEventListener('touchend', (e) => {
    let diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 50) diff > 0 ? prevSlide() : nextSlide();
  });

  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);

  updateSlider(currentIndex);
  startAuto();
}
