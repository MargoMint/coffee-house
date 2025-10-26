export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  discountPrice: string | null;
  category: ProductCategory;
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

export interface CartItem {
  id: number;
  name: string;
  size: string;
  additives: string[];
  price: number;
  discountPrice?: number;
  img: string;
}
