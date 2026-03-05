import { Link } from 'react-router-dom';
import { useLang } from '@/contexts/LangContext';
import { useSettings } from '@/contexts/SettingsContext';
import { t, localizedField } from '@/lib/i18n';
import { ArrowUpRight } from 'lucide-react';

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
    <footer className="bg-foreground dark:bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="font-display text-xl font-bold text-background dark:text-foreground mb-3">ECO COMPANY</h3>
            <p className="text-sm text-background/50 dark:text-muted-foreground leading-relaxed max-w-xs">
              {t('footer_desc', lang)}
            </p>
          </div>

          {/* Nav */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-background/40 dark:text-muted-foreground mb-4">
              {lang === 'uz' ? 'Sahifalar' : lang === 'ru' ? 'Страницы' : 'Pages'}
            </h4>
            <div className="flex flex-col gap-2.5">
              {links.map(l => (
                <Link
                  key={l.path}
                  to={l.path}
                  className="text-sm text-background/60 dark:text-muted-foreground hover:text-background dark:hover:text-foreground transition-colors"
                >
                  {t(l.key, lang)}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-background/40 dark:text-muted-foreground mb-4">
              {t('nav_contact', lang)}
            </h4>
            <div className="flex flex-col gap-2.5 text-sm text-background/60 dark:text-muted-foreground">
              {s.phone_1 && <a href={`tel:${s.phone_1}`} className="hover:text-background dark:hover:text-foreground transition-colors">{s.phone_1}</a>}
              {s.phone_2 && <a href={`tel:${s.phone_2}`} className="hover:text-background dark:hover:text-foreground transition-colors">{s.phone_2}</a>}
              {s.email && <a href={`mailto:${s.email}`} className="hover:text-background dark:hover:text-foreground transition-colors">{s.email}</a>}
              {localizedField(s, 'address', lang) && <p>{localizedField(s, 'address', lang)}</p>}
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-background/40 dark:text-muted-foreground mb-4">
              Social
            </h4>
            <div className="flex flex-col gap-2.5">
              {socials.map(social => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-background/60 dark:text-muted-foreground hover:text-background dark:hover:text-foreground transition-colors flex items-center gap-1.5"
                >
                  {social.label} <ArrowUpRight size={12} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 dark:border-border mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-background/30 dark:text-muted-foreground">
            © {new Date().getFullYear()} ECO COMPANY. {t('footer_rights', lang)}.
          </p>
          <p className="text-xs text-background/30 dark:text-muted-foreground">
            Premium Purified Water
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
