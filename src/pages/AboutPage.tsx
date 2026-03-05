import { useLang } from '@/contexts/LangContext';
import { useSettings } from '@/contexts/SettingsContext';
import { t, localizedField } from '@/lib/i18n';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import WaveDivider from '@/components/layout/WaveDivider';
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

const AboutPage = () => {
  const { lang } = useLang();
  const s = useSettings();
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative gradient-hero flex items-center justify-center" style={{ minHeight: '50vh' }}>
        <div className="relative z-10 text-center">
          <h1 className="font-display text-5xl font-light text-primary-foreground">{t('about_title', lang)}</h1>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <WaveDivider color="hsl(var(--background))" />
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="prose prose-lg mx-auto text-muted-foreground">
            <p className="text-lg leading-relaxed">{localizedField(s, 'about_text', lang) || "ECO COMPANY — O'zbekistondagi yetakchi tozalangan suv ishlab chiqaruvchi kompaniya. Biz zamonaviy texnologiyalar yordamida eng sifatli ichimlik suvini taqdim etamiz."}</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-water-mist">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-semibold text-foreground text-center mb-12">{lang === 'uz' ? "Bizning qadriyatlar" : lang === 'ru' ? "Наши ценности" : "Our Values"}</h2>
          <div ref={ref} className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <div
                key={v.key}
                className={`p-6 rounded-2xl bg-card shadow-water text-center transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <v.icon size={32} className="mx-auto mb-3 text-primary" />
                <h3 className="font-display text-lg font-semibold text-card-foreground">{valuesText[v.key]?.[lang]}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
