import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Play, ArrowLeft, Droplets, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLang } from '@/contexts/LangContext';
import { t, localizedField, Lang } from '@/lib/i18n';
import { api } from '@/lib/api';
import MediaLightbox from '@/components/ui/MediaLightbox';

/* ── Album Card with individual cover fetching ── */
import { Album, AlbumItem } from '@/types';

const getMediaUrl = (item?: AlbumItem | null) =>
  item?.file_url || item?.url || item?.image_url || item?.thumbnail_url || null;

const getPreviewUrl = (item?: AlbumItem | null) =>
  item?.thumbnail_url || item?.image_url || item?.file_url || item?.url || null;

const AlbumCard = ({ album, lang, onClick, index }: { album: Album; lang: Lang; onClick: () => void; index: number }) => {
  const { data: albumDetail } = useQuery({
    queryKey: ['album-detail', album.id],
    queryFn: () => api.getAlbum(album.id),
    staleTime: 10 * 60 * 1000,
  });

  const coverItem = albumDetail?.items?.[0];
  const coverIsVideo = coverItem?.file_type === 'video';
  const coverImg = getPreviewUrl(coverItem) || album.cover_url || album.cover_image || null;
  const coverVideoUrl = coverIsVideo ? getMediaUrl(coverItem) : null;
  const photoCount = album.items_count || albumDetail?.items?.length || 0;

  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      onClick={onClick}
      className="group relative rounded-2xl overflow-hidden aspect-[4/3] hover-lift text-left shadow-water w-full"
    >
      {/* Full background image or gradient */}
      {coverImg || coverVideoUrl ? (
        coverIsVideo && !coverImg ? (
          <video
            src={coverVideoUrl || undefined}
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <img
            src={coverImg || coverVideoUrl || undefined}
            alt={localizedField(album, 'title', lang)}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
        )
      ) : (
        <div className="absolute inset-0 gradient-ocean flex items-center justify-center">
          <Droplets size={56} className="text-white/25" />
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Photo count badge */}
      <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5">
        <ImageIcon size={12} />
        {photoCount}
      </div>

      {coverIsVideo && (
        <div className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md">
          <Play size={16} className="ml-0.5" />
        </div>
      )}

      {/* Title */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="font-display text-lg text-white font-bold leading-snug drop-shadow-md">
          {localizedField(album, 'title', lang)}
        </h3>
      </div>
    </motion.button>
  );
};

const GalleryPage = () => {
  const { lang } = useLang();
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [lightboxItem, setLightboxItem] = useState<{ url: string; title: string; mediaType: 'image' | 'video' } | null>(null);

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
      <section className="relative flex items-center justify-center gradient-hero overflow-hidden pt-36 pb-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[500px] h-[500px] rounded-full bg-primary/8 dark:bg-primary/5 blur-[120px] top-0 right-0" style={{ animation: 'float 12s ease-in-out infinite' }} />
          <div className="absolute w-[400px] h-[400px] rounded-full bg-accent/6 dark:bg-accent/3 blur-[100px] bottom-0 left-0" style={{ animation: 'float-slow 10s ease-in-out 2s infinite' }} />
        </div>
        <div className="relative z-10 text-center container mx-auto px-4">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-black uppercase tracking-[0.35em] text-gradient-water mb-4 block"
          >
            ECO COMPANY
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-black text-gradient-premium tracking-tight"
          >
            {t('gallery_title', lang)}
          </motion.h1>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-[4/3] rounded-2xl shimmer" />)}
            </div>
          ) : !selectedAlbumId ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album: any, i: number) => (
                <AlbumCard
                  key={album.id}
                  album={album}
                  lang={lang}
                  index={i}
                  onClick={() => setSelectedAlbumId(album.id)}
                />
              ))}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <button
                onClick={() => setSelectedAlbumId(null)}
                className="mb-10 text-sm text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors font-bold bg-card px-5 py-3 rounded-xl shadow-sm border border-border"
              >
                <ArrowLeft size={16} /> {t('all', lang)}
              </button>
              <h2 className="font-display text-3xl font-black text-foreground mb-10 tracking-tight">
                {localizedField(albumDetail || {}, 'title', lang)}
              </h2>
              <div className="columns-2 md:columns-3 gap-6 space-y-6">
                {(albumDetail?.items || []).map((item: any) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="break-inside-avoid"
                  >
                    {(() => {
                      const previewUrl = getPreviewUrl(item);
                      const mediaUrl = getMediaUrl(item);
                      const isVideo = item.file_type === 'video';
                      if (!mediaUrl) return null;

                      return (
                    <button
                      onClick={() => setLightboxItem({
                        url: mediaUrl,
                        title: localizedField(albumDetail || {}, 'title', lang),
                        mediaType: isVideo ? 'video' : 'image',
                      })}
                      className="group relative rounded-2xl overflow-hidden w-full block hover-lift shadow-sm border border-border"
                    >
                      {isVideo && !previewUrl ? (
                        <video
                          src={mediaUrl}
                          muted
                          playsInline
                          preload="metadata"
                          className="w-full rounded-2xl group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <img
                          src={previewUrl || mediaUrl}
                          alt=""
                          className="w-full rounded-2xl group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      )}
                      {isVideo && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl">
                          <div className="w-14 h-14 rounded-full bg-white shadow-water flex items-center justify-center">
                            <Play size={22} className="text-primary ml-0.5" />
                          </div>
                        </div>
                      )}
                    </button>
                      );
                    })()}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <MediaLightbox
        open={!!lightboxItem}
        imageUrl={lightboxItem?.url}
        downloadUrl={lightboxItem?.url}
        mediaType={lightboxItem?.mediaType}
        title={lightboxItem?.title}
        onClose={() => setLightboxItem(null)}
      />
    </div>
  );
};

export default GalleryPage;
