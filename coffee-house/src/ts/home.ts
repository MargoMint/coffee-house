import { getFavorites } from './api';
import type { SliderItem } from './types';
import { showError } from '../utils/show-error';
import { showLoader } from '../utils/show-loader';
import { renderSlider, initSlider } from '../utils/slider-utils';

document.addEventListener('DOMContentLoaded', async () => {
  const sliderContainer = document.querySelector('.slider') as HTMLElement;
  const sliderLine = sliderContainer.querySelector('.slider__line') as HTMLElement;

  if (!sliderContainer || !sliderLine) return;

  showLoader(sliderLine);
  try {
    const favorites = await getFavorites();

    const sliderData: SliderItem[] = favorites.map((item) => ({
      img: `/img/products/${item.category}/${item.id}.jpg`,
      title: item.name,
      text: item.description,
      price: item.discountPrice ? `$${item.discountPrice}` : `$${item.price}`,
    }));

    renderSlider(sliderData);
    initSlider();
  } catch (err) {
    console.error('slider error:', err);
    showError(sliderContainer);
  }
});
