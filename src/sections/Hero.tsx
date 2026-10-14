import { motion } from 'motion/react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { content } from '../data/content';
import { FadeIn } from '../components/decor';
import Photo from '../components/Photo';
import Botanical, { Ribbon } from '../components/Botanical';
import Cake from '../components/Cake';
import useReducedMotion from '../lib/useReducedMotion';

export default function Hero() {
  const reducedMotion = useReducedMotion();
  const scrollNext = () => {
    document.getElementById('gallery')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  };
  return (
    <section id="home" className="hero-section" aria-label="Chào mừng">
      <Botanical className="hero-botanical" />
      <div className="page-shell hero-layout">
        <FadeIn className="hero-introduction">
          <p className="eyebrow text-rose">Dành cho người chị tuyệt vời nhất</p>
          <h1 className="hero-title" aria-label={content.hero.title}>
            Happy<br />Birthday,
            <span><em>{content.sisterName}.</em><span className="hero-heart" aria-hidden="true">♡</span></span>
          </h1>
          <p className="hero-subtitle">{content.hero.subtitle}</p>
          <p className="hero-copy">{content.hero.body}</p>
          <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={scrollNext} className="primary-button mt-7">
            {content.hero.button}<ArrowRight className="h-4 w-4" aria-hidden="true" />
          </motion.button>
        </FadeIn>
        <FadeIn delay={0.12} className="hero-photos">
          <figure className="hero-photo">
            <Photo src={content.hero.photo.src} alt={content.hero.photo.alt} width={content.hero.photo.width} height={content.hero.photo.height} loading="eager" fetchPriority="high" />
            <figcaption>{content.hero.photo.caption}<span className="eyebrow font-body not-italic">With love</span></figcaption>
          </figure>
        </FadeIn>
        <div className="hero-cake" aria-hidden="true"><Cake state="lit" /></div>
      </div>
      <Ribbon className="hero-ribbon" />
      <div className="page-shell hero-endnote">
        <span>MỘT CHÚT KỶ NIỆM, MỘT CHÚT YÊU THƯƠNG</span><ArrowDown className="h-4 w-4 shrink-0 text-rose" aria-hidden="true" />
      </div>
    </section>
  );
}
