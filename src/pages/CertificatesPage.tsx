import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, Eye, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLang } from '@/contexts/LangContext';
import { t, localizedField } from '@/lib/i18n';
import { api } from '@/lib/api';
import { Certificate, PaginatedResponse } from '@/types';
import MediaLightbox from '@/components/ui/MediaLightbox';

const CertificatesPage = () => {
  const { lang } = useLang();
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const { data, isLoading } = useQuery<Certificate[] | PaginatedResponse<Certificate>>({ queryKey: ['certificates'], queryFn: api.getCertificates, staleTime: 5 * 60 * 1000 });
  const certs = Array.isArray(data) ? data : (data?.items || []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative flex items-center justify-center gradient-hero overflow-hidden pt-36 pb-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[400px] h-[400px] rounded-full bg-accent/8 dark:bg-accent/5 blur-[120px] -top-20 -left-20" style={{ animation: 'float 12s ease-in-out infinite' }} />
          <div className="absolute w-[350px] h-[350px] rounded-full bg-primary/6 dark:bg-primary/3 blur-[100px] bottom-0 right-0" style={{ animation: 'float-slow 10s ease-in-out 2s infinite' }} />
        </div>
        <div className="relative z-10 text-center container mx-auto px-4">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.35em] text-gradient-water mb-4"
          >
            <ShieldCheck size={16} />
            {lang === 'uz' ? 'Sifat kafolati' : lang === 'ru' ? 'Гарантия качества' : 'Quality Assurance'}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-black text-gradient-premium tracking-tight"
          >
            {t('certificates_title', lang)}
          </motion.h1>
        </div>
      </section>

      <section className="py-24 gradient-mesh bg-background">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-[3/4] rounded-[2rem] shimmer" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {certs.map((cert: Certificate, i: number) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  className="rounded-[2rem] overflow-hidden bg-card border border-border shadow-sm hover-lift group p-3"
                >
                  <button
                    type="button"
                    onClick={() => setSelectedCertificate(cert)}
                    className="aspect-[3/4] rounded-[1.5rem] overflow-hidden bg-muted/50 relative block group/img"
                  >
                    <img
                      src={cert.preview_url || cert.image_url || cert.file_url}
                      alt={localizedField(cert, 'title', lang)}
                      className="w-full h-full object-contain p-2 bg-white dark:bg-card group-hover/img:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                  </button>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-bold text-foreground mb-2">{localizedField(cert, 'title', lang)}</h3>
                    <div className="flex gap-4">
                      {cert.file_url && (
                        <a href={cert.file_url} download className="flex items-center gap-2 text-sm text-primary font-bold hover:underline">
                          <Download size={15} /> {t('download', lang)}
                        </a>
                      )}
                      {cert.file_url && (
                        <button
                          type="button"
                          onClick={() => setSelectedCertificate(cert)}
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-bold"
                        >
                          <Eye size={15} />
                          {lang === 'uz' ? "Ko'rish" : lang === 'ru' ? 'Посмотреть' : 'View'}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <MediaLightbox
        open={!!selectedCertificate}
        imageUrl={selectedCertificate?.preview_url || selectedCertificate?.image_url || selectedCertificate?.file_url}
        downloadUrl={selectedCertificate?.file_url}
        title={selectedCertificate ? localizedField(selectedCertificate, 'title', lang) : ''}
        onClose={() => setSelectedCertificate(null)}
      />
    </div>
  );
};

export default CertificatesPage;
