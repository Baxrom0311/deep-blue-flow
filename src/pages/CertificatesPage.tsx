import { useQuery } from '@tanstack/react-query';
import { Download, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLang } from '@/contexts/LangContext';
import { t, localizedField } from '@/lib/i18n';
import { api } from '@/lib/api';

const CertificatesPage = () => {
  const { lang } = useLang();
  const { data, isLoading } = useQuery({ queryKey: ['certificates'], queryFn: api.getCertificates, staleTime: 5 * 60 * 1000 });
  const certs = Array.isArray(data) ? data : data?.items || [];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative gradient-hero flex items-center justify-center" style={{ minHeight: '45vh' }}>
        <div className="absolute w-[400px] h-[400px] rounded-full bg-white/5 blur-[100px] -top-20 -left-20" />
        <div className="relative z-10 text-center container mx-auto px-4">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50 mb-3 block"
          >
            {lang === 'uz' ? 'Sifat kafolati' : lang === 'ru' ? 'Гарантия качества' : 'Quality Assurance'}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-6xl font-bold text-white"
          >
            {t('certificates_title', lang)}
          </motion.h1>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-[3/4] rounded-2xl shimmer" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certs.map((cert: any, i: number) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl overflow-hidden bg-card border border-border/50 hover-lift group"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-muted relative">
                    <img
                      src={cert.preview_url || cert.image_url || cert.file_url}
                      alt={localizedField(cert, 'title', lang)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    {cert.file_type === 'pdf' && (
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-[10px] font-bold uppercase">PDF</span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-base font-bold text-card-foreground mb-1">{localizedField(cert, 'title', lang)}</h3>
                    {cert.issued_by && <p className="text-sm text-muted-foreground mb-4">{cert.issued_by}</p>}
                    <div className="flex gap-3">
                      {cert.is_downloadable && cert.file_url && (
                        <a href={cert.file_url} download className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline">
                          <Download size={14} /> {t('download', lang)}
                        </a>
                      )}
                      {cert.file_type === 'pdf' && cert.file_url && (
                        <a href={cert.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                          <ExternalLink size={14} />
                          {lang === 'uz' ? "Ochish" : lang === 'ru' ? "Открыть" : "Open"}
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CertificatesPage;
