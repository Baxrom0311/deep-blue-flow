import { useLang } from '@/contexts/LangContext';
import { useSettings } from '@/contexts/SettingsContext';
import { t, localizedField, Lang } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Droplets, Shield, Award, Truck, Clock, Heart } from 'lucide-react';
import SEO from '@/components/SEO';
import { buildBreadcrumbSchema, buildCollectionPageSchema, defaultSeoKeywords, keywordPhrase, mergeKeywords, sanitizeDescription } from '@/lib/seo';

const values = [
  { icon: Droplets, key: 'purity' },
  { icon: Shield, key: 'safety' },
  { icon: Award, key: 'quality' },
  { icon: Truck, key: 'delivery' },
  { icon: Clock, key: 'speed' },
  { icon: Heart, key: 'care' },
];

const valuesText: Record<string, Record<Lang, string>> = {
  purity: { uz: "Tozalik", ru: "Чистота", en: "Purity" },
  safety: { uz: "Xavfsizlik", ru: "Безопасность", en: "Safety" },
  quality: { uz: "Sifat", ru: "Качество", en: "Quality" },
  delivery: { uz: "Yetkazib berish", ru: "Доставка", en: "Delivery" },
  speed: { uz: "Tezkorlik", ru: "Быстрота", en: "Speed" },
  care: { uz: "G'amxo'rlik", ru: "Забота", en: "Care" },
};

const valuesDesc: Record<string, Record<Lang, string>> = {
  purity: { uz: "Eng yuqori darajadagi tozalash texnologiyasi", ru: "Технология очистки высшего класса", en: "Highest grade purification technology" },
  safety: { uz: "Xalqaro xavfsizlik standartlariga muvofiq", ru: "Соответствие международным стандартам", en: "International safety standards compliance" },
  quality: { uz: "Sifat sertifikatlari bilan tasdiqlangan", ru: "Подтверждено сертификатами качества", en: "Verified by quality certificates" },
  delivery: { uz: "Tez va qulay yetkazib berish xizmati", ru: "Быстрая и удобная доставка", en: "Fast and convenient delivery service" },
  speed: { uz: "Buyurtmangiz 24 soat ichida yetkaziladi", ru: "Заказ доставляется в течение 24 часов", en: "Order delivered within 24 hours" },
  care: { uz: "Har bir mijozga individual yondashuv", ru: "Индивидуальный подход к каждому клиенту", en: "Individual approach to every customer" },
};

const parseStatValue = (value: unknown, fallback: number) => {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) return value;
  if (typeof value === 'string') {
    const parsed = parseInt(value.replace(/[^\d]/g, ''), 10);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  return fallback;
};

