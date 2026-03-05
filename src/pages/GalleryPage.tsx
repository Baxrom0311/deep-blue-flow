import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Eye, Play, X, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/contexts/LangContext';
import { t, localizedField } from '@/lib/i18n';
import { api } from '@/lib/api';

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
      {/* Hero */}
      <section className="relative gradient-hero flex items-center justify-center" style={{ minHeight: '45vh' }}>
        <div className="absolute w-[400px] h-[400px] rounded-full bg-white/5 blur-[100px] top-0 right-0" />
        <div className="relative z-10 text-center container mx-auto px-4">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50 mb-3 block"
          >
            ECO COMPANY
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-6xl font-bold text-white"
          >
            {t('gallery_title', lang)}
          </motion.h1>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-video rounded-2xl shimmer" />)}
            </div>
          ) : !selectedAlbumId ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album: any, i: number) => (
                <motion.button
                  key={album.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedAlbumId(album.id)}
                  className="group relative rounded-2xl overflow-hidden aspect-video bg-muted hover-lift text-left"
                >
                  <img
                    src={album.cover_url || album.cover_image}
                    alt={localizedField(album, 'title', lang)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="font-display text-lg text-white font-bold">{localizedField(album, 'title', lang)}</h3>
                    {album.items_count && (
                      <p className="text-white/60 text-sm mt-1">{album.items_count} {lang === 'uz' ? 'ta rasm' : lang === 'ru' ? 'фото' : 'photos'}</p>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <button
                onClick={() => setSelectedAlbumId(null)}
                className="mb-8 text-sm text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors font-medium"
              >
                <ArrowLeft size={16} /> {t('all', lang)}
              </button>
              <h2 className="font-display text-2xl font-bold text-foreground mb-8">
                {localizedField(albumDetail || {}, 'title', lang)}
              </h2>
              <div className="columns-2 md:columns-3 gap-4 space-y-4">
                {(albumDetail?.items || []).map((item: any) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="break-inside-avoid"
                  >
                    <button
                      onClick={() => item.media_type !== 'video' && setLightboxUrl(item.url || item.image_url)}
                      className="group relative rounded-xl overflow-hidden w-full block hover-lift"
                    >
                      <img
                        src={item.thumbnail_url || item.url || item.image_url}
                        alt=""
                        className="w-full rounded-xl group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      {item.media_type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-foreground/20 rounded-xl">
                          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                            <Play size={20} className="text-foreground ml-0.5" />
                          </div>
                        </div>
                      )}
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setLightboxUrl(null)}
          >
            <button className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors" onClick={() => setLightboxUrl(null)}>
              <X size={24} />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={lightboxUrl}
              alt=""
              className="max-w-full max-h-[90vh] rounded-2xl"
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage;
