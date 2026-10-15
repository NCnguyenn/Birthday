import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Flame } from 'lucide-react';
import Cake from '../components/Cake';
import Photo from '../components/Photo';
import { celebrationBurst } from '../lib/celebrate';
import { content } from '../data/content';
import useReducedMotion from '../lib/useReducedMotion';
import Botanical, { Ribbon } from '../components/Botanical';

type Phase = 'cake' | 'blowing' | 'reveal';

export default function Intro({ onEnter }: { onEnter: () => void }) {
  const [phase, setPhase] = useState<Phase>('cake');
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    if (phase !== 'blowing') return;
    const timer = window.setTimeout(() => {
      setPhase('reveal');
      celebrationBurst();
    }, reducedMotion ? 120 : 1250);
    return () => window.clearTimeout(timer);
  }, [phase, reducedMotion]);
  const blow = () => {
    if (phase !== 'cake') return;
    setPhase('blowing');
  };

  return (
    <div className="intro-screen">
      <Botanical className="cover-botanical" />
      <Ribbon className="cover-ribbon" />
      <header className="page-shell cover-masthead">
        <span className="wordmark">A little gift.</span>
        <span className="eyebrow">Dành riêng cho<br />{content.sisterName} ♡</span>
      </header>
      <div className="page-shell cover-body">
        <AnimatePresence mode="wait">
          {phase !== 'reveal' ? (
            <motion.div key="cake" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: reducedMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }} className="cover-content">
              <p className="eyebrow text-rose">Sinh nhật của {content.sisterName}</p>
              <h1 className="cover-title">Happy<em>Birthday.</em></h1>
              <p className="cover-copy">{content.intro.line1}</p>
              <div className="cover-cake"><Cake state={phase === 'cake' ? 'lit' : 'blowing'} /></div>
              <p className="cover-hint">{content.intro.line2}</p>
              <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={blow} disabled={phase === 'blowing'} className="primary-button mt-5">
                <Flame className="h-4 w-4" aria-hidden="true" />
                {phase === 'blowing' ? 'Phùuu...' : content.intro.blowButton}
              </motion.button>
            </motion.div>
          ) : (
            <motion.div key="reveal" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }} className="cover-content cover-reveal">
              <figure className="reveal-photo">
                <Photo src={content.hero.photo.src} alt={content.hero.photo.alt} width={content.hero.photo.width} height={content.hero.photo.height} />
              </figure>
              <p className="eyebrow mb-4 text-rose">Điều ước đã được gửi đi ♡</p>
              <h1 className="reveal-title">{content.reveal.title}</h1>
              <p className="cover-copy">{content.reveal.subtitle}</p>
              <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={onEnter} className="primary-button mt-7">
                {content.reveal.enterButton}<ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <footer className="page-shell cover-bottom">Chúc {content.sisterName} tuổi mới thật nhiều niềm vui!</footer>
    </div>
  );
}
