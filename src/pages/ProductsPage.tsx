import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Droplets } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLang } from '@/contexts/LangContext';
import { t, localizedField } from '@/lib/i18n';
import { api } from '@/lib/api';
import ProductCard from '@/components/ui/ProductCard';
import SkeletonCard from '@/components/ui/SkeletonCard';
import { Product, Category, PaginatedResponse } from '@/types';

const ProductsPage = () => {
  const { lang } = useLang();
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [saleOnly, setSaleOnly] = useState(false);
  const [search, setSearch] = useState('');

  const { data: categories } = useQuery<Category[]>({ queryKey: ['categories'], queryFn: api.getCategories, staleTime: 5 * 60 * 1000 });
  const { data: products, isLoading } = useQuery<PaginatedResponse<Product>>({
    queryKey: ['products', page, categoryId, saleOnly],
    queryFn: () => api.getProducts({ page, per_page: 12, category_id: categoryId, is_on_sale: saleOnly || undefined }),
    staleTime: 5 * 60 * 1000,
  });

  const items = products?.items || [];
  const totalPages = products?.total_pages || products?.pages || 1;
  const cats = categories || [];

  const filtered = search
    ? items.filter((p) => localizedField(p, 'name', lang).toLowerCase().includes(search.toLowerCase()))
    : items;

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background gradient-mesh relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-water-teal/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-water-blue/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center md:text-left flex flex-col items-center md:items-start"
        >
          <span className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-xs font-black uppercase tracking-[0.2em] text-primary mb-4">
            <Droplets size={14} />
            {lang === 'uz' ? 'Katalog' : lang === 'ru' ? 'Каталог' : 'Catalog'}
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-gradient-premium tracking-tight">{t('nav_products', lang)}</h1>
        </motion.div>

        {/* Filter bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="sticky top-20 z-30 bg-card/70 dark:bg-card/70 backdrop-blur-3xl rounded-[2rem] p-4 mb-10 border border-border shadow-water"
        >
          <div className="flex flex-col lg:flex-row items-center gap-4">
            <div className="relative w-full lg:w-80 shrink-0">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t('search', lang)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-muted border border-border text-foreground font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-inner"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 flex-1 w-full overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              <button
                onClick={() => { setCategoryId(undefined); setPage(1); }}
                className={`shrink-0 px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${!categoryId
                  ? 'bg-primary text-white shadow-md hover:-translate-y-0.5'
                  : 'bg-card text-muted-foreground hover:text-foreground border border-border hover:border-primary/40 shadow-sm'
                  }`}
              >
                {t('all', lang)}
              </button>
              {cats.map((c: any) => (
                <button
                  key={c.id}
                  onClick={() => { setCategoryId(c.id); setPage(1); }}
                  className={`shrink-0 px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${categoryId === c.id
                    ? 'bg-primary text-white shadow-md hover:-translate-y-0.5'
                    : 'bg-card text-muted-foreground hover:text-foreground border border-border hover:border-primary/40 shadow-sm'
                    }`}
                >
                  {localizedField(c, 'name', lang)}
                </button>
              ))}
              <div className="flex-1 min-w-[20px]" />
              <button
                onClick={() => { setSaleOnly(!saleOnly); setPage(1); }}
                className={`shrink-0 px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${saleOnly
                  ? 'bg-red-500 text-white shadow-md hover:-translate-y-0.5'
                  : 'bg-card text-muted-foreground hover:text-foreground border border-border hover:border-primary/40 shadow-sm'
                  }`}
              >
                🏷️ {t('sale_badge', lang)}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : filtered.length > 0
              ? filtered.map((p: any, i: number) => <ProductCard key={p.id} product={p} index={i} />)
              : (
                <div className="col-span-full text-center py-32 glass rounded-[3rem]">
                  <div className="w-20 h-20 mx-auto rounded-3xl bg-muted/50 flex items-center justify-center mb-6 shadow-sm border border-border">
                    <Search size={32} className="text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground font-bold text-lg">{t('no_products', lang)}</p>
                </div>
              )
          }
        </div>

        {/* Pagination - ultra premium style */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-3 mt-16">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-black transition-all duration-300 ${page === i + 1
                  ? 'bg-primary text-white shadow-water hover:-translate-y-0.5'
                  : 'bg-card text-muted-foreground hover:text-foreground border border-border hover:border-primary shadow-sm'
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
