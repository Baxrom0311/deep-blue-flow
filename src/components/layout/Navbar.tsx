import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, ChevronDown } from 'lucide-react';
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
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  const isHome = location.pathname === '/';
  const showSolid = scrolled || !isHome;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          showSolid
            ? 'bg-background/80 backdrop-blur-2xl border-b border-border/50 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            {settings.logo_url && (
              <img src={settings.logo_url} alt="ECO" className="h-8 w-8 object-contain" />
            )}
            <div className="flex flex-col">
              <span className={`font-display text-lg font-bold tracking-tight leading-none ${
                showSolid ? 'text-foreground' : 'text-white'
              }`}>
                ECO COMPANY
              </span>
              <span className={`text-[10px] font-medium tracking-[0.2em] uppercase ${
                showSolid ? 'text-muted-foreground' : 'text-white/50'
              }`}>
                Premium Water
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? (showSolid ? 'text-primary bg-primary/5' : 'text-white bg-white/10')
                      : (showSolid ? 'text-muted-foreground hover:text-foreground hover:bg-muted/50' : 'text-white/70 hover:text-white hover:bg-white/5')
                  }`}
                >
                  {t(link.key, lang)}
                </Link>
              );
            })}
          </div>

          {/* Right controls */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Lang switcher */}
            <div className={`flex items-center rounded-lg p-0.5 ${showSolid ? 'bg-muted/50' : 'bg-white/10'}`}>
              {langs.map(l => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={`text-xs px-2.5 py-1.5 rounded-md font-medium transition-all duration-200 ${
                    lang === l.code
                      ? (showSolid ? 'bg-background shadow-sm text-foreground' : 'bg-white/20 text-white')
                      : (showSolid ? 'text-muted-foreground hover:text-foreground' : 'text-white/50 hover:text-white/80')
                  }`}
                >
                  {l.flag} {l.label}
                </button>
              ))}
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-200 ${
                showSolid
                  ? 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                  : 'hover:bg-white/10 text-white/70 hover:text-white'
              }`}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden p-2 rounded-lg ${
              showSolid ? 'text-foreground' : 'text-white'
            }`}
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
              className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-40 w-80 max-w-[85vw] bg-background border-l border-border p-6 pt-20 lg:hidden"
            >
              <div className="flex flex-col gap-1">
                {navLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      location.pathname === link.path
                        ? 'text-primary bg-primary/5'
                        : 'text-foreground hover:bg-muted/50'
                    }`}
                  >
                    {t(link.key, lang)}
                  </Link>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex gap-2 mb-4">
                  {langs.map(l => (
                    <button
                      key={l.code}
                      onClick={() => setLang(l.code)}
                      className={`text-sm px-4 py-2 rounded-lg font-medium transition-all ${
                        lang === l.code
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {l.flag} {l.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-muted/50 w-full transition-colors"
                >
                  {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                  <span className="text-sm font-medium">{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
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
