import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, ImageIcon, Droplets, MapPin, Shield, Zap, Award, ShieldCheck, ChevronDown, ExternalLink, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLang } from '@/contexts/LangContext';
import { useSettings } from '@/contexts/SettingsContext';
import { t, localizedField, Lang } from '@/lib/i18n';
import { api } from '@/lib/api';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useCountUp } from '@/hooks/useCountUp';
import WaveDivider from '@/components/layout/WaveDivider';
import ProductCard from '@/components/ui/ProductCard';
import SkeletonCard from '@/components/ui/SkeletonCard';
import MediaLightbox from '@/components/ui/MediaLightbox';
import SEO from '@/components/SEO';
import { buildOrganizationSchema, buildWebsiteSchema, sanitizeDescription } from '@/lib/seo';
import { Product, Album, Certificate, InstagramVideo, PaginatedResponse } from '@/types';

const LEGACY_PARTNER_LOGOS = [
  '/media/partners/NGMK.jpg',
  '/media/partners/MININNOVATION.jpg',
  '/media/partners/UZAVTO.jpg',
  '/media/partners/ONA.jpg',
  '/media/partners/ICHF.jpg',
  '/media/partners/NBU.jpg',
  '/media/partners/URSU.jpg',
];

const isLegacyPartnerLogoList = (value: string[]) =>
  value.length === LEGACY_PARTNER_LOGOS.length
  && value.every((item, index) => item === LEGACY_PARTNER_LOGOS[index]);

const parseImageListSetting = (value: unknown, fallback: string[] = []) => {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
  }
  if (typeof value !== 'string' || !value.trim()) return fallback;

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
    }
  } catch {
    return fallback;
  }

  return fallback;
};

const getPartnerAlt = (url: string, index: number) => {
  const fileName = url.split('/').pop()?.replace(/\.[^.]+$/, '') || `partner-${index + 1}`;
  return decodeURIComponent(fileName).replace(/[-_]+/g, ' ');
};


/* ── About Preview / Hero ── */
const AboutPreview = () => {
  const { lang } = useLang();
  const settings = useSettings();
  return (
    <section className="relative overflow-hidden bg-transparent" style={{ minHeight: '80vh' }}>
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[700px] h-[700px] rounded-full bg-primary/8 dark:bg-primary/5 blur-[150px] -top-40 -left-40" style={{ animation: 'float 12s ease-in-out infinite' }} />
        <div className="absolute w-[600px] h-[600px] rounded-full bg-accent/8 dark:bg-accent/4 blur-[130px] top-1/3 -right-20" style={{ animation: 'float 15s ease-in-out 3s infinite' }} />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(hsl(199 89% 70% / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(199 89% 70% / 0.5) 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }}
      />

      <div className="relative z-10 container mx-auto px-4 pt-40 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm font-black uppercase tracking-[0.3em] text-gradient-water mb-4 block"
            >
              ECO COMPANY
            </motion.span>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-semibold text-primary mb-5"
            >
              <Droplets size={16} className="text-accent" />
              {settings.hero_badge || t('hero_badge', lang)}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold leading-[1.08] mb-4 tracking-tight text-gradient-premium"
            >
              {localizedField(settings, 'hero_title', lang) || t('hero_title', lang)}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed font-body"
            >
              {localizedField(settings, 'hero_subtitle', lang) || String(settings.hero_desc_uz || '') || t('hero_subtitle', lang)}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/products"
                className="group px-7 py-3.5 rounded-2xl gradient-ocean text-primary-foreground font-bold transition-all shadow-water-lg hover:-translate-y-1.5 hover:shadow-glow flex items-center gap-2 text-sm"
              >
                {t('hero_btn_products', lang)}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/about"
                className="px-7 py-3.5 rounded-2xl glass font-bold text-foreground hover:shadow-water-lg transition-all hover:-translate-y-1.5 text-sm"
              >
                {t('hero_btn_about', lang)}
              </Link>
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-water-lg">
              <img
                src={String(settings.hero_image_url || '/images/about.jpg')}
                alt="ECO COMPANY"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gradient-ocean flex items-center justify-center shadow-water">
                    <Droplets size={20} className="text-primary-foreground" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary/40"
        style={{ animation: 'bounce-slow 2.5s infinite' }}
      >
        <ChevronDown size={28} />
      </motion.div>
    </section>
  );
};

