import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLang } from '@/contexts/LangContext';
import { t, localizedField } from '@/lib/i18n';

interface ProductCardProps {
  product: any;
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
    >
      <Link to={`/products/${product.id}`} className="group block">
        <div className="rounded-2xl overflow-hidden bg-card border border-border/50 hover-lift">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            <img
              src={product.image_url || product.images?.[0]?.url}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {isNew && (
                <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-md bg-accent text-accent-foreground tracking-wider">
                  {t('new_badge', lang)}
                </span>
              )}
              {isDiscount && product.discount_percent && (
                <span className="px-2.5 py-1 text-[10px] font-bold rounded-md bg-primary text-primary-foreground">
                  -{product.discount_percent}%
                </span>
              )}
            </div>

            {/* View button */}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <div className="w-9 h-9 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center text-foreground">
                <ArrowRight size={16} />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            {product.category && (
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                {localizedField(product.category, 'name', lang)}
              </span>
            )}
            <h3 className="font-display text-base font-semibold text-card-foreground line-clamp-2 mt-1 mb-2">{name}</h3>
            <div className="flex items-center gap-2">
              {isDiscount ? (
                <>
                  <span className="text-base font-bold text-primary">
                    {Number(product.discount_price || product.price * (1 - product.discount_percent / 100)).toLocaleString()} so'm
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    {Number(product.price).toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-base font-bold text-foreground">
                  {product.price ? `${Number(product.price).toLocaleString()} so'm` : ''}
                </span>
              )}
            </div>
            {isDiscount && daysLeft > 0 && (
              <p className="text-xs text-accent font-medium mt-2">{daysLeft} {t('days_left', lang)} ⏳</p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
