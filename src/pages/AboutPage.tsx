import { useLang } from '@/contexts/LangContext';
import { useSettings } from '@/contexts/SettingsContext';
import { t, localizedField } from '@/lib/i18n';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { motion } from 'framer-motion';
import { Droplets, Shield, Award, Truck, Clock, Heart } from 'lucide-react';

const values = [
  { icon: Droplets, key: 'purity' },
  { icon: Shield, key: 'safety' },
  { icon: Award, key: 'quality' },
  { icon: Truck, key: 'delivery' },
  { icon: Clock, key: 'speed' },
  { icon: Heart, key: 'care' },
];

const valuesText: Record<string, Record<string, string>> = {
  purity: { uz: "Tozalik", ru: "Чистота", en: "Purity" },
  safety: { uz: "Xavfsizlik", ru: "Безопасность", en: "Safety" },
  quality: { uz: "Sifat", ru: "Качество", en: "Quality" },
  delivery: { uz: "Yetkazib berish", ru: "Доставка", en: "Delivery" },
  speed: { uz: "Tezkorlik", ru: "Быстрота", en: "Speed" },
  care: { uz: "G'amxo'rlik", ru: "Забота", en: "Care" },
};

const valuesDesc: Record<string, Record<string, string>> = {
  purity: { uz: "Eng yuqori darajadagi tozalash texnologiyasi", ru: "Технология очистки высшего класса", en: "Highest grade purification technology" },
  safety: { uz: "Xalqaro xavfsizlik standartlariga muvofiq", ru: "Соответствие международным стандартам", en: "International safety standards compliance" },
  quality: { uz: "Sifat sertifikatlari bilan tasdiqlangan", ru: "Подтверждено сертификатами качества", en: "Verified by quality certificates" },
  delivery: { uz: "Tez va qulay yetkazib berish xizmati", ru: "Быстрая и удобная доставка", en: "Fast and convenient delivery service" },
  speed: { uz: "Buyurtmangiz 24 soat ichida yetkaziladi", ru: "Заказ доставляется в течение 24 часов", en: "Order delivered within 24 hours" },
  care: { uz: "Har bir mijozga individual yondashuv", ru: "Индивидуальный подход к каждому клиенту", en: "Individual approach to every customer" },
};

const AboutPage = () => {
  const { lang } = useLang();
  const s = useSettings();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative gradient-hero flex items-center justify-center" style={{ minHeight: '50vh' }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[400px] h-[400px] rounded-full bg-white/5 blur-[100px] -top-20 -right-20" />
        </div>
        <div className="relative z-10 text-center container mx-auto px-4">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50 mb-3 block"
          >
            ECO COMPANY
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-6xl font-bold text-white"
          >
            {t('about_title', lang)}
          </motion.h1>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-lg md:text-xl leading-relaxed text-muted-foreground">
              {localizedField(s, 'about_text', lang) || "ECO COMPANY — O'zbekistondagi yetakchi tozalangan suv ishlab chiqaruvchi kompaniya. Biz zamonaviy texnologiyalar yordamida eng sifatli ichimlik suvini taqdim etamiz."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2 block">
              {lang === 'uz' ? "Nima uchun biz?" : lang === 'ru' ? "Почему мы?" : "Why us?"}
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              {lang === 'uz' ? "Bizning qadriyatlar" : lang === 'ru' ? "Наши ценности" : "Our Values"}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-8 rounded-2xl bg-card border border-border/50 hover-lift group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <v.icon size={22} className="text-primary" />
                </div>
                <h3 className="font-display text-lg font-bold text-card-foreground mb-2">{valuesText[v.key]?.[lang]}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{valuesDesc[v.key]?.[lang]}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
