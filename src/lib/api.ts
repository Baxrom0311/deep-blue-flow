import {
  Product,
  Category,
  PaginatedResponse,
  Album,
  Certificate,
  ContactFormData,
  InstagramVideo,
  SiteSettings,
} from '@/types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export class ApiError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

function errorMessage(body: unknown): string {
  if (!body || typeof body !== 'object') return 'Server xatosi';
  const err = body as { message?: unknown; detail?: unknown };
  if (Array.isArray(err.detail)) {
    const msgs = err.detail.map((item: unknown) => {
      if (!item || typeof item !== 'object') return '';
      const v = item as { message?: unknown; msg?: unknown };
      return typeof v.message === 'string' ? v.message : typeof v.msg === 'string' ? v.msg : '';
    }).filter(Boolean);
    if (msgs.length) return msgs.join('; ');
  }
  if (typeof err.message === 'string') return err.message;
  return typeof err.detail === 'string' ? err.detail : 'Server xatosi';
}

async function fetchAPI<T = unknown>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  const body: unknown = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(errorMessage(body), res.status);
  // Unwrap Backend {success, data} wrapper if present
  return (body as { data?: T } | null)?.data !== undefined
    ? ((body as { data: T }).data as T)
    : (body as T);
}

export const api = {
  getSettings: () => fetchAPI<SiteSettings>('/settings/public'),
  getProducts: (params?: { page?: number; per_page?: number; category_id?: string; is_on_sale?: boolean; search?: string }) => {
    const sp = new URLSearchParams();
    if (params?.page) sp.set('page', String(params.page));
    if (params?.per_page) sp.set('per_page', String(params.per_page));
    if (params?.category_id) sp.set('category_id', params.category_id);
    if (params?.is_on_sale) sp.set('is_on_sale', 'true');
    if (params?.search?.trim()) sp.set('search', params.search.trim());
    return fetchAPI<PaginatedResponse<Product>>(`/products?${sp.toString()}`);
  },
  getFeaturedProducts: () => fetchAPI<Product[]>('/products/featured'),
  getProduct: (id: string) => fetchAPI<Product>(`/products/${id}`),
  getCategories: () => fetchAPI<Category[]>('/categories'),
  getCertificates: () => fetchAPI<Certificate[] | PaginatedResponse<Certificate>>('/certificates'),
  getAlbums: (category?: string) => {
    const sp = category ? `?category=${category}` : '';
    return fetchAPI<Album[] | PaginatedResponse<Album>>(`/gallery/albums${sp}`);
  },
  getAlbum: (id: string) => fetchAPI<Album>(`/gallery/albums/${id}`),
  getInstagramPosts: () => fetchAPI<InstagramVideo[]>('/instagram/posts'),
  submitContact: (data: ContactFormData) =>
    fetchAPI<unknown>('/contacts', { method: 'POST', body: JSON.stringify(data) }),
  chat: (message: string, session_id: string | null) =>
    fetchAPI<{ reply: string; session_id: string }>('/chat', { method: 'POST', body: JSON.stringify({ message, session_id }) }),
};
