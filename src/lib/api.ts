import {
  Product,
  Category,
  PaginatedResponse,
  Album,
  Certificate,
  ContactFormData,
  SiteSettings,
} from '@/types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

async function fetchAPI<T = unknown>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  const json = await res.json();
  // Unwrap Backend {success, data} wrapper if present
  return json.data !== undefined ? (json.data as T) : (json as T);
}

export const api = {
  getSettings: () => fetchAPI<SiteSettings>('/settings/public'),
  getProducts: (params?: { page?: number; per_page?: number; category_id?: string; is_on_sale?: boolean }) => {
    const sp = new URLSearchParams();
    if (params?.page) sp.set('page', String(params.page));
    if (params?.per_page) sp.set('per_page', String(params.per_page));
    if (params?.category_id) sp.set('category_id', params.category_id);
    if (params?.is_on_sale) sp.set('is_on_sale', 'true');
    return fetchAPI<PaginatedResponse<Product>>(`/products?${sp.toString()}`);
  },
  getFeaturedProducts: () => fetchAPI<PaginatedResponse<Product>>('/products/featured'),
  getProduct: (id: string) => fetchAPI<Product>(`/products/${id}`),
  getCategories: () => fetchAPI<Category[]>('/categories'),
  getCertificates: () => fetchAPI<Certificate[] | PaginatedResponse<Certificate>>('/certificates'),
  getAlbums: (category?: string) => {
    const sp = category ? `?category=${category}` : '';
    return fetchAPI<Album[] | PaginatedResponse<Album>>(`/gallery/albums${sp}`);
  },
  getAlbum: (id: string) => fetchAPI<Album>(`/gallery/albums/${id}`),
  getInstagramPosts: () => fetchAPI<unknown>('/instagram/posts'),
  submitContact: (data: ContactFormData) =>
    fetchAPI<unknown>('/contacts', { method: 'POST', body: JSON.stringify(data) }),
  chat: (message: string, session_id: string) =>
    fetchAPI<unknown>('/chat', { method: 'POST', body: JSON.stringify({ message, session_id }) }),
};
