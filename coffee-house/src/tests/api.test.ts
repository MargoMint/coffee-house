import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getProducts,
  getProductById,
  getFavorites,
  registerUser,
  loginUser,
  getProfile,
  confirmOrder,
} from '../ts/api';
import { AuthError } from '../ts/types';

const mockFetch = vi.fn();

function mockResponse(ok: boolean, jsonData: unknown, status = 200): Response {
  return {
    ok,
    status,
    json: () => Promise.resolve(jsonData),
  } as Response;
}

beforeEach(() => {
  vi.clearAllMocks();
  globalThis.fetch = mockFetch;
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('getProducts', () => {
  it('returns the product list on success', async () => {
    mockFetch.mockResolvedValueOnce(
      mockResponse(true, { data: [{ id: 1, name: 'Example coffee', category: 'coffee' }] })
    );

    const result = await getProducts();
    expect(result).toEqual([{ id: 1, name: 'Example coffee', category: 'coffee' }]);
  });

  it('filters products by category', async () => {
    mockFetch.mockResolvedValueOnce(
      mockResponse(true, {
        data: [
          { id: 1, category: 'coffee' },
          { id: 2, category: 'tea' },
          { id: 3, category: 'dessert' },
        ],
      })
    );

    const result = await getProducts('coffee');
    expect(result).toEqual([{ id: 1, category: 'coffee' }]);
  });

  it('throws an error when the response is not ok', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse(false, {}));
    await expect(getProducts()).rejects.toThrow('Failed to fetch');
  });
});

describe('getProductById', () => {
  it('returns a product by ID', async () => {
    mockFetch.mockResolvedValueOnce(
      mockResponse(true, {
        data: { id: 1, name: 'First coffee', category: 'coffee' },
      })
    );

    const result = await getProductById(1);
    expect(result).toEqual({ id: 1, name: 'First coffee', category: 'coffee' });
  });

  it('throws an error when the data field is missing', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse(true, {}));
    await expect(getProductById(1)).rejects.toThrow('Product data is missing in response');
  });

  it('throws an error when the response is not ok', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse(false, {}, 500));
    await expect(getProductById(1)).rejects.toThrow('Failed to fetch');
  });
});

describe('getFavorites', () => {
  it('returns the list of favorite products', async () => {
    mockFetch.mockResolvedValueOnce(
      mockResponse(true, {
        data: [{ id: 10, name: 'Example product', category: 'tea' }],
      })
    );

    const result = await getFavorites();
    expect(result).toEqual([{ id: 10, name: 'Example product', category: 'tea' }]);
  });

  it('throws an error when the data field is missing', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse(true, {}));
    await expect(getFavorites()).rejects.toThrow('Favorites data missing');
  });

  it('throws an error when the response is not ok', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse(false, {}));
    await expect(getFavorites()).rejects.toThrow('Failed to fetch');
  });
});

describe('registerUser', () => {
  const payload = { login: 'User', password: 'Qwerty1!' };

  it('stores the token and returns null on successful registration', async () => {
    mockFetch.mockResolvedValueOnce(
      mockResponse(true, {
        data: { access_token: 'TOKEN12345' },
      })
    );

    const result = await registerUser(payload);

    expect(result).toBeNull();
    expect(localStorage.getItem('authToken')).toBe('TOKEN12345');
  });

  it('returns InvalidData error message on 400 response', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse(false, { error: 'Bad data' }, 400));
    const result = await registerUser(payload);
    expect(result).toBe('Bad data');
  });

  it('returns AlreadyExists error message on 409 response', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse(false, { error: 'User already exists' }, 409));
    const result = await registerUser(payload);
    expect(result).toBe('User already exists');
  });

  it('returns the server error message for any other failure', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse(false, { error: 'Unknown' }, 500));
    const result = await registerUser(payload);
    expect(result).toBe('Unknown');
  });

  it('returns NetworkError on network failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));
    const result = await registerUser(payload);
    expect(result).toBe(AuthError.NetworkError);
  });
});

describe('loginUser', () => {
  const payload = { login: 'User', password: 'Qwerty1' };

  it('stores the token and returns null on successful login', async () => {
    mockFetch.mockResolvedValueOnce(
      mockResponse(true, { data: { access_token: 'LOGINTOKEN12345' } })
    );

    const result = await loginUser(payload);
    expect(result).toBeNull();
    expect(localStorage.getItem('authToken')).toBe('LOGINTOKEN12345');
  });

  it('returns IncorrectCredentials on 401 response', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse(false, { error: 'Wrong creds' }, 401));
    const result = await loginUser(payload);
    expect(result).toBe('Wrong creds');
  });

  it('returns LoginFailed for any other server error', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse(false, { error: 'Server down' }, 500));
    const result = await loginUser(payload);
    expect(result).toBe('Server down');
  });

  it('returns NetworkError on network failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network problem'));
    const result = await loginUser(payload);
    expect(result).toBe(AuthError.NetworkError);
  });
});

describe('getProfile', () => {
  const profile = {
    login: 'ExampleUser',
    city: 'Gdansk',
    street: 'Dluga',
    houseNumber: 10,
    paymentMethod: 'card',
    createdAt: '2025-01-01',
  };

  it('returns profile when token exists and the request succeeds', async () => {
    localStorage.setItem('authToken', 'TOKEN');
    mockFetch.mockResolvedValueOnce(mockResponse(true, { data: profile }));
    const result = await getProfile();
    expect(result).toEqual(profile);
  });

  it('returns null when no token is found', async () => {
    const result = await getProfile();
    expect(result).toBeNull();
  });

  it('returns null when response is not ok', async () => {
    localStorage.setItem('authToken', 'TOKEN');
    mockFetch.mockResolvedValueOnce(mockResponse(false, {}, 401));
    const result = await getProfile();
    expect(result).toBeNull();
  });

  it('returns null when the response contains an error field', async () => {
    localStorage.setItem('authToken', 'TOKEN');
    mockFetch.mockResolvedValueOnce(mockResponse(true, { error: 'bad token' }));
    const result = await getProfile();
    expect(result).toBeNull();
  });
});

describe('confirmOrder', () => {
  const order = {
    items: [{ productId: 1, size: 'L', additives: [], quantity: 1 }],
    totalPrice: 7.5,
  };

  it('returns null on successful order confirmation', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse(true, { message: 'ok' }));
    const result = await confirmOrder(order);
    expect(result).toBeNull();
  });

  it('returns an error message on failure', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse(false, { error: 'Order failed' }, 400));
    const result = await confirmOrder(order);
    expect(result).toBe('Order failed');
  });

  it('returns NetworkError on network failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network down'));
    const result = await confirmOrder(order);
    expect(result).toBe(AuthError.NetworkError);
  });
});
