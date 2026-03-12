import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Phone, Mail, Clock, CheckCircle, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLang } from '@/contexts/LangContext';
import { useSettings } from '@/contexts/SettingsContext';
import { t, localizedField } from '@/lib/i18n';
import { api } from '@/lib/api';
import { ContactFormData } from '@/types';
import SEO from '@/components/SEO';
import { buildBreadcrumbSchema, buildLocalBusinessSchema, defaultSeoKeywords, keywordPhrase, mergeKeywords, pickPrimaryImage, sanitizeDescription } from '@/lib/seo';

const ContactPage = () => {
  const { lang } = useLang();
  const s = useSettings();
  const [form, setForm] = useState<ContactFormData>({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  let mapUrl = s.map_embed || '';
  if (mapUrl.includes('<iframe') && mapUrl.includes('src=')) {
    const match = mapUrl.match(/src="([^"]+)"/);
    if (match && match[1]) {
      mapUrl = match[1];
    }
  } else if (mapUrl && !mapUrl.includes('output=embed') && !mapUrl.includes('/embed')) {
    const llMatch = mapUrl.match(/ll=([\d.-]+,[\d.-]+)/);
    const atMatch = mapUrl.match(/@([\d.-]+,[\d.-]+)/);
    const qMatch = mapUrl.match(/[?&]q=([^&]+)/);
    const coords = (llMatch && llMatch[1]) || (atMatch && atMatch[1]) || (qMatch && qMatch[1]);
    if (coords) {
      mapUrl = `https://maps.google.com/maps?q=${coords}&z=15&output=embed`;
    }
  }

  const mutation = useMutation({
    mutationFn: () => {
      // Create cleaned payload without empty strings to pass backend Pydantic validation
      const payload: Partial<ContactFormData> = { ...form };
      if (!payload.email?.trim()) delete payload.email;
      if (!payload.subject?.trim()) delete payload.subject;
      if (!payload.phone?.trim()) delete payload.phone;

      return api.submitContact(payload as ContactFormData);
    },
    onSuccess: () => { setSent(true); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); },
  });

  const infos = [
    { icon: Phone, label: s.phone_1, href: `tel:${s.phone_1}`, title: lang === 'uz' ? 'Telefon' : lang === 'ru' ? 'Телефон' : 'Phone' },
    { icon: Mail, label: s.email, href: `mailto:${s.email}`, title: 'Email' },
    { icon: Clock, label: s.working_hours, title: lang === 'uz' ? 'Ish vaqti' : lang === 'ru' ? 'Время работы' : 'Hours' },
  ].filter(i => i.label);

  const contactDescription = sanitizeDescription(
    `${localizedField(s, 'address', lang) || ''} ${s.phone_1 || ''} ${s.email || ''}`.trim()
      || "ECO COMPANY bilan bog'lanish uchun telefon, email va manzil ma'lumotlari.",
  );
  const seoImage = pickPrimaryImage(s.hero_image_url as string | undefined, s.logo_url as string | undefined, '/images/about.jpg');
  const contactKeywords = mergeKeywords(
    localizedField(s, 'seo_keywords', lang),
    localizedField(s, 'seo_contact_keywords', lang),
    defaultSeoKeywords(lang),
    t('contact_title', lang),
    localizedField(s, 'address', lang),
    s.phone_1 || '',
    keywordPhrase('ECO COMPANY', lang === 'uz' ? "bog'lanish" : lang === 'ru' ? 'контакты' : 'contact'),
  );

  return (
    <div className="min-h-screen overflow-x-hidden">
      <SEO
        title={`${t('contact_title', lang)} | ECO COMPANY`}
        description={contactDescription}
        image={seoImage}
        keywords={contactKeywords}
        canonicalPath="/contact"
        lang={lang}
        structuredData={[
          buildBreadcrumbSchema([
            { name: t('nav_home', lang), path: '/' },
            { name: t('nav_contact', lang), path: '/contact' },
          ]),
          buildLocalBusinessSchema(s, lang, contactKeywords),
        ]}
      />
      {/* Hero */}
      <section className="relative flex items-center justify-center gradient-hero overflow-hidden pt-32 pb-14 sm:pt-36 sm:pb-20">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] -bottom-20 -left-20 pointer-events-none" />
        <div className="relative z-10 text-center container mx-auto px-4">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs font-black uppercase tracking-[0.25em] text-water-teal mb-4 block"
          >
            {lang === 'uz' ? "Biz bilan bog'laning" : lang === 'ru' ? 'Свяжитесь с нами' : 'Get in touch'}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-foreground tracking-tight"
          >
            {t('contact_title', lang)}
          </motion.h1>
        </div>
      </section>

      <section className="py-16 sm:py-24 gradient-section overflow-x-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="min-w-0 lg:col-span-3 gradient-card hover-glow rounded-[1.75rem] sm:rounded-[2rem] p-4 sm:p-6 md:p-10 border border-border shadow-water relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="relative z-10">
                {sent ? (
                  <div className="text-center py-10 sm:py-16">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-6 shadow-sm border border-emerald-500/20">
                      <CheckCircle size={32} className="text-emerald-500" />
                    </div>
                    <h3 className="font-display text-2xl font-black text-foreground mb-3">{t('contact_success', lang)}</h3>
                    <p className="text-muted-foreground text-base font-body">
                      {lang === 'uz' ? "Tez orada siz bilan bog'lanamiz" : lang === 'ru' ? 'Мы свяжемся с вами в ближайшее время' : "We'll get back to you soon"}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={e => { e.preventDefault(); mutation.mutate(); }} className="space-y-5 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      {[
                        { key: 'name', type: 'text', required: true },
                        { key: 'phone', type: 'tel', required: true },
                        { key: 'email', type: 'email' },
                        { key: 'subject', type: 'text' },
                      ].map(f => (
                        <div key={f.key} className="min-w-0">
                          <label className="text-[11px] sm:text-xs font-black uppercase tracking-[0.18em] sm:tracking-widest text-muted-foreground mb-2 block">
                            {t(`contact_${f.key}`, lang)}{f.required ? ' *' : ''}
                          </label>
                          <input
                            type={f.type}
                            value={form[f.key as keyof ContactFormData]}
                            onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                            required={f.required}
                            className="w-full min-w-0 px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl bg-muted/50 dark:bg-muted border border-border text-base text-foreground font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-background transition-all"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="min-w-0">
                      <label className="text-[11px] sm:text-xs font-black uppercase tracking-[0.18em] sm:tracking-widest text-muted-foreground mb-2 block">
                        {t('contact_message', lang)} *
                      </label>
                      <textarea
                        value={form.message}
                        onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                        required
                        minLength={10}
                        maxLength={2000}
                        rows={5}
                        className="w-full min-w-0 px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl bg-muted/50 dark:bg-muted border border-border text-base text-foreground font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-background transition-all resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={mutation.isPending}
                      className="w-full py-3.5 sm:py-4 rounded-2xl bg-primary text-primary-foreground font-bold hover:-translate-y-0.5 hover:shadow-water-lg transition-all disabled:opacity-50 flex items-center justify-center gap-3 text-base mt-2"
                    >
                      {mutation.isPending ? '...' : (
                        <>
                          <Send size={18} />
                          {t('contact_send', lang)}
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="min-w-0 lg:col-span-2 space-y-4 sm:space-y-5"
            >
              {infos.map((info, i) => (
                <div key={i} className="min-w-0 p-4 sm:p-6 rounded-[1.5rem] gradient-card border border-border shadow-sm hover-lift group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                      <info.icon size={20} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1.5">{info.title}</h4>
                      {info.href ? (
                        <a href={info.href} className="block break-words text-base leading-relaxed text-foreground font-bold hover:text-primary transition-colors">{info.label}</a>
                      ) : (
                        <p className="break-words text-base leading-relaxed text-foreground font-bold">{info.label}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {mapUrl && (
                <div className="rounded-[1.5rem] overflow-hidden border border-border shadow-sm h-56 sm:h-64 mt-4 bg-muted">
                  <iframe
                    src={mapUrl}
                    className="w-full h-full border-0 dark:grayscale-[0.2] dark:invert-[1] dark:contrast-[0.8] dark:hue-rotate-180 transition-all duration-700"
                    loading="lazy"
                    allowFullScreen
                    title="Location Map"
                  />
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
