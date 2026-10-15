import { useState } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, ArrowRight } from 'lucide-react';
import { content } from '../data/content';
import { FadeIn, SectionHeading } from '../components/decor';
import useReducedMotion from '../lib/useReducedMotion';
import Botanical from '../components/Botanical';

const MOTIFS = ['sprig', 'flower', 'lily', 'branch'] as const;

export default function Wishes() {
  const reducedMotion = useReducedMotion();
  const [flipped, setFlipped] = useState<boolean[]>(content.wishes.cards.map(() => false));
  const toggle = (index: number) => {
    setFlipped(values => values.map((value, i) => i === index ? !value : value));
  };
  return (
    <section id="wishes" className="chapter wishes-section" aria-label="Những điều ước">
      <SectionHeading number="03" kicker={content.wishes.kicker} title={content.wishes.title} subtitle={content.wishes.subtitle} />
      <div className="page-shell wish-grid">
        {content.wishes.cards.map((card, index) => {
          const isOpen = flipped[index];
          return (
            <FadeIn key={card.front} delay={index * 0.05}>
              <button type="button" onClick={() => toggle(index)} aria-label={`${isOpen ? 'Đóng' : 'Mở'} thiệp: ${card.front}`} aria-pressed={isOpen} className="wish-card">
                <motion.span key={reducedMotion ? 'still' : 'motion'} className="flip-inner relative block h-full w-full" initial={false} animate={{ rotateY: isOpen ? 180 : 0 }} transition={{ duration: reducedMotion ? 0 : 0.75, ease: [0.22, 1, 0.36, 1] }}>
                  <span className="flip-face wish-face wish-front" aria-hidden={isOpen}>
                    <span className="wish-card-top"><span className="wish-card-number">{String(index + 1).padStart(2, '0')}</span><span>Gửi {content.sisterName}</span></span>
                    <span className="wish-emblem"><Botanical kind={MOTIFS[index]} className="wish-botanical" /></span>
                    <span className="wish-card-title">{card.front}</span>
                    <span className="wish-card-hint">Mở lời chúc <span className="wish-card-arrow"><ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></span></span>
                  </span>
                  <span className="flip-face wish-face wish-back" aria-hidden={!isOpen}>
                    <Botanical kind={MOTIFS[index]} className="wish-back-botanical" />
                    <span className="wish-back-label">Gửi {content.sisterName} / {String(index + 1).padStart(2, '0')}</span>
                    <span className="wish-back-title">{card.backTitle}</span>
                    <span className="wish-back-copy">{card.back}</span>
                    <span className="wish-back-hint"><RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />Chạm để úp lại</span>
                  </span>
                </motion.span>
              </button>
            </FadeIn>
          );
        })}
      </div>
    </section>
  );
}
