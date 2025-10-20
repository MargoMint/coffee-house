export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
}

export type ProductCategory = 'coffee' | 'tea' | 'dessert';

export interface SliderItem {
  img: string;
  title: string;
  text: string;
  price: string;
}

export interface SizeOption {
  label: string;
  volume: string;
  price: number;
}

export interface CategoryConfigItem {
  sizes: SizeOption[];
  additives: string[];
}
