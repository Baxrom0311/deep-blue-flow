import { useLang } from '@/contexts/LangContext';
import { useSettings } from '@/contexts/SettingsContext';
import { t, localizedField, Lang } from '@/lib/i18n';
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

const AboutPage = () => {
  const { lang } = useLang();
  const s = useSettings();

  return (
    <div className="min-h-screen">
      {/* Hero with gradient mesh */}
      <section className="relative flex items-center justify-center gradient-hero overflow-hidden" style={{ minHeight: '50vh' }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[500px] h-[500px] rounded-full bg-primary/8 dark:bg-primary/5 blur-[120px] -top-20 -right-20" style={{ animation: 'float 12s ease-in-out infinite' }} />
          <div className="absolute w-[400px] h-[400px] rounded-full bg-accent/6 dark:bg-accent/3 blur-[100px] bottom-0 left-0" style={{ animation: 'float-slow 10s ease-in-out 2s infinite' }} />
        </div>
        <div className="relative z-10 text-center container mx-auto px-4 pt-24">
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
            className="font-display text-5xl md:text-6xl lg:text-7xl font-black text-gradient-premium tracking-tight"
          >
            {t('about_title', lang)}
          </motion.h1>
        </div>
      </section>

      {/* About Image + Story */}
      <section className="py-24 gradient-section">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="relative rounded-[2rem] overflow-hidden shadow-water-lg border border-border">
                <img
                  src="/images/about.jpg"
                  alt="ECO COMPANY"
                  className="w-full h-[400px] lg:h-[500px] object-cover"
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
                className="absolute -bottom-6 -right-4 lg:-right-8 glass-strong px-6 py-4 rounded-2xl shadow-water-lg"
              >
                <div className="text-3xl font-black text-gradient-water">10+</div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {lang === 'uz' ? "Yillik tajriba" : lang === 'ru' ? "Лет опыта" : "Years experience"}
                </div>
              </motion.div>
            </motion.div>

            {/* Story text */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <span className="text-xs font-black uppercase tracking-[0.25em] text-gradient-water mb-4 block">
                {lang === 'uz' ? "Biz haqimizda" : lang === 'ru' ? "О нас" : "About us"}
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-black text-foreground tracking-tight mb-6">
                {lang === 'uz' ? "Sifatli suv — sog'lom hayot kafolati" : lang === 'ru' ? "Качественная вода — залог здоровья" : "Quality water — guarantee of health"}
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground font-body mb-6">
                {localizedField(s, 'about_text', lang) || "ECO COMPANY — O'zbekistondagi yetakchi tozalangan suv ishlab chiqaruvchi kompaniya. Biz zamonaviy texnologiyalar yordamida eng sifatli ichimlik suvini taqdim etamiz."}
              </p>
              <div className="flex gap-8">
                <div className="gradient-card rounded-2xl p-5 border border-border flex-1 text-center">
                  <div className="text-2xl font-black text-gradient-water">500+</div>
                  <div className="text-xs font-bold text-muted-foreground mt-1">{lang === 'uz' ? "Mijozlar" : lang === 'ru' ? "Клиенты" : "Clients"}</div>
                </div>
                <div className="gradient-card rounded-2xl p-5 border border-border flex-1 text-center">
                  <div className="text-2xl font-black text-gradient-water">24/7</div>
                  <div className="text-xs font-bold text-muted-foreground mt-1">{lang === 'uz' ? "Xizmat" : lang === 'ru' ? "Сервис" : "Service"}</div>
                </div>
                <div className="gradient-card rounded-2xl p-5 border border-border flex-1 text-center">
                  <div className="text-2xl font-black text-gradient-water">100%</div>
                  <div className="text-xs font-bold text-muted-foreground mt-1">{lang === 'uz' ? "Sifat" : lang === 'ru' ? "Качество" : "Quality"}</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 gradient-mesh bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-gradient-water mb-3 block">
              {lang === 'uz' ? "Nima uchun biz?" : lang === 'ru' ? "Почему мы?" : "Why us?"}
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-black text-foreground tracking-tight">
              {lang === 'uz' ? "Bizning qadriyatlar" : lang === 'ru' ? "Наши ценности" : "Our Values"}
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
                className="p-8 rounded-[2rem] gradient-card border border-border shadow-sm hover-lift hover-glow group"
              >
                <div className="w-14 h-14 rounded-2xl gradient-ocean flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-water">
                  <v.icon size={26} className="text-white" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">{valuesText[v.key]?.[lang]}</h3>
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
