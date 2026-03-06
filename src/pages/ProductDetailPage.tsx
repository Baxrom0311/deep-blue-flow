import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, Share2, Phone, ShoppingBag, ShieldCheck, Droplet } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLang } from '@/contexts/LangContext';
import { useSettings } from '@/contexts/SettingsContext';
import { t, localizedField } from '@/lib/i18n';
import { api } from '@/lib/api';
import ProductCard from '@/components/ui/ProductCard';
import { useState } from 'react';
import { Product, PaginatedResponse } from '@/types';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { lang } = useLang();
  const settings = useSettings();
  const [mainImage, setMainImage] = useState(0);

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: () => api.getProduct(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  const { data: related } = useQuery<PaginatedResponse<Product>>({
    queryKey: ['products', product?.category_id],
    queryFn: () => api.getProducts({ category_id: product?.category_id, per_page: 4 }),
    enabled: !!product?.category_id,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return (
    <div className="pt-32 pb-20 min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          <div className="aspect-[4/3] md:aspect-square rounded-[2.5rem] bg-card border border-border shadow-sm shimmer" />
          <div className="space-y-6 py-8">
            <div className="h-6 w-1/4 rounded-xl skeleton shimmer" />
            <div className="h-12 w-3/4 rounded-xl skeleton shimmer" />
            <div className="h-8 w-1/3 rounded-xl skeleton shimmer" />
            <div className="h-32 w-full rounded-2xl skeleton shimmer mt-8" />
          </div>
        </div>
      </div>
    </div>
  );

  if (!product) return null;

  const name = localizedField(product, 'name', lang);
  const desc = localizedField(product, 'description', lang);
  const images = product.images?.length ? product.images : (product.image_url ? [product.image_url] : []);
  const isDiscount = product.is_on_sale && product.is_discount_active;
  const relatedItems = related?.items || [];

  return (
    <div className="pt-32 pb-24 min-h-screen bg-gradient-to-b from-sky-50/50 to-background dark:from-[hsl(222,47%,8%)] dark:to-background relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-water-teal/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-water-blue/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center flex-wrap gap-2 text-sm font-semibold text-slate-400 mb-10"
        >
          <Link to="/" className="hover:text-primary transition-colors">{t('breadcrumb_home', lang)}</Link>
          <ChevronRight size={14} className="text-slate-300" />
          <Link to="/products" className="hover:text-primary transition-colors">{t('nav_products', lang)}</Link>
          <ChevronRight size={14} className="text-slate-300" />
          <span className="text-slate-800">{name}</span>
        </motion.nav>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Images Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="sticky top-32"
          >
            <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-card shadow-water-lg border border-border mb-6 group relative">
              <img src={images[mainImage]} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              {isDiscount && product.discount_percent && (
                <div className="absolute top-6 left-6 px-4 py-2 rounded-2xl bg-red-500 text-white font-black shadow-lg">
                  -{product.discount_percent}%
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                {images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(i)}
                    className={`w-24 h-24 shrink-0 rounded-[1.5rem] overflow-hidden transition-all duration-300 ${mainImage === i
                      ? 'border-4 border-primary shadow-md ring-4 ring-primary/20 scale-105'
                      : 'border-2 border-white hover:border-slate-200 shadow-sm opacity-70 hover:opacity-100'
                      }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="py-2"
          >
            {product.category && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-50 text-primary border border-sky-100 text-xs font-black uppercase tracking-widest mb-6 shadow-sm">
                <Droplet size={14} /> {localizedField(product.category, 'name', lang)}
              </span>
            )}

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
              {name}
            </h1>

            <div className="p-8 rounded-[2rem] bg-card border border-border shadow-sm mb-8 flex flex-col gap-2">
              <div className="flex items-center flex-wrap gap-4">
                {isDiscount ? (
                  <>
                    <span className="text-4xl md:text-5xl font-black text-primary">
                      {Number(product.discount_price || product.original_price * (1 - product.discount_percent / 100)).toLocaleString()} <span className="text-xl md:text-2xl font-bold">so'm</span>
                    </span>
                    <span className="text-xl text-slate-400 font-bold line-through ml-2">
                      {Number(product.original_price).toLocaleString()}
                    </span>
                  </>
                ) : product.original_price ? (
                  <span className="text-4xl md:text-5xl font-black text-slate-900">
                    {Number(product.original_price).toLocaleString()} <span className="text-xl md:text-2xl font-bold text-slate-500">so'm</span>
                  </span>
                ) : null}
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-500 mt-2">
                <ShieldCheck size={16} /> Qo'lda mavjud (In stock)
              </div>
            </div>

            {desc && (
              <div className="prose prose-slate max-w-none mb-10">
                <p className="text-slate-500 leading-relaxed text-lg font-body">{desc}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100">
              <a
                href={settings.whatsapp_url || `https://wa.me/${(settings.phone_1 || '').replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-8 py-4 rounded-2xl bg-primary text-white font-bold flex items-center justify-center gap-3 hover:-translate-y-1 hover:shadow-water-lg transition-all text-lg"
              >
                <ShoppingBag size={22} /> {t('order_btn', lang)}
              </a>
              <button
                onClick={() => navigator.clipboard.writeText(window.location.href)}
                className="px-8 py-4 rounded-2xl bg-muted text-foreground font-bold flex items-center justify-center gap-3 hover:-translate-y-1 hover:bg-muted/80 border border-border transition-all text-lg shadow-sm"
              >
                <Share2 size={20} className="text-slate-400" />
                {lang === 'uz' ? 'Ulashish' : lang === 'ru' ? 'Поделиться' : 'Share'}
              </button>
            </div>

            <div className="mt-8 flex items-center gap-4 text-sm font-bold text-slate-400 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <Phone size={18} className="text-primary" /> {t('questions_call', lang) || "Savollar bo'lsa telefon qiling"}: <span className="text-slate-700">{settings.phone_1}</span>
            </div>
          </motion.div>
        </div>

        {/* Related */}
        {relatedItems.length > 0 && (
          <div className="mt-32 pt-20 border-t border-slate-100 relative">
            <h2 className="font-display text-3xl md:text-4xl font-black text-foreground mb-10 text-center tracking-tight">O'xshash Mahsulotlar</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedItems.filter((p: any) => p.id !== id).slice(0, 4).map((p: any, i: number) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
