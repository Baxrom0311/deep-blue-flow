import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Phone, Mail, MapPin, Clock, CheckCircle, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLang } from '@/contexts/LangContext';
import { useSettings } from '@/contexts/SettingsContext';
import { t, localizedField } from '@/lib/i18n';
import { api } from '@/lib/api';

const ContactPage = () => {
  const { lang } = useLang();
  const s = useSettings();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const mutation = useMutation({
    mutationFn: () => api.submitContact(form),
    onSuccess: () => { setSent(true); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); },
  });

  const infos = [
    { icon: Phone, label: s.phone_1, href: `tel:${s.phone_1}`, title: lang === 'uz' ? 'Telefon' : lang === 'ru' ? 'Телефон' : 'Phone' },
    { icon: Mail, label: s.email, href: `mailto:${s.email}`, title: 'Email' },
    { icon: MapPin, label: localizedField(s, 'address', lang), title: lang === 'uz' ? 'Manzil' : lang === 'ru' ? 'Адрес' : 'Address' },
    { icon: Clock, label: s.working_hours, title: lang === 'uz' ? 'Ish vaqti' : lang === 'ru' ? 'Время работы' : 'Hours' },
  ].filter(i => i.label);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative gradient-hero flex items-center justify-center" style={{ minHeight: '45vh' }}>
        <div className="absolute w-[400px] h-[400px] rounded-full bg-white/5 blur-[100px] -bottom-20 -left-20" />
        <div className="relative z-10 text-center container mx-auto px-4">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50 mb-3 block"
          >
            {lang === 'uz' ? "Biz bilan bog'laning" : lang === 'ru' ? 'Свяжитесь с нами' : 'Get in touch'}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-6xl font-bold text-white"
          >
            {t('contact_title', lang)}
          </motion.h1>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-3 bg-card rounded-2xl p-8 md:p-10 border border-border/50"
            >
              {sent ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={28} className="text-accent" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-card-foreground mb-2">{t('contact_success', lang)}</h3>
                  <p className="text-muted-foreground text-sm">
                    {lang === 'uz' ? "Tez orada siz bilan bog'lanamiz" : lang === 'ru' ? 'Мы свяжемся с вами в ближайшее время' : "We'll get back to you soon"}
                  </p>
                </div>
              ) : (
                <form onSubmit={e => { e.preventDefault(); mutation.mutate(); }} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[
                      { key: 'name', type: 'text', required: true },
                      { key: 'phone', type: 'tel', required: true },
                      { key: 'email', type: 'email' },
                      { key: 'subject', type: 'text' },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                          {t(`contact_${f.key}`, lang)}{f.required ? ' *' : ''}
                        </label>
                        <input
                          type={f.type}
                          value={(form as any)[f.key]}
                          onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                          required={f.required}
                          className="w-full px-4 py-3 rounded-xl bg-muted text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all border border-transparent focus:border-primary/20"
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                      {t('contact_message', lang)} *
                    </label>
                    <textarea
                      value={form.message}
                      onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl bg-muted text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none border border-transparent focus:border-primary/20"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                  >
                    {mutation.isPending ? '...' : (
                      <>
                        <Send size={16} />
                        {t('contact_send', lang)}
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 space-y-4"
            >
              {infos.map((info, i) => (
                <div key={i} className="p-5 rounded-2xl bg-card border border-border/50 hover-lift">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <info.icon size={18} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{info.title}</h4>
                      {info.href ? (
                        <a href={info.href} className="text-sm text-foreground font-medium hover:text-primary transition-colors">{info.label}</a>
                      ) : (
                        <p className="text-sm text-foreground font-medium">{info.label}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {s.map_embed_url && (
                <div className="rounded-2xl overflow-hidden border border-border/50 h-56">
                  <iframe
                    src={s.map_embed_url}
                    className="w-full h-full border-0"
                    loading="lazy"
                    allowFullScreen
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
