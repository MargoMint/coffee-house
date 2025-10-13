const SLIDE_INTERVAL = 6000;
let currentIndex = 0;
let autoTimer = null;
let isPaused = false;

document.addEventListener("DOMContentLoaded", () => {
  renderSlider();
  initSlider();
});

function renderSlider() {
  const sliderLine = document.querySelector(".slider__line");
  const controlsContainer = document.querySelector(".slider__controls");

  sliderLine.innerHTML = "";
  controlsContainer.innerHTML = "";

  sliderData.forEach((item, i) => {
    const slide = document.createElement("div");
    slide.className = "slider__item";
    if (i === 0) slide.classList.add("active");
    slide.innerHTML = `
      <div class="slider__img-container"><img src="${item.img}" alt="${item.title}"></div>
      <div class="slider__content">
        <h3 class="slider__title">${item.title}</h3>
        <p class="slider__text">${item.text}</p>
        <span class="slider__price">${item.price}</span>
      </div>
    `;
    sliderLine.appendChild(slide);

    const control = document.createElement("span");
    control.className = "slider__control-item";
    if (i === 0) control.classList.add("active");
    controlsContainer.appendChild(control);
  });
}

function initSlider() {
  const line = document.querySelector(".slider__line");
  const slides = document.querySelectorAll(".slider__item");
  const controls = document.querySelectorAll(".slider__control-item");
  const prevBtn = document.querySelector(".slider__btn_left");
  const nextBtn = document.querySelector(".slider__btn_right");

  const updateSlider = (index) => {
    slides.forEach((s, i) => s.classList.toggle("active", i === index));
    controls.forEach((c, i) => c.classList.toggle("active", i === index));
    line.style.transform = `translateX(-${index * 100}%)`;
  };

  const nextSlide = () => {
    currentIndex = (currentIndex + 1) % slides.length;
    restartProgress();
    updateSlider(currentIndex);
  };

  const prevSlide = () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    restartProgress();
    updateSlider(currentIndex);
  };

  const startAuto = () => {
    stopAuto();
    autoTimer = setInterval(() => {
      if (!isPaused) nextSlide();
    }, SLIDE_INTERVAL);
    restartProgress();
  };

  const stopAuto = () => clearInterval(autoTimer);

  const restartProgress = () => {
    controls.forEach((ctrl) => (ctrl.classList.remove("active")));
    controls[currentIndex].classList.add("active");
  };

  line.addEventListener("mouseenter", () => (isPaused = true));
  line.addEventListener("mouseleave", () => (isPaused = false));

  let startX = 0;
  line.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX));
  line.addEventListener("touchend", (e) => {
    let diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 50) diff > 0 ? prevSlide() : nextSlide();
  });

  nextBtn.addEventListener("click", nextSlide);
  prevBtn.addEventListener("click", prevSlide);

  updateSlider(currentIndex);
  startAuto();
}
