import { Link } from 'react-router-dom';
import { useLang } from '@/contexts/LangContext';
import { t, localizedField } from '@/lib/i18n';

interface ProductCardProps {
  product: any;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { lang } = useLang();
  const name = localizedField(product, 'name', lang);
  const isDiscount = product.is_on_sale && product.is_discount_active;
  const isNew = product.is_new;

  const daysLeft = product.discount_until
    ? Math.max(0, Math.ceil((new Date(product.discount_until).getTime() - Date.now()) / 86400000))
    : 0;

  return (
    <Link to={`/products/${product.id}`} className="group block">
      <div className="rounded-2xl overflow-hidden bg-card shadow-water hover:shadow-water-lg transition-all duration-300 group-hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-water-mist">
          <img
            src={product.image_url || product.images?.[0]?.url}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {isNew && (
              <span className="px-2.5 py-1 text-[10px] font-semibold uppercase rounded-full bg-accent text-accent-foreground tracking-wider">
                {t('new_badge', lang)}
              </span>
            )}
            {isDiscount && product.discount_percent && (
              <span className="px-2.5 py-1 text-[10px] font-semibold rounded-full bg-primary text-primary-foreground animate-pulse">
                -{product.discount_percent}%
              </span>
            )}
          </div>
          {product.category && (
            <span className="absolute bottom-3 left-3 px-2.5 py-1 text-[10px] font-medium rounded-full glass text-foreground">
              {localizedField(product.category, 'name', lang)}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-display text-lg font-semibold text-card-foreground line-clamp-2 mb-2">{name}</h3>
          <div className="flex items-center gap-2">
            {isDiscount ? (
              <>
                <span className="text-lg font-bold text-primary">
                  {Number(product.discount_price || product.price * (1 - product.discount_percent / 100)).toLocaleString()} so'm
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  {Number(product.price).toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-foreground">
                {product.price ? `${Number(product.price).toLocaleString()} so'm` : ''}
              </span>
            )}
          </div>
          {isDiscount && daysLeft > 0 && (
            <p className="text-xs text-accent mt-1.5">{daysLeft} {t('days_left', lang)} ⏳</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
