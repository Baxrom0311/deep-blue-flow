import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, X } from 'lucide-react';

interface MediaLightboxProps {
  open: boolean;
  imageUrl?: string | null;
  downloadUrl?: string | null;
  mediaType?: 'image' | 'video';
  title?: string;
  onClose: () => void;
}

const MediaLightbox = ({ open, imageUrl, downloadUrl, mediaType = 'image', title, onClose }: MediaLightboxProps) => {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && imageUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-black/85 backdrop-blur-xl"
          onClick={onClose}
        >
          <div className="flex min-h-screen items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="relative w-full max-w-6xl"
              onClick={event => event.stopPropagation()}
            >
              <div className="mb-3 flex items-center justify-between gap-3 rounded-2xl bg-white/10 px-4 py-3 text-white shadow-2xl backdrop-blur-md sm:px-5">
                <div className="min-w-0">
                  {title && <p className="truncate text-sm font-semibold sm:text-base">{title}</p>}
                </div>

                <div className="flex items-center gap-2">
                  {downloadUrl && (
                    <a
                      href={downloadUrl}
                      download
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                      aria-label="Yuklab olish"
                    >
                      <Download size={20} />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                    aria-label="Yopish"
                  >
                    <X size={22} />
                  </button>
                </div>
              </div>

              <div className="overflow-hidden rounded-[2rem] bg-white/5 shadow-2xl">
                {mediaType === 'video' ? (
                  <video
                    src={imageUrl}
                    controls
                    playsInline
                    className="h-[72vh] w-full bg-black sm:h-[82vh]"
                  />
                ) : (
                  <img
                    src={imageUrl}
                    alt={title || 'Preview'}
                    className="h-[72vh] w-full object-contain bg-white/95 p-3 sm:h-[82vh] sm:p-5"
                  />
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MediaLightbox;
