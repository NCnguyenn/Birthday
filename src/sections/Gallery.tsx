import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { content } from '../data/content';
import { FadeIn, SectionHeading } from '../components/decor';
import Photo from '../components/Photo';
import useReducedMotion from '../lib/useReducedMotion';

export default function Gallery() {
  const reducedMotion = useReducedMotion();
  const [lightbox, setLightbox] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const { photos } = content.gallery;
  const isViewing = lightbox !== null;

  const close = useCallback(() => {
    dialogRef.current?.close();
    setLightbox(null);
    openerRef.current?.focus({ preventScroll: true });
  }, []);
  const step = useCallback((direction: 1 | -1) => {
    setLightbox(index => index === null ? index : (index + direction + photos.length) % photos.length);
  }, [photos.length]);

  useEffect(() => {
    if (!isViewing || !dialogRef.current) return;
    const previousOverflow = document.body.style.overflow;
    if (!dialogRef.current.open) dialogRef.current.showModal();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isViewing]);

  return (
    <section id="gallery" className="chapter gallery-section" aria-label="Album kỷ niệm">
      <SectionHeading number="02" kicker={content.gallery.kicker} title={content.gallery.title} subtitle={content.gallery.subtitle} />
      <div className="page-shell gallery-grid">
        {photos.map((photo, index) => (
          <FadeIn key={photo.src} delay={(index % 3) * 0.05}>
            <motion.button
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={(event) => { openerRef.current = event.currentTarget; setLightbox(index); }}
              aria-label={`Xem ảnh: ${photo.alt}`}
              className="photo-card"
            >
              <span className="photo-image">
                <Photo src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async" />
              </span>
              <span className="photo-caption">
                <span className="photo-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="photo-caption-text">{photo.caption}</span>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-rose" aria-hidden="true" />
              </span>
            </motion.button>
          </FadeIn>
        ))}
      </div>
      {lightbox !== null && (
        <dialog
          ref={dialogRef}
          className="photo-dialog"
          aria-label={`Ảnh ${lightbox + 1} trên ${photos.length}: ${photos[lightbox].alt}`}
          onCancel={(event) => { event.preventDefault(); close(); }}
          onClick={(event) => { if (event.target === event.currentTarget) close(); }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowRight') { event.preventDefault(); step(1); }
            if (event.key === 'ArrowLeft') { event.preventDefault(); step(-1); }
          }}
        >
          <div className="photo-dialog-inner">
            <div className="photo-dialog-header">
              <span className="eyebrow">Những khoảnh khắc của chúng mình</span>
              <button type="button" onClick={close} aria-label="Đóng" className="round-button" autoFocus><X className="h-5 w-5" aria-hidden="true" /></button>
            </div>
            <motion.figure
              key={lightbox}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={reducedMotion ? 0 : 0.12}
              dragMomentum={false}
              onDragEnd={(_, info) => {
                if (info.offset.x < -65) step(1);
                else if (info.offset.x > 65) step(-1);
              }}
            >
              <Photo src={photos[lightbox].src} alt={photos[lightbox].alt} draggable={false} />
              <figcaption className="photo-dialog-caption">{photos[lightbox].caption}</figcaption>
            </motion.figure>
            <div className="photo-dialog-controls">
              <button type="button" onClick={() => step(-1)} aria-label="Ảnh trước" className="round-button"><ChevronLeft className="h-5 w-5" aria-hidden="true" /></button>
              <span className="eyebrow" aria-live="polite">{String(lightbox + 1).padStart(2, '0')} / {photos.length}</span>
              <button type="button" onClick={() => step(1)} aria-label="Ảnh sau" className="round-button"><ChevronRight className="h-5 w-5" aria-hidden="true" /></button>
            </div>
          </div>
        </dialog>
      )}
    </section>
  );
}
