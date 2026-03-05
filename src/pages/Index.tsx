import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, ArrowRight, Phone, MessageCircle } from 'lucide-react';
import { useLang } from '@/contexts/LangContext';
import { useSettings } from '@/contexts/SettingsContext';
import { t, localizedField } from '@/lib/i18n';
import { api } from '@/lib/api';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useCountUp } from '@/hooks/useCountUp';
import WaveDivider from '@/components/layout/WaveDivider';
import ProductCard from '@/components/ui/ProductCard';
import SkeletonCard from '@/components/ui/SkeletonCard';

/* ── Floating Droplets ── */
const FloatingDroplets = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[
      { w: 120, h: 140, top: '10%', left: '8%', delay: 0, dur: 8 },
      { w: 80, h: 95, top: '30%', right: '12%', delay: 2, dur: 10 },
      { w: 60, h: 72, top: '60%', left: '15%', delay: 4, dur: 7 },
      { w: 100, h: 120, top: '50%', right: '25%', delay: 1, dur: 9 },
    ].map((d, i) => (
      <div
        key={i}
        className="absolute droplet bg-primary-foreground/5"
        style={{
          width: d.w, height: d.h,
          top: d.top, left: d.left, right: d.right,
          animation: `float ${d.dur}s ease-in-out ${d.delay}s infinite`,
        }}
      />
    ))}
  </div>
);

/* ── Hero ── */
const HeroSection = () => {
  const { lang } = useLang();
  const settings = useSettings();

  return (
    <section className="relative min-h-screen flex items-center justify-center gradient-hero overflow-hidden">
      <FloatingDroplets />
      {/* Noise texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />
      
      <div className="relative z-10 container mx-auto px-4 text-center max-w-3xl">
        <div className="inline-block px-5 py-2 rounded-full glass text-sm font-medium text-primary-foreground mb-8 animate-fade-in">
          {settings.hero_badge || t('hero_badge', lang)}
        </div>
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-light text-primary-foreground leading-tight mb-6 animate-fade-in" style={{ animationDelay: '0.15s' }}>
          {localizedField(settings, 'hero_title', lang) || t('hero_title', lang)}
        </h1>
        <p className="text-lg text-primary-foreground/70 mb-10 max-w-xl mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
          {localizedField(settings, 'hero_subtitle', lang) || t('hero_subtitle', lang)}
        </p>
        <div className="flex flex-wrap gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.45s' }}>
          <Link to="/products" className="px-8 py-3.5 rounded-full bg-primary-foreground text-water-deep font-medium hover:bg-primary-foreground/90 transition-colors flex items-center gap-2">
            {t('hero_btn_products', lang)} <ArrowRight size={16} />
          </Link>
          <Link to="/about" className="px-8 py-3.5 rounded-full glass text-primary-foreground font-medium hover:bg-primary-foreground/10 transition-colors">
            {t('hero_btn_about', lang)}
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary-foreground/50" style={{ animation: 'bounce-slow 2s infinite' }}>
        <ChevronDown size={28} />
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <WaveDivider color="hsl(var(--water-mist))" />
      </div>
    </section>
  );
};

/* ── Stats ── */
const StatCard = ({ value, suffix, label, delay }: { value: number; suffix: string; label: string; delay: number }) => {
  const { ref, isVisible } = useScrollAnimation();
  const count = useCountUp(value, 2000, isVisible);
  return (
    <div ref={ref} className="text-center p-6 rounded-2xl gradient-ocean-light shadow-water opacity-0 animate-fade-in" style={{ animationDelay: `${delay}s`, animationFillMode: 'forwards' }}>
      <div className="font-display text-4xl font-bold text-primary-foreground mb-1">
        {isVisible ? count : 0}{suffix}
      </div>
      <div className="text-sm text-primary-foreground/70">{label}</div>
    </div>
  );
};

const StatsSection = () => {
  const { lang } = useLang();
  const s = useSettings();
  const stats = [
    { value: Number(s.stats_years) || 10, suffix: '+', label: t('stats_years', lang) },
    { value: Number(s.stats_clients) || 5000, suffix: '+', label: t('stats_clients', lang) },
    { value: Number(s.stats_products) || 20, suffix: '+', label: t('stats_products', lang) },
    { value: Number(s.stats_cities) || 15, suffix: '+', label: t('stats_cities', lang) },
  ];

  return (
    <section className="bg-water-mist py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((s, i) => <StatCard key={i} {...s} delay={i * 0.1} />)}
        </div>
      </div>
    </section>
  );
};

/* ── Featured Products ── */
const FeaturedSection = () => {
  const { lang } = useLang();
  const { data: products, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: api.getFeaturedProducts,
    staleTime: 5 * 60 * 1000,
  });

  const items = Array.isArray(products) ? products : products?.items || [];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">{t('featured_title', lang)}</h2>
          <Link to="/products" className="text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all text-sm">
            {t('view_all', lang)} <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : items.slice(0, 8).map((p: any) => <ProductCard key={p.id} product={p} />)
          }
        </div>
      </div>
    </section>
  );
};

/* ── CTA ── */
const CTASection = () => {
  const { lang } = useLang();
  const s = useSettings();

  return (
    <section className="relative">
      <WaveDivider color="hsl(var(--water-deep))" />
      <div className="gradient-ocean py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-primary-foreground mb-4">{t('cta_title', lang)}</h2>
          <p className="text-primary-foreground/70 mb-8 max-w-md mx-auto">{t('cta_subtitle', lang)}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            {s.phone_1 && (
              <a href={`tel:${s.phone_1}`} className="px-8 py-3.5 rounded-full bg-primary-foreground text-water-deep font-medium flex items-center gap-2 hover:bg-primary-foreground/90 transition-colors">
                <Phone size={18} /> {s.phone_1}
              </a>
            )}
            {s.whatsapp_url && (
              <a href={s.whatsapp_url} target="_blank" rel="noopener noreferrer" className="px-8 py-3.5 rounded-full glass text-primary-foreground font-medium flex items-center gap-2 hover:bg-primary-foreground/10 transition-colors">
                <MessageCircle size={18} /> WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
      <WaveDivider color="hsl(var(--background))" direction="up" />
    </section>
  );
};

/* ── Home Page ── */
const HomePage = () => (
  <>
    <HeroSection />
    <StatsSection />
    <FeaturedSection />
    <CTASection />
  </>
);

export default HomePage;
