import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Phone, Mail, MapPin, Clock, CheckCircle } from 'lucide-react';
import { useLang } from '@/contexts/LangContext';
import { useSettings } from '@/contexts/SettingsContext';
import { t, localizedField } from '@/lib/i18n';
import { api } from '@/lib/api';
import WaveDivider from '@/components/layout/WaveDivider';

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
    { icon: Phone, label: s.phone_1, href: `tel:${s.phone_1}` },
    { icon: Mail, label: s.email, href: `mailto:${s.email}` },
    { icon: MapPin, label: localizedField(s, 'address', lang) },
    { icon: Clock, label: s.working_hours },
  ].filter(i => i.label);

  return (
    <div className="min-h-screen">
      <section className="relative gradient-hero flex items-center justify-center" style={{ minHeight: '40vh' }}>
        <h1 className="font-display text-5xl font-light text-primary-foreground relative z-10">{t('contact_title', lang)}</h1>
        <div className="absolute bottom-0 left-0 right-0"><WaveDivider color="hsl(var(--background))" /></div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="bg-card rounded-2xl p-8 shadow-water">
              {sent ? (
                <div className="text-center py-12">
                  <CheckCircle size={48} className="mx-auto mb-4 text-accent" />
                  <p className="text-lg font-medium text-card-foreground">{t('contact_success', lang)}</p>
                </div>
              ) : (
                <form onSubmit={e => { e.preventDefault(); mutation.mutate(); }} className="space-y-5">
                  {[
                    { key: 'name', type: 'text', required: true },
                    { key: 'email', type: 'email' },
                    { key: 'phone', type: 'tel', required: true },
                    { key: 'subject', type: 'text' },
                  ].map(f => (
                    <div key={f.key} className="relative">
                      <input
                        type={f.type}
                        value={(form as any)[f.key]}
                        onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                        required={f.required}
                        placeholder={t(`contact_${f.key}`, lang) + (f.required ? ' *' : '')}
                        className="w-full px-4 py-3 rounded-xl bg-muted text-foreground outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                      />
                    </div>
                  ))}
                  <textarea
                    value={form.message}
                    onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                    required
                    placeholder={t('contact_message', lang) + ' *'}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-muted text-foreground outline-none focus:ring-2 focus:ring-primary/50 transition-shadow resize-none"
                  />
                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {mutation.isPending ? '...' : t('contact_send', lang)}
                  </button>
                </form>
              )}
            </div>

            {/* Info + Map */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {infos.map((info, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-card shadow-water hover:-translate-y-0.5 transition-transform">
                    <info.icon size={24} className="text-primary mb-3" />
                    {info.href ? (
                      <a href={info.href} className="text-sm text-card-foreground hover:text-primary transition-colors">{info.label}</a>
                    ) : (
                      <p className="text-sm text-card-foreground">{info.label}</p>
                    )}
                  </div>
                ))}
              </div>
              {s.map_embed_url && (
                <div className="rounded-2xl overflow-hidden shadow-water h-64">
                  <iframe
                    src={s.map_embed_url}
                    className="w-full h-full border-0"
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