/* ── Stats ── */
const StatCard = ({ value, suffix, label, delay, icon: Icon }: { value: number; suffix: string; label: string; delay: number; icon: React.ElementType }) => {
  const { ref, isVisible } = useScrollAnimation();
  const count = useCountUp(value, 2000, isVisible);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className="text-center p-8 rounded-3xl gradient-card border border-border hover-lift hover-glow relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <div className="w-14 h-14 rounded-2xl gradient-ocean flex items-center justify-center mx-auto mb-5 shadow-water group-hover:scale-110 transition-transform duration-500">
          <Icon size={26} className="text-primary-foreground" />
        </div>
        <div className="font-display text-4xl md:text-5xl font-black text-foreground mb-2 tracking-tight">
          {isVisible ? count : 0}{suffix}
        </div>
        <div className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">{label}</div>
      </div>
    </motion.div>
  );
};

const StatsSection = () => {
  const { lang } = useLang();
  const s = useSettings();
  const statValue = (currentKey: string, legacyKey: string, fallback: number) => {
    const value = s[currentKey] ?? s[legacyKey];
    if (typeof value === 'number' && Number.isFinite(value) && value > 0) return value;
    if (typeof value === 'string') {
      const parsed = parseInt(value.replace(/[^\d]/g, ''), 10);
      if (Number.isFinite(parsed) && parsed > 0) return parsed;
    }
    return fallback;
  };
  const stats = [
    { value: statValue('stats_years', 'stat_years', 10), suffix: '+', label: t('stats_years', lang), icon: Award },
    { value: statValue('stats_clients', 'stat_clients', 5000), suffix: '+', label: t('stats_clients', lang), icon: Droplets },
    { value: statValue('stats_products', 'stat_products', 20), suffix: '+', label: t('stats_products', lang), icon: Shield },
    { value: statValue('stats_cities', 'stat_cities', 15), suffix: '+', label: t('stats_cities', lang), icon: Zap },
  ];
  return (
    <section className="py-14 relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((s, i) => <StatCard key={i} {...s} delay={i * 0.15} />)}
        </div>
      </div>
    </section>
  );
};

const ProductsCarousel = () => {
  const { lang } = useLang();
  const { data: products, isLoading } = useQuery<Product[] | PaginatedResponse<Product>>({
    queryKey: ['featured-products'],
    queryFn: api.getFeaturedProducts,
    staleTime: 5 * 60 * 1000,
  });
  const items = Array.isArray(products) ? products : products?.items || [];

  if (isLoading) return (
    <section className="py-16 bg-transparent relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    </section>
  );

  if (items.length === 0) return null;

  return (
    <section className="py-16 bg-transparent relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto px-4 mb-12">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 text-center md:text-left">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-black uppercase tracking-[0.25em] text-accent mb-3 block"
            >
              {lang === 'uz' ? 'Mahsulotlar' : lang === 'ru' ? 'Продукция' : 'Products'}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-4xl md:text-5xl font-black text-foreground tracking-tight"
            >
              {t('featured_title', lang)}
            </motion.h2>
          </div>
          <Link
            to="/products"
            className="group px-6 py-3 rounded-xl glass text-foreground font-bold flex items-center gap-2 text-sm shadow-sm"
          >
            {t('view_all', lang)} <ArrowRight size={16} className="text-primary group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Draggable + auto-scrolling carousel */}
      <div className="overflow-hidden">
        {(() => {
          const CARD_W = 300;
          const GAP = 24;
          const SLOT = CARD_W + GAP;
          // Repeat items enough so one "set" is at least 2000px wide
          const repeatCount = Math.max(2, Math.ceil(2000 / (items.length * SLOT)));
          const oneSet = Array.from({ length: repeatCount }, () => items).flat();
          const setWidth = oneSet.length * SLOT;
          const allItems = [...oneSet, ...oneSet]; // two identical sets

          return (
            <div
              className="flex gap-6"
              style={{
                width: `${setWidth * 2}px`,
                animation: `marquee-dynamic ${oneSet.length * 4}s linear infinite`,
                "--marquee-width": `-${setWidth}px`
              } as React.CSSProperties}
              onMouseEnter={e => (e.currentTarget.style.animationPlayState = 'paused')}
              onMouseLeave={e => (e.currentTarget.style.animationPlayState = 'running')}
            >
              {allItems.map((p: Product, i: number) => (
                <div key={`${p.id}-${i}`} className="w-[300px] shrink-0">
                  <ProductCard product={p} index={0} />
                </div>
              ))}
            </div>
          );
        })()}
      </div>
    </section>
  );
};

