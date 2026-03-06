import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { useLang } from '@/contexts/LangContext';
import { t, localizedField } from '@/lib/i18n';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { lang } = useLang();
  const name = localizedField(product, 'name', lang);
  const isDiscount = product.is_on_sale && product.is_discount_active;
  const isNew = product.is_new;

  const daysLeft = product.discount_until
    ? Math.max(0, Math.ceil((new Date(product.discount_until).getTime() - Date.now()) / 86400000))
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: 'easeOut' }}
      className="group"
    >
      <Link to={`/products/${product.id}`} className="block h-full">
        <div className="h-full flex flex-col rounded-[2rem] bg-card p-3 border border-border shadow-sm hover:shadow-water-lg transition-all duration-500 hover:-translate-y-1.5 overflow-hidden">

          <div className="relative aspect-[4/3] rounded-[1.5rem] overflow-hidden bg-muted/50 mb-4">
            <img
              src={product.images?.[0] || product.image_url || '/placeholder.svg'}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {isNew && (
                <span className="px-3 py-1.5 text-[11px] font-bold uppercase rounded-xl glass text-primary tracking-widest shadow-sm">
                  {t('new_badge', lang)}
                </span>
              )}
              {isDiscount && product.discount_percent && (
                <span className="px-3 py-1.5 text-[11px] font-bold rounded-xl bg-red-500 text-white shadow-sm">
                  -{product.discount_percent}%
                </span>
              )}
            </div>

            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
              <div className="w-10 h-10 rounded-full bg-card shadow-water flex items-center justify-center text-primary">
                <ArrowRight size={18} />
              </div>
            </div>
          </div>

          <div className="px-3 pb-3 flex-1 flex flex-col">
            {product.category && (
              <span className="text-[11px] font-bold text-accent uppercase tracking-widest mb-1.5">
                {localizedField(product.category, 'name', lang)}
              </span>
            )}

            <h3 className="font-display text-lg font-bold text-foreground line-clamp-2 leading-snug mb-3 flex-1">
              {name}
            </h3>

            <div className="flex items-end justify-between mt-auto">
              <div className="flex flex-col">
                {isDiscount ? (
                  <>
                    <span className="text-xs text-muted-foreground font-medium line-through mb-0.5">
                      {Number(product.original_price).toLocaleString()} so'm
                    </span>
                    <span className="text-lg font-black text-primary">
                      {Number(product.discount_price || product.original_price * (1 - product.discount_percent / 100)).toLocaleString()} <span className="text-sm font-bold">so'm</span>
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-black text-foreground">
                    {product.original_price ? `${Number(product.original_price).toLocaleString()} so'm` : ''}
                  </span>
                )}
                {isDiscount && daysLeft > 0 && (
                  <span className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-wider">
                    {daysLeft} {t('days_left', lang)} ⏳
                  </span>
                )}
              </div>

              <div className="w-10 h-10 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <ShoppingBag size={18} />
              </div>
            </div>
          </div>

        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
