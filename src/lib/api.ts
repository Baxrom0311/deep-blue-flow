const BASE_URL = 'https://api.ecocompany.uz/api/v1';

async function fetchAPI<T = any>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

export const api = {
  getSettings: () => fetchAPI('/settings/public'),
  getProducts: (params?: { page?: number; per_page?: number; category_id?: string; sale?: boolean }) => {
    const sp = new URLSearchParams();
    if (params?.page) sp.set('page', String(params.page));
    if (params?.per_page) sp.set('per_page', String(params.per_page));
    if (params?.category_id) sp.set('category_id', params.category_id);
    if (params?.sale) sp.set('sale', 'true');
    return fetchAPI(`/products?${sp.toString()}`);
  },
  getFeaturedProducts: () => fetchAPI('/products/featured'),
  getProduct: (id: string) => fetchAPI(`/products/${id}`),
  getCategories: () => fetchAPI('/categories'),
  getCertificates: () => fetchAPI('/certificates'),
  getAlbums: (category?: string) => {
    const sp = category ? `?category=${category}` : '';
    return fetchAPI(`/gallery/albums${sp}`);
  },
  getAlbum: (id: string) => fetchAPI(`/gallery/albums/${id}`),
  getInstagramPosts: () => fetchAPI('/instagram/posts'),
  submitContact: (data: { name: string; email?: string; phone: string; subject?: string; message: string }) =>
    fetchAPI('/contacts', { method: 'POST', body: JSON.stringify(data) }),
  chat: (message: string, session_id: string) =>
    fetchAPI('/chat', { method: 'POST', body: JSON.stringify({ message, session_id }) }),
};
