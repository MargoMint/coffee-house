import type { ProductCategory, CategoryConfigItem } from './types';

export const categoryConfig: Record<ProductCategory, CategoryConfigItem> = {
  coffee: {
    sizes: [
      { label: 'S', volume: '200 ml', price: 0 },
      { label: 'M', volume: '300 ml', price: 0.5 },
      { label: 'L', volume: '400 ml', price: 1 },
    ],
    additives: ['Sugar', 'Cinnamon', 'Syrup'],
  },
  tea: {
    sizes: [
      { label: 'S', volume: '200 ml', price: 0 },
      { label: 'M', volume: '300 ml', price: 0.5 },
      { label: 'L', volume: '400 ml', price: 1 },
    ],
    additives: ['Sugar', 'Lemon', 'Syrup'],
  },
  dessert: {
    sizes: [
      { label: 'S', volume: '50 g', price: 0 },
      { label: 'M', volume: '100 g', price: 0.5 },
      { label: 'L', volume: '200 g', price: 1 },
    ],
    additives: ['Berries', 'Nuts', 'Jam'],
  },
};
