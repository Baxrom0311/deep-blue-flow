import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { useLang } from '@/contexts/LangContext';
import { t, localizedField } from '@/lib/i18n';
import { api } from '@/lib/api';
import ProductCard from '@/components/ui/ProductCard';
import SkeletonCard from '@/components/ui/SkeletonCard';

const ProductsPage = () => {
  const { lang } = useLang();
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [saleOnly, setSaleOnly] = useState(false);
  const [search, setSearch] = useState('');

  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: api.getCategories, staleTime: 5 * 60 * 1000 });
  const { data: products, isLoading } = useQuery({
    queryKey: ['products', page, categoryId, saleOnly],
    queryFn: () => api.getProducts({ page, per_page: 12, category_id: categoryId, sale: saleOnly || undefined }),
    staleTime: 5 * 60 * 1000,
  });

  const items = Array.isArray(products) ? products : products?.items || [];
  const totalPages = products?.total_pages || 1;
  const cats = Array.isArray(categories) ? categories : categories?.items || [];

  const filtered = search
    ? items.filter((p: any) => localizedField(p, 'name', lang).toLowerCase().includes(search.toLowerCase()))
    : items;

  return (
    <div className="pt-24 pb-20 min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-4xl font-semibold text-foreground mb-8">{t('nav_products', lang)}</h1>

        {/* Filter bar */}
        <div className="sticky top-16 z-30 glass-strong rounded-2xl p-4 mb-8 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('search', lang)}
              className="w-full pl-9 pr-4 py-2 rounded-full bg-muted text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { setCategoryId(undefined); setPage(1); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!categoryId ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-water-foam'}`}
            >
              {t('all', lang)}
            </button>
            {cats.map((c: any) => (
              <button
                key={c.id}
                onClick={() => { setCategoryId(c.id); setPage(1); }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${categoryId === c.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-water-foam'}`}
              >
                {localizedField(c, 'name', lang)}
              </button>
            ))}
          </div>
          <button
            onClick={() => { setSaleOnly(!saleOnly); setPage(1); }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${saleOnly ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground hover:bg-water-foam'}`}
          >
            🏷️ {t('sale_badge', lang)}
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : filtered.length > 0
              ? filtered.map((p: any) => <ProductCard key={p.id} product={p} />)
              : (
                <div className="col-span-full text-center py-20">
                  <div className="w-20 h-24 mx-auto droplet bg-muted mb-4" />
                  <p className="text-muted-foreground">{t('no_products', lang)}</p>
                </div>
              )
          }
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${page === i + 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-water-foam'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
