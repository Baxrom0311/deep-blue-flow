import { Link } from 'react-router-dom';
import { useLang } from '@/contexts/LangContext';
import { useSettings } from '@/contexts/SettingsContext';
import { t, localizedField } from '@/lib/i18n';
import WaveDivider from './WaveDivider';

const Footer = () => {
  const { lang } = useLang();
  const s = useSettings();

  return (
    <footer className="relative">
      <WaveDivider color="hsl(var(--water-deep))" />
      <div className="bg-water-deep text-primary-foreground">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div>
              <h3 className="font-display text-2xl font-semibold mb-4">ECO COMPANY</h3>
              <p className="text-primary-foreground/60 text-sm leading-relaxed">{t('footer_desc', lang)}</p>
            </div>

            {/* Nav */}
            <div>
              <h4 className="font-display text-lg font-semibold mb-4">{t('nav_home', lang)}</h4>
              <div className="flex flex-col gap-2">
                {[
                  { key: 'nav_products', path: '/products' },
                  { key: 'nav_about', path: '/about' },
                  { key: 'nav_certificates', path: '/certificates' },
                  { key: 'nav_gallery', path: '/gallery' },
                  { key: 'nav_contact', path: '/contact' },
                ].map(l => (
                  <Link key={l.path} to={l.path} className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                    {t(l.key, lang)}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-display text-lg font-semibold mb-4">{t('nav_contact', lang)}</h4>
              <div className="flex flex-col gap-2 text-sm text-primary-foreground/60">
                {s.phone_1 && <a href={`tel:${s.phone_1}`} className="hover:text-primary-foreground">{s.phone_1}</a>}
                {s.phone_2 && <a href={`tel:${s.phone_2}`} className="hover:text-primary-foreground">{s.phone_2}</a>}
                {s.email && <a href={`mailto:${s.email}`} className="hover:text-primary-foreground">{s.email}</a>}
                {localizedField(s, 'address', lang) && <p>{localizedField(s, 'address', lang)}</p>}
              </div>
            </div>

            {/* Social */}
            <div>
              <h4 className="font-display text-lg font-semibold mb-4">Social</h4>
              <div className="flex gap-3">
                {s.instagram_url && (
                  <a href={s.instagram_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center text-primary-foreground/70 hover:bg-primary-foreground/20 transition-colors text-sm">IG</a>
                )}
                {s.telegram_url && (
                  <a href={s.telegram_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center text-primary-foreground/70 hover:bg-primary-foreground/20 transition-colors text-sm">TG</a>
                )}
                {s.facebook_url && (
                  <a href={s.facebook_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center text-primary-foreground/70 hover:bg-primary-foreground/20 transition-colors text-sm">FB</a>
                )}
                {s.youtube_url && (
                  <a href={s.youtube_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center text-primary-foreground/70 hover:bg-primary-foreground/20 transition-colors text-sm">YT</a>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-primary-foreground/10 mt-12 pt-6 text-center text-xs text-primary-foreground/40">
            © {new Date().getFullYear()} ECO COMPANY. {t('footer_rights', lang)}.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
