import type {
  Product,
  ApiResponse,
  ProductCategory,
  ProfileResponse,
  ConfirmOrderRequest,
  ConfirmOrderResponse,
} from './types';
import { AuthError } from './types';

const BASE_URL = 'https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com';

async function fetchData<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error('Failed to fetch');
  return response.json() as Promise<T>;
}

export async function getProducts(category?: ProductCategory): Promise<Product[]> {
  try {
    const json: ApiResponse = await fetchData<ApiResponse>(`${BASE_URL}/products`);
    const data = Array.isArray(json.data) ? json.data : [];
    return category ? data.filter((p) => p.category === category) : data;
  } catch (error) {
    console.error('getProducts error:', error);
    throw error;
  }
}

export async function getProductById(id: number): Promise<Product> {
  try {
    const json: ApiResponse<Product> = await fetchData<ApiResponse<Product>>(
      `${BASE_URL}/products/${id}`
    );
    if (!json.data) throw new Error('Product data is missing in response');
    return json.data;
  } catch (error) {
    console.error('getProductById error:', error);
    throw error;
  }
}

export async function getFavorites(): Promise<Product[]> {
  try {
    const json: ApiResponse = await fetchData<ApiResponse>(`${BASE_URL}/products/favorites`);
    if (!json.data) throw new Error('Favorites data missing');
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

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 400) return result.error || AuthError.InvalidData;
      if (response.status === 409) return result.error || AuthError.AlreadyExists;
      return result.error || AuthError.RegistrationFailed;
    }

    if (result.data.access_token) {
      localStorage.setItem('authToken', result.data.access_token);
    }

    return null;
  } catch (error) {
    console.error('Network error:', error);
    return AuthError.NetworkError;
  }
}

export async function loginUser(data: Record<string, string>): Promise<string | null> {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 401) return result.error || AuthError.IncorrectCredentials;
      return result.error || AuthError.LoginFailed;
    }

    if (result.data.access_token) {
      localStorage.setItem('authToken', result.data.access_token);
    }
    return null;
  } catch (error) {
    console.error('Network error:', error);
    return AuthError.NetworkError;
  }
}

export async function getProfile(): Promise<ProfileResponse['data'] | null> {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    const response = await fetch(`${BASE_URL}/auth/profile`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) return null;

    const json: ProfileResponse = await response.json();

    if (json.error || !json.data) return null;
    return json.data;
  } catch (error) {
    console.error('Profile request failed:', error);
    return null;
  }
}

export async function confirmOrder(data: ConfirmOrderRequest): Promise<string | null> {
  try {
    const response = await fetch(`${BASE_URL}/orders/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result: ConfirmOrderResponse = await response.json();

    if (!response.ok) {
      return result.error || 'Failed to confirm order';
    }

    return null;
  } catch (error) {
    console.error('Network error:', error);
    return AuthError.NetworkError;
  }
}
