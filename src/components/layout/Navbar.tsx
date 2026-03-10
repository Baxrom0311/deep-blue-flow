import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  const showSolid = scrolled;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-4 sm:px-6 lg:px-8 ${showSolid ? 'pt-4' : 'pt-6'}`}
      >
        <div className={`mx-auto max-w-7xl flex items-center justify-between transition-all duration-500 ${showSolid
          ? 'glass py-3 px-4 lg:px-6 rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] border border-white/40 dark:border-white/10 bg-white/60 dark:bg-[#0a0f1c]/60'
          : 'bg-transparent py-2 px-4 lg:px-6'
          }`}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white/60 dark:bg-white/10 border border-white/50 dark:border-white/5 shadow-sm flex items-center justify-center p-1 backdrop-blur-md">
              <img src={settings.logo_url || '/favicon.svg'} alt="ECO" className="h-full w-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className={`font-display text-xl font-black tracking-tight leading-none ${showSolid ? 'text-foreground' : 'text-foreground'
                }`}>
                ECO COMPANY
              </span>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">
                Premium Water
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1 bg-card/50 backdrop-blur-md px-2 py-1.5 rounded-2xl border border-border shadow-sm">
            {navLinks.map(link => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${isActive
                    ? 'text-primary bg-primary/10 shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                >
                  {t(link.key, lang)}
                </Link>
              );
            })}
          </div>

          {/* Right controls */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Lang switcher */}
            <div className="flex items-center bg-card border border-border shadow-sm rounded-xl p-1">
              {langs.map(l => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  aria-label={`Tilni almashtirish: ${l.code.toUpperCase()}`}
                  aria-pressed={lang === l.code}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-bold transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${lang === l.code
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                >
                  <span className="text-sm leading-none">{l.flag}</span>
                  {l.label}
                </button>
              ))}
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label={theme === 'light' ? 'Tungi rejimga o\'tish' : 'Kunduzgi rejimga o\'tish'}
              className="p-2.5 rounded-xl bg-card border border-border shadow-sm text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              title={theme === 'light' ? 'Dark mode' : 'Light mode'}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Asosiy menyuni ochish"
            aria-expanded={mobileOpen}
            className="lg:hidden p-2.5 rounded-xl bg-card text-foreground shadow-sm border border-border focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-foreground/20 dark:bg-black/40 backdrop-blur-md lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-80 max-w-[85vw] bg-background border-l border-border p-6 pt-24 shadow-2xl lg:hidden flex flex-col"
            >
              <div className="flex flex-col gap-2 flex-1">
                {navLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`px-5 py-3.5 rounded-2xl text-base font-bold transition-all ${location.pathname === link.path
                      ? 'text-primary bg-primary/10 border border-primary/20 shadow-sm'
                      : 'text-muted-foreground hover:bg-muted/50 border border-transparent'
                      }`}
                  >
                    {t(link.key, lang)}
                  </Link>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-border shrink-0 space-y-4">
                <div className="flex gap-2 bg-muted/50 p-1.5 rounded-2xl border border-border">
                  {langs.map(l => (
                    <button
                      key={l.code}
                      onClick={() => setLang(l.code)}
                      className={`flex-1 text-xs px-2 py-3 rounded-xl font-bold transition-all ${lang === l.code
                        ? 'bg-card text-primary shadow-sm border border-border'
                        : 'text-muted-foreground'
                        }`}
                    >
                      <span className="text-sm mb-1 block">{l.flag}</span>
                      {l.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-3 px-5 py-3.5 rounded-2xl text-foreground hover:bg-muted/50 w-full transition-colors font-bold border border-transparent"
                >
                  {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                  <span className="text-sm">{theme === 'light' ? 'Tungi rejim' : 'Kunduzgi rejim'}</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
