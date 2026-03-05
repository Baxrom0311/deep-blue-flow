import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useLang } from '@/contexts/LangContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useSettings } from '@/contexts/SettingsContext';
import { t, Lang } from '@/lib/i18n';

const langs: { code: Lang; flag: string; label: string }[] = [
  { code: 'uz', flag: '🇺🇿', label: 'UZ' },
  { code: 'ru', flag: '🇷🇺', label: 'RU' },
  { code: 'en', flag: '🇬🇧', label: 'EN' },
];

const navLinks = [
  { key: 'nav_home', path: '/' },
  { key: 'nav_products', path: '/products' },
  { key: 'nav_about', path: '/about' },
  { key: 'nav_certificates', path: '/certificates' },
  { key: 'nav_gallery', path: '/gallery' },
  { key: 'nav_contact', path: '/contact' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, setLang } = useLang();
  const { theme, toggleTheme } = useTheme();
  const settings = useSettings();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  const isHome = location.pathname === '/';

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHome
          ? 'glass-strong shadow-water py-3'
          : 'bg-transparent py-5'
      }`}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            {settings.logo_url && (
              <img src={settings.logo_url} alt="ECO" className="h-8 w-8 object-contain" />
            )}
            <span className={`font-display text-xl font-semibold tracking-wider ${
              scrolled || !isHome ? 'text-foreground' : 'text-primary-foreground'
            }`}>
              ECO COMPANY
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === link.path ? 'text-primary' : (scrolled || !isHome ? 'text-foreground' : 'text-primary-foreground/90')
                }`}
              >
                {t(link.key, lang)}
              </Link>
            ))}

            {/* Lang switcher */}
            <div className="flex items-center gap-1 ml-2">
              {langs.map(l => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={`text-xs px-2 py-1 rounded-full transition-all ${
                    lang === l.code
                      ? 'bg-primary text-primary-foreground'
                      : scrolled || !isHome ? 'text-muted-foreground hover:bg-muted' : 'text-primary-foreground/70 hover:text-primary-foreground'
                  }`}
                >
                  {l.flag} {l.label}
                </button>
              ))}
            </div>

            {/* Theme toggle */}
            <button onClick={toggleTheme} className={`p-2 rounded-full transition-colors ${
              scrolled || !isHome ? 'hover:bg-muted text-foreground' : 'hover:bg-primary-foreground/10 text-primary-foreground'
            }`}>
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className={`lg:hidden p-2 ${
            scrolled || !isHome ? 'text-foreground' : 'text-primary-foreground'
          }`}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 gradient-ocean p-6 pt-20 flex flex-col gap-4 animate-slide-up">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-lg font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors ${
                  location.pathname === link.path ? 'text-primary-foreground' : ''
                }`}
              >
                {t(link.key, lang)}
              </Link>
            ))}
            <div className="flex gap-2 mt-4">
              {langs.map(l => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={`text-sm px-3 py-1.5 rounded-full ${
                    lang === l.code ? 'bg-primary-foreground text-water-deep' : 'text-primary-foreground/70 border border-primary-foreground/30'
                  }`}
                >
                  {l.flag} {l.label}
                </button>
              ))}
            </div>
            <button onClick={toggleTheme} className="flex items-center gap-2 text-primary-foreground/80 mt-2">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              {theme === 'light' ? 'Dark' : 'Light'} mode
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
