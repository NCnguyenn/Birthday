import { useEffect, useId, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { content } from '../data/content';
import { SectionHeading, focusReading } from '../components/decor';
import Botanical from '../components/Botanical';
import { heartBurst } from '../lib/celebrate';
import useReducedMotion from '../lib/useReducedMotion';

const GIFT_ART = `${import.meta.env.BASE_URL}art/gift.webp`;

function GiftBoxArt({ opened, onOpened }: { opened: boolean; onOpened: () => void }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const reducedMotion = useReducedMotion();
  // These clips and the closed lid position are calibrated to /art/gift.webp.
  return (
    <svg viewBox="0 0 1024 1280" className="gift-art" role="img" aria-label={opened ? 'Hộp quà đang mở' : 'Hộp quà bí mật'}>
      <defs>
        <clipPath id={`${id}-base`}><rect y="640" width="1024" height="640" /></clipPath>
        <clipPath id={`${id}-lid`}><rect width="1024" height="640" /></clipPath>
        <radialGradient id={`${id}-light`}><stop stopColor="#fff9fa" stopOpacity=".9" /><stop offset="1" stopColor="#fff9fa" stopOpacity="0" /></radialGradient>
        <filter id={`${id}-shadow`} x="-30%" y="-100%" width="160%" height="300%"><feGaussianBlur stdDeviation="14" /></filter>
      </defs>
      <ellipse cx="510" cy="1210" rx="375" ry="22" fill="#502e39" opacity=".12" filter={`url(#${id}-shadow)`} />
      <image href={GIFT_ART} width="1024" height="1280" clipPath={`url(#${id}-base)`} />
      {opened && <motion.ellipse cx="530" cy="738" rx="305" ry="180" fill={`url(#${id}-light)`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reducedMotion ? 0 : .25, duration: reducedMotion ? 0 : .7 }} />}
      <motion.g initial={false} animate={opened ? { y: 30, x: -16, rotate: -3 } : { y: 305, x: 0, rotate: 0 }} transition={{ duration: reducedMotion ? 0 : 1, ease: [.22, 1, .36, 1] }} onAnimationComplete={() => { if (opened) onOpened(); }} style={{ transformOrigin: '512px 400px' }}>
        <image href={GIFT_ART} width="1024" height="1280" clipPath={`url(#${id}-lid)`} />
      </motion.g>
      {opened && <motion.g initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reducedMotion ? 0 : .4, duration: reducedMotion ? 0 : .65, ease: [.22, 1, .36, 1] }} fill="#a44360" fillOpacity=".6">
        {[{ x: 380, y: 690, size: 1 }, { x: 570, y: 650, size: 1.4 }, { x: 708, y: 700, size: .8 }].map(heart => <path key={heart.x} d="M0 9S-16-6-16-16c0-7 5-11 10-11 4 0 5 2 6 5 1-3 2-5 6-5 5 0 10 4 10 11C16-6 0 9 0 9Z" transform={`translate(${heart.x} ${heart.y}) scale(${heart.size})`} />)}
      </motion.g>}
    </svg>
  );
}

export default function SecretGift() {
  const [stage, setStage] = useState<'closed' | 'opening' | 'heart' | 'message'>('closed');
  const [artwork, setArtwork] = useState<'loading' | 'ready' | 'error'>('loading');
  const sceneRef = useRef<HTMLDivElement>(null);
  const noteMounted = useRef(false);
  const reducedMotion = useReducedMotion();
  const { gift } = content;
  const revealing = (stage === 'heart' || stage === 'message') && artwork !== 'loading';
  // Motion 11 ignores transition-only changes; key the visual layers while keeping reader focus stable.
  useEffect(() => {
    if (!reducedMotion) return;
    if (stage === 'opening') setStage('heart');
    else if (stage === 'heart' && artwork !== 'loading') setStage('message');
  }, [reducedMotion, stage, artwork]);
  const open = () => {
    if (stage !== 'closed') return;
    setStage('opening');
    sceneRef.current?.focus({ preventScroll: true });
    sceneRef.current?.scrollIntoView({ block: 'nearest', behavior: reducedMotion ? 'instant' : 'smooth' });
    heartBurst();
  };
  return (
    <section id="gift" className="chapter gift-section" aria-label="Hộp quà bí mật">
      <Botanical className="gift-botanical" />
      <div className="page-shell gift-layout">
        <SectionHeading number="04" kicker={gift.kicker} title={gift.title} />
        <div ref={sceneRef} className="gift-scene focus:outline-none" role="region" aria-label="Món quà dành cho Hai" tabIndex={-1}>
          <motion.div key={reducedMotion ? 'box-still' : 'box-motion'} className="gift-box" aria-hidden={revealing} initial={false} animate={{ opacity: revealing ? 0 : 1, scale: revealing ? .96 : 1 }} transition={{ duration: reducedMotion ? 0 : .45, ease: [.22, 1, .36, 1] }}>
            <GiftBoxArt opened={stage !== 'closed'} onOpened={() => { if (stage === 'opening') setStage('heart'); }} />
          </motion.div>
          <motion.figure key={reducedMotion ? 'hands-still' : 'hands-motion'} className="gift-hands" aria-hidden={!revealing} initial={false} animate={{ opacity: revealing ? 1 : 0, y: revealing || reducedMotion ? 0 : 18, scale: revealing || reducedMotion ? 1 : .94 }} transition={{ duration: reducedMotion ? 0 : .7, ease: [.22, 1, .36, 1] }} onAnimationComplete={() => { if (revealing && stage === 'heart') setStage('message'); }}>
            {artwork === 'error' ? <span className="gift-hands-fallback" role="img" aria-label="Hai bàn tay tạo hình trái tim">🫶</span> : <img src={`${import.meta.env.BASE_URL}art/heart-hands.webp`} alt="Hai bàn tay tạo hình trái tim" width="900" height="587" loading="eager" decoding="async" onLoad={() => setArtwork('ready')} onError={() => setArtwork('error')} />}
          </motion.figure>
          <AnimatePresence>
            {!revealing && <motion.div key="action" className="gift-action" exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : .2 }}>
              <motion.button type="button" whileTap={{ scale: .97 }} onClick={open} disabled={stage !== 'closed'} className="primary-button">
                {stage === 'closed' ? gift.button : 'Một chút bất ngờ…'}<ArrowRight className="h-4 w-4" aria-hidden="true" />
              </motion.button>
            </motion.div>}
          </AnimatePresence>
          {stage === 'message' && <p ref={node => { if (node) noteMounted.current = true; if (document.activeElement === sceneRef.current) focusReading(node); }} tabIndex={-1} className="gift-note focus:outline-none">
            <motion.span key={reducedMotion ? 'note-still' : 'note-motion'} className="gift-note-text block" initial={reducedMotion || noteMounted.current ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reducedMotion ? 0 : .16, duration: reducedMotion ? 0 : .5, ease: [.22, 1, .36, 1] }}>{gift.secretMessage}</motion.span>
          </p>}
        </div>
      </div>
    </section>
  );
}