/* ── Gallery Album Card (fetches cover individually) ── */
const GalleryAlbumCard = ({ album, lang }: { album: Album; lang: Lang }) => {
  const { data: albumDetail } = useQuery({
    queryKey: ['album-detail', album.id],
    queryFn: () => api.getAlbum(album.id),
    staleTime: 10 * 60 * 1000,
  });

  const coverImg = albumDetail?.items?.[0]?.thumbnail_url || albumDetail?.items?.[0]?.file_url || album.cover_url || album.cover_image || null;
  const photoCount = album.items_count || albumDetail?.items?.length || 0;

  return (
    <Link to="/gallery" className="w-[340px] shrink-0 group block" draggable={false}>
      <div className="relative h-[240px] rounded-2xl overflow-hidden shadow-water hover-lift">
        {/* Full background image or gradient placeholder */}
        {coverImg ? (
          <img
            src={coverImg}
            alt={localizedField(album, 'title', lang)}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
            draggable={false}
          />
        ) : (
          <div className="absolute inset-0 gradient-ocean flex items-center justify-center">
            <Droplets size={48} className="text-white/30" />
          </div>
        )}

        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Photo count badge — top right */}
        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5">
          <ImageIcon size={12} />
          {photoCount}
        </div>

        {/* Title — bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="font-display text-lg text-white font-bold leading-snug drop-shadow-md">
            {localizedField(album, 'title', lang)}
          </h3>
        </div>
      </div>
    </Link>
  );
};

/* ── Gallery Carousel ── */
const GalleryCarousel = () => {
  const { lang } = useLang();
  const { data: albumsData } = useQuery({ queryKey: ['albums'], queryFn: () => api.getAlbums(), staleTime: 5 * 60 * 1000 });
  const albums = Array.isArray(albumsData) ? albumsData : albumsData?.items || [];

  if (albums.length === 0) return null;

  return (
    <section className="py-16 bg-transparent relative overflow-hidden">
      <div className="container mx-auto px-4 mb-12">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 text-center md:text-left">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-gradient-water mb-3 justify-center md:justify-start"
            >
              <ImageIcon size={14} className="text-primary" /> {lang === 'uz' ? 'Galereya' : lang === 'ru' ? 'Галерея' : 'Gallery'}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-4xl md:text-5xl font-black text-foreground tracking-tight"
            >
              {t('gallery_title', lang)}
            </motion.h2>
          </div>
          <Link to="/gallery" className="group px-6 py-3 rounded-xl glass text-foreground font-bold flex items-center gap-2 text-sm shadow-sm">
            {t('view_all', lang)} <ArrowRight size={16} className="text-primary group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      <div className="overflow-hidden">
        {(() => {
          const CARD_W = 340;
          const GAP = 24;
          const SLOT = CARD_W + GAP;
          const repeatCount = Math.max(2, Math.ceil(2000 / (albums.length * SLOT)));
          const oneSet = Array.from({ length: repeatCount }, () => albums).flat();
          const setWidth = oneSet.length * SLOT;
          const allItems = [...oneSet, ...oneSet];

          return (
            <div
              className="flex gap-6"
              style={{
                width: `${setWidth * 2}px`,
                animation: `marquee-dynamic ${oneSet.length * 5}s linear infinite`,
                "--marquee-width": `-${setWidth}px`
              } as React.CSSProperties}
              onMouseEnter={e => (e.currentTarget.style.animationPlayState = 'paused')}
              onMouseLeave={e => (e.currentTarget.style.animationPlayState = 'running')}
            >
              {allItems.map((album: Album, i: number) => (
                <GalleryAlbumCard key={`${album.id}-${i}`} album={album} lang={lang} />
              ))}
            </div>
          );
        })()}
      </div>
    </section>
  );
};

/* ── Instagram Videos ── */
const InstagramVideosSection = () => {
  const { lang } = useLang();
  const settings = useSettings();
  const { data: videos } = useQuery<InstagramVideo[]>({
    queryKey: ['instagram-videos'],
    queryFn: api.getInstagramPosts,
    staleTime: 5 * 60 * 1000,
  });

  if (!videos?.length) return null;

  return (
    <section className="py-16 bg-transparent relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 mb-12 text-center md:text-left">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-primary mb-3 justify-center md:justify-start"
            >
              <PlayCircle size={14} /> {t('instagram_title', lang)}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-4xl md:text-5xl font-black text-foreground tracking-tight"
            >
              Instagram Reels
            </motion.h2>
          </div>
          {settings.instagram_url && (
            <a
              href={String(settings.instagram_url)}
              target="_blank"
              rel="noopener noreferrer"
              className="group px-6 py-3 rounded-xl glass text-foreground font-bold flex items-center gap-2 text-sm shadow-sm"
            >
              Instagram sahifasi <ExternalLink size={16} className="text-primary group-hover:translate-x-1 transition-transform" />
            </a>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {videos.slice(0, 6).map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="rounded-[2rem] overflow-hidden border border-border bg-background shadow-sm hover-lift"
            >
              <div className="aspect-[9/16] bg-muted">
                <iframe
                  src={video.embed_url}
                  title={`Instagram ${video.id}`}
                  className="h-full w-full border-0"
                  loading="lazy"
                  allowFullScreen
                />
              </div>
              <div className="flex items-center justify-between gap-3 p-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                    Instagram
                  </p>
                  <p className="text-sm font-semibold text-muted-foreground">
                    {video.kind === 'reel' ? 'Reel video' : 'Post video'}
                  </p>
                </div>
                <a
                  href={video.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-bold text-foreground hover:text-primary"
                >
                  Ochish <ExternalLink size={14} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ── Certificates Section ── */
const CertificatesCarousel = () => {
  const { lang } = useLang();
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const { data } = useQuery<Certificate[] | PaginatedResponse<Certificate>>({ queryKey: ['certificates'], queryFn: api.getCertificates, staleTime: 5 * 60 * 1000 });
  const certs = Array.isArray(data) ? data : data?.items || [];

  if (certs.length === 0) return null;

  return (
    <section className="py-16 bg-transparent relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 mb-12 text-center md:text-left">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-accent mb-3 justify-center md:justify-start"
            >
              <ShieldCheck size={14} /> {lang === 'uz' ? 'Sertifikatlar' : lang === 'ru' ? 'Сертификаты' : 'Certificates'}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-4xl md:text-5xl font-black text-foreground tracking-tight"
            >
              {t('certificates_title', lang)}
            </motion.h2>
          </div>
          <Link to="/certificates" className="group px-6 py-3 rounded-xl glass text-foreground font-bold flex items-center gap-2 text-sm shadow-sm">
            {t('view_all', lang)} <ArrowRight size={16} className="text-primary group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {certs.slice(0, 5).map((cert: Certificate, i: number) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <button type="button" onClick={() => setSelectedCertificate(cert)} className="block w-full text-left group">
                <div className="rounded-[1.5rem] overflow-hidden bg-background border border-border shadow-sm hover-lift p-2">
                  <div className="aspect-[3/4] rounded-[1.2rem] overflow-hidden bg-muted/50 relative group/img">
                    <img
                      src={cert.preview_url || cert.image_url || cert.file_url}
                      alt={localizedField(cert, 'title', lang)}
                      className="w-full h-full object-contain p-2 bg-white dark:bg-card group-hover/img:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                  </div>
                  <p className="text-xs font-bold text-center text-muted-foreground mt-3 mb-1 line-clamp-1 px-1">{localizedField(cert, 'title', lang)}</p>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <MediaLightbox
        open={!!selectedCertificate}
        imageUrl={selectedCertificate?.preview_url || selectedCertificate?.image_url || selectedCertificate?.file_url}
        downloadUrl={selectedCertificate?.file_url}
        title={selectedCertificate ? localizedField(selectedCertificate, 'title', lang) : ''}
        onClose={() => setSelectedCertificate(null)}
      />
    </section>
  );
};

const PartnersSection = () => {
  const { lang } = useLang();
  const settings = useSettings();
  const rawLogos = parseImageListSetting(settings.partner_logos, []);
  const logos = isLegacyPartnerLogoList(rawLogos) ? [] : rawLogos;

  if (!logos.length) return null;

  const CARD_W = 156;
  const GAP = 20;
  const SLOT = CARD_W + GAP;
  const repeatCount = Math.max(3, Math.ceil(2200 / Math.max(logos.length * SLOT, SLOT)));
  const oneSet = Array.from({ length: repeatCount }, () => logos).flat();
  const setWidth = oneSet.length * SLOT;
  const allItems = [...oneSet, ...oneSet];

  return (
    <section className="py-14 bg-transparent relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-black uppercase tracking-[0.25em] text-gradient-water mb-3 block"
          >
            ECO COMPANY
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl font-black text-foreground tracking-tight"
          >
            {t('partners_title', lang)}
          </motion.h2>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-border bg-card/65 px-4 py-5 shadow-sm backdrop-blur-sm">
          <div
            className="flex gap-5"
            style={{
              width: `${setWidth * 2}px`,
              animation: `marquee-dynamic ${Math.max(oneSet.length * 2.6, 18)}s linear infinite`,
              "--marquee-width": `-${setWidth}px`,
            } as React.CSSProperties}
          >
            {allItems.map((logo, index) => (
              <div
                key={`${logo}-${index}`}
                className="flex h-24 w-[156px] shrink-0 items-center justify-center rounded-[1.5rem] border border-border bg-background/85 px-5 py-4 shadow-sm"
              >
                <img
                  src={logo}
                  alt={getPartnerAlt(logo, index)}
                  className="max-h-full max-w-full object-contain grayscale-[0.05]"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ── Home ── */
const HomePage = () => {
  const { lang } = useLang();
  const settings = useSettings();
  const title = `${settings.hero_badge || t('hero_badge', lang)} | ECO COMPANY`;
  const description = sanitizeDescription(
    localizedField(settings, 'hero_subtitle', lang) || localizedField(settings, 'about_text', lang),
  );

  return (
    <div className="gradient-home-flow">
      <SEO
        title={title}
        description={description}
        image="/images/about.jpg"
        lang={lang}
        structuredData={[
          buildWebsiteSchema(),
          buildOrganizationSchema(settings, lang),
        ]}
      />
      <AboutPreview />
      <CertificatesCarousel />
      <ProductsCarousel />
      <StatsSection />
      <GalleryCarousel />
      <InstagramVideosSection />
      <PartnersSection />
    </div>
  );
};

export default HomePage;
