import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Eye, Play, X } from 'lucide-react';
import { useLang } from '@/contexts/LangContext';
import { t, localizedField } from '@/lib/i18n';
import { api } from '@/lib/api';
import WaveDivider from '@/components/layout/WaveDivider';

const GalleryPage = () => {
  const { lang } = useLang();
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const { data: albumsData, isLoading } = useQuery({ queryKey: ['albums'], queryFn: () => api.getAlbums(), staleTime: 5 * 60 * 1000 });
  const albums = Array.isArray(albumsData) ? albumsData : albumsData?.items || [];

  const { data: albumDetail } = useQuery({
    queryKey: ['album', selectedAlbumId],
    queryFn: () => api.getAlbum(selectedAlbumId!),
    enabled: !!selectedAlbumId,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="min-h-screen">
      <section className="relative gradient-hero flex items-center justify-center" style={{ minHeight: '40vh' }}>
        <h1 className="font-display text-5xl font-light text-primary-foreground relative z-10">{t('gallery_title', lang)}</h1>
        <div className="absolute bottom-0 left-0 right-0"><WaveDivider color="hsl(var(--background))" /></div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-video rounded-2xl shimmer" />)}
            </div>
          ) : !selectedAlbumId ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album: any) => (
                <button
                  key={album.id}
                  onClick={() => setSelectedAlbumId(album.id)}
                  className="group relative rounded-2xl overflow-hidden aspect-video bg-water-mist shadow-water hover:shadow-water-lg transition-all"
                >
                  <img
                    src={album.cover_url || album.cover_image}
                    alt={localizedField(album, 'title', lang)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-water-deep/40 group-hover:bg-water-deep/60 transition-colors flex items-center justify-center">
                    <div className="text-center">
                      <Eye size={28} className="mx-auto mb-2 text-primary-foreground" />
                      <h3 className="font-display text-xl text-primary-foreground font-semibold">{localizedField(album, 'title', lang)}</h3>
                      {album.items_count && <p className="text-primary-foreground/70 text-sm mt-1">{album.items_count} items</p>}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div>
              <button onClick={() => setSelectedAlbumId(null)} className="mb-6 text-primary hover:underline flex items-center gap-1">
                ← {t('all', lang)}
              </button>
              <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
                {localizedField(albumDetail || {}, 'title', lang)}
              </h2>
              <div className="columns-2 md:columns-3 gap-4 space-y-4">
                {(albumDetail?.items || []).map((item: any) => (
                  <div key={item.id} className="break-inside-avoid">
                    <button
                      onClick={() => item.media_type !== 'video' && setLightboxUrl(item.url || item.image_url)}
                      className="group relative rounded-xl overflow-hidden w-full block"
                    >
                      <img
                        src={item.thumbnail_url || item.url || item.image_url}
                        alt=""
                        className="w-full rounded-xl group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      {item.media_type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-foreground/20">
                          <Play size={36} className="text-primary-foreground" />
                        </div>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxUrl && (
        <div className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4" onClick={() => setLightboxUrl(null)}>
          <button className="absolute top-4 right-4 text-primary-foreground" onClick={() => setLightboxUrl(null)}>
            <X size={28} />
          </button>
          <img src={lightboxUrl} alt="" className="max-w-full max-h-[90vh] rounded-2xl" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
