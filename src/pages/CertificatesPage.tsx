import { useQuery } from '@tanstack/react-query';
import { Download, ExternalLink } from 'lucide-react';
import { useLang } from '@/contexts/LangContext';
import { t, localizedField } from '@/lib/i18n';
import { api } from '@/lib/api';
import WaveDivider from '@/components/layout/WaveDivider';

const CertificatesPage = () => {
  const { lang } = useLang();
  const { data, isLoading } = useQuery({ queryKey: ['certificates'], queryFn: api.getCertificates, staleTime: 5 * 60 * 1000 });
  const certs = Array.isArray(data) ? data : data?.items || [];

  return (
    <div className="min-h-screen">
      <section className="relative gradient-hero flex items-center justify-center" style={{ minHeight: '40vh' }}>
        <h1 className="font-display text-5xl font-light text-primary-foreground relative z-10">{t('certificates_title', lang)}</h1>
        <div className="absolute bottom-0 left-0 right-0"><WaveDivider color="hsl(var(--background))" /></div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-[3/4] rounded-2xl shimmer" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certs.map((cert: any) => (
                <div key={cert.id} className="rounded-2xl overflow-hidden bg-card shadow-water hover:shadow-water-lg transition-all group">
                  <div className="aspect-[3/4] overflow-hidden bg-water-mist relative">
                    <img
                      src={cert.preview_url || cert.image_url || cert.file_url}
                      alt={localizedField(cert, 'title', lang)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    {cert.file_type === 'pdf' && (
                      <span className="absolute top-3 right-3 px-2 py-1 rounded bg-primary text-primary-foreground text-xs font-bold">PDF</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-lg font-semibold text-card-foreground mb-1">{localizedField(cert, 'title', lang)}</h3>
                    {cert.issued_by && <p className="text-sm text-muted-foreground mb-3">{cert.issued_by}</p>}
                    <div className="flex gap-2">
                      {cert.is_downloadable && cert.file_url && (
                        <a href={cert.file_url} download className="flex items-center gap-1 text-sm text-primary hover:underline">
                          <Download size={14} /> {t('download', lang)}
                        </a>
                      )}
                      {cert.file_type === 'pdf' && cert.file_url && (
                        <a href={cert.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CertificatesPage;
