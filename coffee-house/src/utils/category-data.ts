import type { ProductCategory, CategoryConfigItem } from '../ts/types';

export const categoryConfig: Record<ProductCategory, CategoryConfigItem> = {
  coffee: {
    sizes: [
      { label: 'S', volume: '200 ml', price: 0 },
      { label: 'M', volume: '300 ml', price: 0.5 },
      { label: 'L', volume: '400 ml', price: 1 },
      { label: 'XL', volume: '500 ml', price: 1.5 },
    ],
    additives: ['Sugar', 'Cinnamon', 'Syrup'],
  },
  tea: {
    sizes: [
      { label: 'S', volume: '200 ml', price: 0 },
      { label: 'M', volume: '300 ml', price: 0.5 },
      { label: 'L', volume: '400 ml', price: 1 },
      { label: 'XL', volume: '500 ml', price: 1.5 },
    ],
    additives: ['Sugar', 'Lemon', 'Syrup'],
  },
  dessert: {
    sizes: [
      { label: 'S', volume: '50 g', price: 0 },
      { label: 'M', volume: '100 g', price: 0.5 },
      { label: 'L', volume: '200 g', price: 1 },
      { label: 'XL', volume: '300 g', price: 1.5 },
    ],
    additives: ['Berries', 'Nuts', 'Jam'],
  },
};
