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

export enum AuthError {
  InvalidData = 'Invalid data provided',
  AlreadyExists = 'User already exists',
  LoginFailed = 'Login failed',
  IncorrectCredentials = 'Incorrect login or password',
  NetworkError = 'Network error. Please try again later.',
  RegistrationFailed = 'Registration failed',
}

export interface ApiResponse<T = Product[]> {
  data?: T;
  message?: string;
  error?: string;
}
