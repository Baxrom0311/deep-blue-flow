import { Link } from 'react-router-dom';
import { useLang } from '@/contexts/LangContext';
import { useSettings } from '@/contexts/SettingsContext';
import { t, localizedField } from '@/lib/i18n';
import { ArrowUpRight, Droplets, MapPin } from 'lucide-react';

const Footer = () => {
  const { lang } = useLang();
  const s = useSettings();

  const links = [
    { key: 'nav_products', path: '/products' },
    { key: 'nav_about', path: '/about' },
    { key: 'nav_certificates', path: '/certificates' },
    { key: 'nav_gallery', path: '/gallery' },
    { key: 'nav_contact', path: '/contact' },
  ];

  const socials = [
    { label: 'Instagram', url: s.instagram_url },
    { label: 'Telegram', url: s.telegram_url },
    { label: 'Facebook', url: s.facebook_url },
    { label: 'YouTube', url: s.youtube_url },
  ].filter(s => s.url);

  return (
    <footer className="bg-muted/50 dark:bg-card border-t border-border relative overflow-hidden">
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        {/* Map Section */}
        {s.map_embed_url && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <MapPin size={20} className="text-primary" />
              </div>
              <div>
                <h4 className="font-display font-bold text-foreground text-lg">
                  {lang === 'uz' ? 'Bizning manzil' : lang === 'ru' ? 'Наш адрес' : 'Our Location'}
                </h4>
                {localizedField(s, 'address', lang) && (
                  <p className="text-sm text-muted-foreground">{localizedField(s, 'address', lang)}</p>
                )}
              </div>
            </div>
            <div className="rounded-[2rem] overflow-hidden border border-border shadow-water h-64 md:h-80">
              <iframe
                src={s.map_embed_url}
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
                title="Location Map"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-card dark:bg-muted shadow-sm flex items-center justify-center p-1 border border-border text-primary">
                {s.logo_url ? <img src={s.logo_url} alt="ECO" className="h-full w-full object-contain" /> : <Droplets size={24} />}
              </div>
              <span className="font-display text-xl font-black tracking-tight text-foreground leading-none">ECO COMPANY</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed font-body">
              {t('footer_desc', lang)}
            </p>
          </div>

          {/* Nav */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">
              {lang === 'uz' ? 'Sahifalar' : lang === 'ru' ? 'Страницы' : 'Pages'}
            </h4>
            <div className="flex flex-col gap-4">
              {links.map(l => (
                <Link
                  key={l.path}
                  to={l.path}
                  className="text-sm font-bold text-foreground/70 hover:text-primary hover:translate-x-1 transition-all inline-block w-fit"
                >
                  {t(l.key, lang)}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">
              {t('nav_contact', lang)}
            </h4>
            <div className="flex flex-col gap-4 text-sm font-bold text-foreground/70">
              {s.phone_1 && (
                <a href={`tel:${s.phone_1}`} className="hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 block" /> {s.phone_1}
                </a>
              )}
              {s.phone_2 && (
                <a href={`tel:${s.phone_2}`} className="hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/30 block" /> {s.phone_2}
                </a>
              )}
              {s.email && <a href={`mailto:${s.email}`} className="hover:text-primary transition-colors mt-2">{s.email}</a>}
              {localizedField(s, 'address', lang) && (
                <p className="mt-2 text-muted-foreground font-medium leading-relaxed">{localizedField(s, 'address', lang)}</p>
              )}
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">Social</h4>
            <div className="flex flex-col gap-4">
              {socials.map(social => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold text-foreground/70 hover:text-primary hover:translate-x-1 transition-all flex items-center gap-2 w-fit bg-card dark:bg-muted px-4 py-2 rounded-xl shadow-sm border border-border"
                >
                  {social.label} <ArrowUpRight size={14} className="text-muted-foreground" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm font-bold text-muted-foreground">
            © {new Date().getFullYear()} ECO COMPANY. {t('footer_rights', lang)}.
          </p>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-black uppercase tracking-widest text-primary">
            <Droplets size={14} /> Premium Purified Water
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
