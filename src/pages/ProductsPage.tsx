import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2 block">
            {lang === 'uz' ? 'Katalog' : lang === 'ru' ? 'Каталог' : 'Catalog'}
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">{t('nav_products', lang)}</h1>
        </motion.div>

        {/* Filter bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="sticky top-16 z-30 bg-background/80 backdrop-blur-2xl rounded-2xl p-4 mb-8 border border-border/50"
        >
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t('search', lang)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-muted text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setCategoryId(undefined); setPage(1); }}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  !categoryId
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('all', lang)}
              </button>
              {cats.map((c: any) => (
                <button
                  key={c.id}
                  onClick={() => { setCategoryId(c.id); setPage(1); }}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    categoryId === c.id
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {localizedField(c, 'name', lang)}
                </button>
              ))}
              <button
                onClick={() => { setSaleOnly(!saleOnly); setPage(1); }}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  saleOnly
                    ? 'bg-accent text-accent-foreground shadow-sm'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                🏷️ {t('sale_badge', lang)}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : filtered.length > 0
              ? filtered.map((p: any, i: number) => <ProductCard key={p.id} product={p} index={i} />)
              : (
                <div className="col-span-full text-center py-24">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-4">
                    <Search size={24} className="text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground font-medium">{t('no_products', lang)}</p>
                </div>
              )
          }
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-xl text-sm font-medium transition-all duration-200 ${
                  page === i + 1
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
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
