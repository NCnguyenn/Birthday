import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { content } from '../data/content';
import { FadeIn } from '../components/decor';
import Botanical from '../components/Botanical';
import { heartBurst } from '../lib/celebrate';
import useReducedMotion from '../lib/useReducedMotion';

function HugScene({ hugging }: { hugging: boolean }) {
  const reducedMotion = useReducedMotion();
  return (
    <div className="finale-embrace">
      <Botanical kind="heart" />
      <svg viewBox="0 0 280 150" className="hug-scene" role="img" aria-label="Hai trái tim ôm nhau" fill="none" stroke="#a44360" strokeWidth="1.2">
        <motion.g initial={false} animate={{ x: hugging ? 36 : 0, rotate: hugging ? 0 : -8 }} transition={{ duration: reducedMotion ? 0 : .9, ease: [.22, 1, .36, 1] }} style={{ transformOrigin: '85px 65px' }}>
          <path d="M85 100S57 80 57 58c0-12 10-20 19-20 7 0 8 4 9 8 1-4 2-8 9-8 9 0 19 8 19 20 0 22-28 42-28 42Z" />
        </motion.g>
        <motion.g initial={false} animate={{ x: hugging ? -36 : 0, rotate: hugging ? 0 : 8 }} transition={{ duration: reducedMotion ? 0 : .9, ease: [.22, 1, .36, 1] }} style={{ transformOrigin: '195px 65px' }}>
          <path d="M195 100s-28-20-28-42c0-12 10-20 19-20 7 0 8 4 9 8 1-4 2-8 9-8 9 0 19 8 19 20 0 22-28 42-28 42Z" />
        </motion.g>
        {hugging && <motion.g data-hug-heart initial={{ opacity: 0, scale: .5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: reducedMotion ? 0 : .3, duration: reducedMotion ? 0 : .65, ease: [.22, 1, .36, 1] }}>
          <path d="M140 90s-14-10-14-21c0-6 5-10 10-10 3 0 3.5 2 4 4 .5-2 1-4 4-4 5 0 10 4 10 10 0 11-14 21-14 21Z" fill="#f0cbd4" />
        </motion.g>}
      </svg>
    </div>
  );
}

export default function Finale({ onReplay }: { onReplay: () => void }) {
  const [hugging, setHugging] = useState(false);
  const { finale } = content;
  const hug = () => {
    if (hugging) return;
    setHugging(true);
    heartBurst();
  };
  return (
    <section className="chapter finale-section" aria-label="Lời nhắn cuối">
      <Botanical kind="sprig" className="finale-botanical finale-botanical-left" />
      <Botanical kind="sprig" className="finale-botanical finale-botanical-right" />
      <div className="page-shell">
        <FadeIn>
          <HugScene hugging={hugging} />
          <p className="eyebrow text-rose">05 / Happy Birthday, {content.sisterName}!</p>
          <p className="finale-copy">{finale.line1}</p>
          <h2 className="finale-title">{finale.line2}</h2>
          <p className="font-display mt-3 text-xl italic text-rose">{finale.line3}</p>
        </FadeIn>
        <AnimatePresence mode="wait">
          {!hugging ? <motion.button key="hug" type="button" exit={{ opacity: 0 }} whileTap={{ scale: .97 }} onClick={hug} className="primary-button button-outline mt-6">
            {finale.hugButton}<ArrowRight className="h-4 w-4" aria-hidden="true" />
          </motion.button> : <motion.p key="message" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hug-message">{finale.hugMessage}</motion.p>}
        </AnimatePresence>
        <div><button type="button" onClick={onReplay} className="replay-button"><RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />{finale.replayButton}</button></div>
      </div>
    </section>
  );
}
