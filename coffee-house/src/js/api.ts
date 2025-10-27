import type { Product, ProductCategory } from './types';

const BASE_URL = 'https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com';

interface ApiResponse {
  data?: Product[];
  message?: string;
  error?: string;
}

export async function getProducts(category?: ProductCategory): Promise<Product[]> {
  try {
    const response = await fetch(`${BASE_URL}/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const json: ApiResponse = await response.json();

    const data = Array.isArray(json.data) ? json.data : [];

    return category ? data.filter((p) => p.category === category) : data;
  } catch (error) {
    console.error('getProducts error:', error);
    throw error;
  }
}

export async function getProductById(id: number): Promise<Product> {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }

    const json: { data?: Product } = await response.json();
    if (!json.data) {
      throw new Error('Product data is missing in response');
    }
    return json.data;
  } catch (error) {
    console.error('getProductById error:', error);
    throw error;
  }
}

export async function getFavorites(): Promise<Product[]> {
  try {
    const response = await fetch(`${BASE_URL}/products/favorites`);
    if (!response.ok) {
      throw new Error('Failed to fetch favorite products');
    }
    const json: ApiResponse = await response.json();
    if (!json.data) {
      throw new Error('Favorites data missing');
    }
    return json.data;
  } catch (error) {
    console.error('getFavorites error:', error);
    throw error;
  }
}

export async function registerUser(data: Record<string, string | number>): Promise<string | null> {
  try {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const result = await response.json();

      if (response.status === 400) {
        return result.error || 'Invalid data provided';
      }

      if (response.status === 409) {
        return result.error || 'User already exists';
      }

      return result.error || 'Registration failed';
    }

    return null;
  } catch (error) {
    console.error('Network error:', error);
    return 'Network error. Please try again later.';
  }
}
