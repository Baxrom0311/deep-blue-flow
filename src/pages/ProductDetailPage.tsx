import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, Share2, Phone } from 'lucide-react';
import { useLang } from '@/contexts/LangContext';
import { useSettings } from '@/contexts/SettingsContext';
import { t, localizedField } from '@/lib/i18n';
import { api } from '@/lib/api';
import ProductCard from '@/components/ui/ProductCard';
import { useState } from 'react';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { lang } = useLang();
  const settings = useSettings();
  const [mainImage, setMainImage] = useState(0);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.getProduct(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  const { data: related } = useQuery({
    queryKey: ['products', product?.category_id],
    queryFn: () => api.getProducts({ category_id: product?.category_id, per_page: 4 }),
    enabled: !!product?.category_id,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return (
    <div className="pt-24 pb-20 min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="aspect-square rounded-2xl shimmer" />
          <div className="space-y-4">
            <div className="h-8 w-1/3 rounded shimmer" />
            <div className="h-12 w-2/3 rounded shimmer" />
            <div className="h-6 w-1/4 rounded shimmer" />
          </div>
        </div>
      </div>
    </div>
  );

  if (!product) return null;

  const name = localizedField(product, 'name', lang);
  const desc = localizedField(product, 'description', lang);
  const images = product.images?.length ? product.images : [{ url: product.image_url }];
  const isDiscount = product.is_on_sale && product.is_discount_active;
  const relatedItems = Array.isArray(related) ? related : related?.items || [];

  return (
    <div className="pt-24 pb-20 min-h-screen bg-background">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">{t('breadcrumb_home', lang)}</Link>
          <ChevronRight size={14} />
          <Link to="/products" className="hover:text-primary">{t('nav_products', lang)}</Link>
          <ChevronRight size={14} />
          <span className="text-foreground">{name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Images */}
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-water-mist mb-4">
              <img src={images[mainImage]?.url} alt={name} className="w-full h-full object-cover" />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${mainImage === i ? 'border-primary' : 'border-transparent'}`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {product.category && (
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                {localizedField(product.category, 'name', lang)}
              </span>
            )}
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">{name}</h1>
            <div className="flex items-center gap-3 mb-6">
              {isDiscount ? (
                <>
                  <span className="text-2xl font-bold text-primary">
                    {Number(product.discount_price || product.price * (1 - product.discount_percent / 100)).toLocaleString()} so'm
                  </span>
                  <span className="text-lg text-muted-foreground line-through">{Number(product.price).toLocaleString()}</span>
                  <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">-{product.discount_percent}%</span>
                </>
              ) : product.price ? (
                <span className="text-2xl font-bold text-foreground">{Number(product.price).toLocaleString()} so'm</span>
              ) : null}
            </div>
            {desc && <p className="text-muted-foreground leading-relaxed mb-8">{desc}</p>}

            <div className="flex flex-wrap gap-3 mb-6">
              <a
                href={settings.whatsapp_url || `https://wa.me/${(settings.phone_1 || '').replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
              >
                <Phone size={18} /> {t('order_btn', lang)}
              </a>
              <button
                onClick={() => navigator.clipboard.writeText(window.location.href)}
                className="px-6 py-3 rounded-full bg-muted text-muted-foreground font-medium flex items-center gap-2 hover:bg-water-foam transition-colors"
              >
                <Share2 size={18} /> Share
              </button>
            </div>
          </div>
        </div>

        {/* Related */}
        {relatedItems.length > 0 && (
          <div className="mt-20">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-8">{t('featured_title', lang)}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedItems.filter((p: any) => p.id !== id).slice(0, 4).map((p: any) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