const AboutPage = () => {
  const { lang } = useLang();
  const s = useSettings();
  const statValue = (currentKey: string, legacyKey: string, fallback: number) => {
    const value = s[currentKey] ?? s[legacyKey];
    return parseStatValue(value, fallback);
  };
  const aboutHighlights = [
    { value: `${statValue('stats_clients', 'stat_clients', 5000)}+`, label: t('stats_clients', lang) },
    { value: `${statValue('stats_products', 'stat_products', 20)}+`, label: t('stats_products', lang) },
    { value: `${statValue('stats_cities', 'stat_cities', 15)}+`, label: t('stats_cities', lang) },
  ];
  const yearsExperience = `${statValue('stats_years', 'stat_years', 10)}+`;
  const aboutPageTitle = localizedField(s, 'about_page_title', lang) || t('about_title', lang);
  const aboutSectionBadge = localizedField(s, 'about_section_badge', lang) || (lang === 'uz' ? "Biz haqimizda" : lang === 'ru' ? "О нас" : "About us");
  const aboutSectionTitle = localizedField(s, 'about_section_title', lang) || (lang === 'uz' ? "Sifatli suv — sog'lom hayot kafolati" : lang === 'ru' ? "Качественная вода — залог здоровья" : "Quality water — guarantee of health");
  const aboutSectionText = localizedField(s, 'about_text', lang) || "ECO COMPANY — O'zbekistondagi yetakchi tozalangan suv ishlab chiqaruvchi kompaniya. Biz zamonaviy texnologiyalar yordamida eng sifatli ichimlik suvini taqdim etamiz.";
  const valuesBadge = localizedField(s, 'about_values_badge', lang) || (lang === 'uz' ? "Nima uchun biz?" : lang === 'ru' ? "Почему мы?" : "Why us?");
  const valuesTitle = localizedField(s, 'about_values_title', lang) || (lang === 'uz' ? "Bizning qadriyatlar" : lang === 'ru' ? "Наши ценности" : "Our Values");
  const heroImage = String(s.hero_image_url || '/images/about.jpg');
  const aboutKeywords = mergeKeywords(
    localizedField(s, 'seo_keywords', lang),
    localizedField(s, 'seo_about_keywords', lang),
    defaultSeoKeywords(lang),
    aboutPageTitle,
    aboutSectionTitle,
    valuesTitle,
    keywordPhrase('ECO COMPANY', lang === 'uz' ? 'kompaniya haqida' : lang === 'ru' ? 'о компании' : 'about company'),
  );

  return (
    <div className="min-h-screen overflow-x-hidden">
      <SEO
        title={`${aboutPageTitle} | ECO COMPANY`}
        description={sanitizeDescription(aboutSectionText)}
        image={heroImage}
        keywords={aboutKeywords}
        lang={lang}
        canonicalPath="/about"
        structuredData={[
          buildBreadcrumbSchema([
            { name: t('nav_home', lang), path: '/' },
            { name: t('nav_about', lang), path: '/about' },
          ]),
          buildCollectionPageSchema({
            name: `${aboutPageTitle} | ECO COMPANY`,
            description: sanitizeDescription(aboutSectionText),
            path: '/about',
            image: heroImage,
            keywords: aboutKeywords,
            items: aboutHighlights.map((item) => ({
              name: item.label,
              path: '/about',
              description: `${item.value} ${item.label}`,
            })),
          }),
        ]}
      />
      {/* Hero with gradient mesh */}
      <section className="relative flex items-center justify-center gradient-hero overflow-hidden pt-32 pb-14 sm:pt-36 sm:pb-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[500px] h-[500px] rounded-full bg-primary/8 dark:bg-primary/5 blur-[120px] -top-20 -right-20" style={{ animation: 'float 12s ease-in-out infinite' }} />
          <div className="absolute w-[400px] h-[400px] rounded-full bg-accent/6 dark:bg-accent/3 blur-[100px] bottom-0 left-0" style={{ animation: 'float-slow 10s ease-in-out 2s infinite' }} />
        </div>
        <div className="relative z-10 text-center container mx-auto px-4">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-black uppercase tracking-[0.35em] text-gradient-water mb-4 block"
          >
            ECO COMPANY
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gradient-premium tracking-tight"
          >
            {aboutPageTitle}
          </motion.h1>
        </div>
      </section>

      {/* About Image + Story */}
      <section className="py-16 sm:py-24 gradient-section overflow-x-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-6xl mx-auto">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative min-w-0"
            >
              <div className="relative rounded-[2rem] overflow-hidden shadow-water-lg border border-border">
                <img
                  src={heroImage}
                  alt="ECO COMPANY"
                  className="w-full h-[320px] sm:h-[400px] lg:h-[500px] object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent" />
              </div>
              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="absolute -bottom-4 right-4 sm:-bottom-6 sm:-right-4 lg:-right-8 glass-strong px-4 py-3 sm:px-6 sm:py-4 rounded-2xl shadow-water-lg"
              >
                <div className="text-2xl sm:text-3xl font-black text-gradient-water">{yearsExperience}</div>
                <div className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-[0.18em] sm:tracking-wider">
                  {t('stats_years', lang)}
                </div>
              </motion.div>
            </motion.div>

            {/* Story text */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="min-w-0"
            >
              <span className="text-xs font-black uppercase tracking-[0.25em] text-gradient-water mb-4 block">
                {aboutSectionBadge}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight mb-5 sm:mb-6">
                {aboutSectionTitle}
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-muted-foreground font-body mb-6">
                {aboutSectionText}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                {aboutHighlights.map(item => (
                  <div key={item.label} className="gradient-card rounded-2xl p-4 sm:p-5 border border-border text-center min-w-0">
                    <div className="text-2xl font-black text-gradient-water">{item.value}</div>
                    <div className="text-xs font-bold text-muted-foreground mt-1">{item.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-24 gradient-mesh bg-background overflow-x-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-gradient-water mb-3 block">
              {valuesBadge}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight">
              {valuesTitle}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {values.map((v, i) => (
              <motion.div
                key={v.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="p-6 sm:p-8 rounded-[2rem] gradient-card border border-border shadow-sm hover-lift hover-glow group min-w-0"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl gradient-ocean flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-110 transition-transform duration-500 shadow-water">
                  <v.icon size={26} className="text-white" />
                </div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-foreground mb-3">{valuesText[v.key]?.[lang]}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-body">{valuesDesc[v.key]?.[lang]}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
