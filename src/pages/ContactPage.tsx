import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Phone, Mail, MapPin, Clock, CheckCircle, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLang } from '@/contexts/LangContext';
import { useSettings } from '@/contexts/SettingsContext';
import { t, localizedField } from '@/lib/i18n';
import { api } from '@/lib/api';
import { ContactFormData } from '@/types';

const ContactPage = () => {
  const { lang } = useLang();
  const s = useSettings();
  const [form, setForm] = useState<ContactFormData>({ name: '', email: '', phone: '', subject: '', message: '' });
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
      <section className="relative flex items-center justify-center bg-gradient-to-b from-sky-50 to-white dark:from-[hsl(222,47%,8%)] dark:to-background overflow-hidden" style={{ minHeight: '45vh' }}>
        <div className="absolute w-[500px] h-[500px] rounded-full bg-water-teal/10 blur-[120px] -bottom-20 -left-20 pointer-events-none" />
        <div className="relative z-10 text-center container mx-auto px-4 pt-24">
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
            className="font-display text-5xl md:text-6xl lg:text-7xl font-black text-foreground tracking-tight"
          >
            {t('contact_title', lang)}
          </motion.h1>
        </div>
      </section>

      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-3 bg-card rounded-[2rem] p-8 md:p-12 border border-border shadow-water"
            >
              {sent ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-6 shadow-sm border border-emerald-500/20">
                    <CheckCircle size={32} className="text-emerald-500" />
                  </div>
                  <h3 className="font-display text-2xl font-black text-foreground mb-3">{t('contact_success', lang)}</h3>
                  <p className="text-muted-foreground text-base font-body">
                    {lang === 'uz' ? "Tez orada siz bilan bog'lanamiz" : lang === 'ru' ? 'Мы свяжемся с вами в ближайшее время' : "We'll get back to you soon"}
                  </p>
                </div>
              ) : (
                <form onSubmit={e => { e.preventDefault(); mutation.mutate(); }} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[
                      { key: 'name', type: 'text', required: true },
                      { key: 'phone', type: 'tel', required: true },
                      { key: 'email', type: 'email' },
                      { key: 'subject', type: 'text' },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2.5 block">
                          {t(`contact_${f.key}`, lang)}{f.required ? ' *' : ''}
                        </label>
                        <input
                          type={f.type}
                          value={form[f.key as keyof ContactFormData]}
                          onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                          required={f.required}
                          className="w-full px-5 py-3.5 rounded-2xl bg-muted border border-border text-foreground font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2.5 block">
                      {t('contact_message', lang)} *
                    </label>
                    <textarea
                      value={form.message}
                      onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                      required
                      rows={5}
                      className="w-full px-5 py-3.5 rounded-2xl bg-muted border border-border text-foreground font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full py-4.5 rounded-2xl bg-primary text-white font-bold hover:-translate-y-0.5 hover:shadow-water-lg transition-all disabled:opacity-50 flex items-center justify-center gap-3 text-base"
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
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 space-y-5"
            >
              {infos.map((info, i) => (
                <div key={i} className="p-6 rounded-[1.5rem] bg-card border border-border shadow-sm hover-lift">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                      <info.icon size={20} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1.5">{info.title}</h4>
                      {info.href ? (
                        <a href={info.href} className="text-base text-foreground font-bold hover:text-primary transition-colors">{info.label}</a>
                      ) : (
                        <p className="text-base text-foreground font-bold">{info.label}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {s.map_embed_url && (
                <div className="rounded-[1.5rem] overflow-hidden border border-border shadow-sm h-56">
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
