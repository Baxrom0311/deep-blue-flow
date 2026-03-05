import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, ArrowRight, Phone, MessageCircle, Droplets, Shield, Award, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLang } from '@/contexts/LangContext';
import { useSettings } from '@/contexts/SettingsContext';
import { t, localizedField } from '@/lib/i18n';
import { api } from '@/lib/api';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useCountUp } from '@/hooks/useCountUp';
import WaveDivider from '@/components/layout/WaveDivider';
import ProductCard from '@/components/ui/ProductCard';
import SkeletonCard from '@/components/ui/SkeletonCard';

/* ── Hero ── */
const HeroSection = () => {
  const { lang } = useLang();
  const settings = useSettings();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero">
      {/* Animated orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] -top-40 -left-40" style={{ animation: 'float 12s ease-in-out infinite' }} />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-accent/10 blur-[100px] top-1/3 -right-20" style={{ animation: 'float 15s ease-in-out 3s infinite' }} />
        <div className="absolute w-[300px] h-[300px] rounded-full bg-water-light/10 blur-[80px] bottom-20 left-1/4" style={{ animation: 'float-slow 10s ease-in-out 1s infinite' }} />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-sm text-white/80 mb-8"
        >
          <Droplets size={14} />
          {settings.hero_badge || t('hero_badge', lang)}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white leading-[1.05] mb-6"
        >
          {localizedField(settings, 'hero_title', lang) || t('hero_title', lang)}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          {localizedField(settings, 'hero_subtitle', lang) || t('hero_subtitle', lang)}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Link
            to="/products"
            className="group px-8 py-4 rounded-xl bg-white text-foreground font-semibold hover:bg-white/90 transition-all flex items-center gap-2 text-sm"
          >
            {t('hero_btn_products', lang)}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/about"
            className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold hover:bg-white/15 transition-all text-sm"
          >
            {t('hero_btn_about', lang)}
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30"
        style={{ animation: 'bounce-slow 2s infinite' }}
      >
        <ChevronDown size={24} />
      </motion.div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <WaveDivider color="hsl(var(--background))" />
      </div>
    </section>
  );
};

/* ── Stats ── */
const StatCard = ({ value, suffix, label, delay, icon: Icon }: { value: number; suffix: string; label: string; delay: number; icon: any }) => {
  const { ref, isVisible } = useScrollAnimation();
  const count = useCountUp(value, 2000, isVisible);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="text-center p-8 rounded-2xl bg-card border border-border/50 hover-lift"
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <Icon size={22} className="text-primary" />
      </div>
      <div className="font-display text-4xl font-extrabold text-foreground mb-1">
        {isVisible ? count : 0}{suffix}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </motion.div>
  );
};

const StatsSection = () => {
  const { lang } = useLang();
  const s = useSettings();
  const stats = [
    { value: Number(s.stats_years) || 10, suffix: '+', label: t('stats_years', lang), icon: Award },
    { value: Number(s.stats_clients) || 5000, suffix: '+', label: t('stats_clients', lang), icon: Droplets },
    { value: Number(s.stats_products) || 20, suffix: '+', label: t('stats_products', lang), icon: Shield },
    { value: Number(s.stats_cities) || 15, suffix: '+', label: t('stats_cities', lang), icon: Zap },
  ];

  return (
    <section className="py-24 bg-background">
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
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2 block"
            >
              {lang === 'uz' ? 'Mahsulotlar' : lang === 'ru' ? 'Продукция' : 'Products'}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl md:text-4xl font-bold text-foreground"
            >
              {t('featured_title', lang)}
            </motion.h2>
          </div>
          <Link
            to="/products"
            className="group text-primary font-medium flex items-center gap-1.5 text-sm hover:gap-2.5 transition-all"
          >
            {t('view_all', lang)} <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : items.slice(0, 8).map((p: any, i: number) => <ProductCard key={p.id} product={p} index={i} />)
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
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden gradient-hero p-12 md:p-20 text-center"
        >
          {/* Orbs */}
          <div className="absolute w-[300px] h-[300px] rounded-full bg-white/5 blur-[80px] -top-20 -right-20" />
          <div className="absolute w-[200px] h-[200px] rounded-full bg-accent/10 blur-[60px] bottom-0 left-10" />
          
          <div className="relative z-10">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">{t('cta_title', lang)}</h2>
            <p className="text-white/50 mb-10 max-w-lg mx-auto text-lg">{t('cta_subtitle', lang)}</p>
            <div className="flex flex-wrap gap-4 justify-center">
              {s.phone_1 && (
                <a
                  href={`tel:${s.phone_1}`}
                  className="group px-8 py-4 rounded-xl bg-white text-foreground font-semibold flex items-center gap-2 hover:bg-white/90 transition-all text-sm"
                >
                  <Phone size={18} /> {s.phone_1}
                </a>
              )}
              {s.whatsapp_url && (
                <a
                  href={s.whatsapp_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold flex items-center gap-2 hover:bg-white/15 transition-all text-sm"
                >
                  <MessageCircle size={18} /> WhatsApp
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ── Home ── */
const HomePage = () => (
  <>
    <HeroSection />
    <StatsSection />
    <FeaturedSection />
    <CTASection />
  </>
);

export default HomePage;
