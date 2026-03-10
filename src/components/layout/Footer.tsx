import { useLang } from '@/contexts/LangContext';
import { useSettings } from '@/contexts/SettingsContext';
import { t, localizedField } from '@/lib/i18n';
import { ArrowUpRight, Droplets, MapPin } from 'lucide-react';

const Footer = () => {
  const { lang } = useLang();
  const s = useSettings();

  // If user pasted a full iframe code instead of just the URL, extract the src
  let mapUrl = s.map_embed || '';
  if (mapUrl.includes('<iframe') && mapUrl.includes('src=')) {
    const match = mapUrl.match(/src="([^"]+)"/);
    if (match && match[1]) {
      mapUrl = match[1];
    }
  } else if (mapUrl && !mapUrl.includes('output=embed') && !mapUrl.includes('/embed')) {
    // If it's a regular Google Maps link, attempt to extract coords to build an embed URL
    const llMatch = mapUrl.match(/ll=([\d.-]+,[\d.-]+)/);
    const atMatch = mapUrl.match(/@([\d.-]+,[\d.-]+)/);
    const qMatch = mapUrl.match(/[?&]q=([^&]+)/);

    const coords = (llMatch && llMatch[1]) || (atMatch && atMatch[1]) || (qMatch && qMatch[1]);
    if (coords) {
      mapUrl = `https://maps.google.com/maps?q=${coords}&z=15&output=embed`;
    }
  }

  const socials = [
    { label: 'Instagram', url: s.instagram_url },
    { label: 'Telegram', url: s.telegram_url },
    { label: 'Facebook', url: s.facebook_url },
    { label: 'YouTube', url: s.youtube_url },
  ].filter(s => s.url);

  // Placeholder for LogoIcon, assuming it's defined elsewhere or needs to be added
  const LogoIcon = () => (
    <div className="w-10 h-10 rounded-xl bg-card dark:bg-muted shadow-sm flex items-center justify-center p-1 border border-border text-primary">
      {s.logo_url ? <img src={s.logo_url} alt="ECO" className="h-full w-full object-contain" /> : <Droplets size={24} />}
    </div>
  );

  return (
    <footer className="border-t border-border bg-muted/35 dark:bg-card relative overflow-hidden">
      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="rounded-[2rem] border border-border bg-background/70 p-5 shadow-sm backdrop-blur-[2px] dark:bg-slate-950/20 md:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left Side: Map */}
            {mapUrl && (
              <div className="w-full h-[300px] lg:h-full min-h-[300px] flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                    <MapPin size={20} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-foreground text-lg leading-tight">
                      {lang === 'uz' ? 'Bizning manzil' : lang === 'ru' ? 'Наш адрес' : 'Our Location'}
                    </h4>
                    {localizedField(s, 'address', lang) && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{localizedField(s, 'address', lang)}</p>
                    )}
                  </div>
                </div>
                <div className="rounded-2xl overflow-hidden border border-border shadow-sm flex-grow relative bg-card/80 dark:bg-slate-950/30">
                  <iframe
                    src={mapUrl}
                    className="absolute inset-0 w-full h-full border-0 dark:grayscale-[0.2] dark:invert-[1] dark:contrast-[0.8] dark:hue-rotate-180 transition-all duration-700"
                    loading="lazy"
                    allowFullScreen
                    title="Location Map"
                  />
                </div>
              </div>
            )}

            {/* Right Side: Contact & Social */}
            <div className="flex flex-col gap-10 justify-center h-full">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <LogoIcon />
                  <span className="font-display text-xl font-black tracking-tight text-foreground leading-none">ECO COMPANY</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6 font-medium max-w-sm">
                  {t('footer_desc', lang)}
                </p>

                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">
                  {t('nav_contact', lang)}
                </h4>
                <div className="flex flex-col gap-3 text-sm font-bold text-foreground/70">
                  {s.phone_1 && (
                    <a href={`tel:${s.phone_1}`} className="hover:text-primary transition-colors flex items-center gap-2 w-fit">
                      <span className="w-2 h-2 rounded-full bg-green-400 block shrink-0" /> {s.phone_1}
                    </a>
                  )}
                  {s.phone_2 && (
                    <a href={`tel:${s.phone_2}`} className="hover:text-primary transition-colors flex items-center gap-2 w-fit">
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/30 block shrink-0" /> {s.phone_2}
                    </a>
                  )}
                  {s.email && <a href={`mailto:${s.email}`} className="hover:text-primary transition-colors mt-1 w-fit flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary/50 block shrink-0" /> {s.email}</a>}
                </div>
              </div>

              {socials.length > 0 && (
                <div>
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Social</h4>
                  <div className="flex flex-wrap gap-2">
                    {socials.map(social => (
                      <a
                        key={social.label}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-foreground/70 hover:text-primary transition-all flex items-center gap-1.5 w-fit bg-card/80 dark:bg-slate-950/30 px-3 py-1.5 rounded-lg shadow-sm border border-border"
                      >
                        {social.label} <ArrowUpRight size={14} className="text-muted-foreground" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-center md:justify-end">
            <p className="text-xs text-foreground/60 text-center md:text-right">
              Created By: <a href="https://t.me/bakhromdev" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors font-bold">@Bakhromdev</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
