import { useState } from 'react';
import { motion, MotionConfig } from 'motion/react';
import Intro from './sections/Intro';
import Hero from './sections/Hero';
import Letter from './sections/Letter';
import Gallery from './sections/Gallery';
import Wishes from './sections/Wishes';
import SecretGift from './sections/SecretGift';
import Finale from './sections/Finale';
import MusicToggle from './components/MusicToggle';
import { content } from './data/content';
import useReducedMotion from './lib/useReducedMotion';

export default function App() {
  const [entered, setEntered] = useState(false);
  const reducedMotion = useReducedMotion();
  const replay = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setEntered(false);
  };

  // Motion 11 snapshots its policy at mount; the shared media hook keeps durations live.
  return (
    <MotionConfig reducedMotion="never" transition={{ duration: reducedMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1], scale: { duration: reducedMotion ? 0 : 0.16 } }}>
      <div className={`birthday-app min-h-dvh${entered ? ' is-entered' : ''}`}>
          {!entered ? (
            <Intro onEnter={() => setEntered(true)} />
          ) : (
            <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <header className="site-header">
                <div className="page-shell site-header-inner">
                  <a href="#home" className="wordmark" aria-label="Về đầu trang">A little gift.</a>
                  <span className="eyebrow text-mauve-soft md:hidden">Từ em, với yêu thương ♡</span>
                  <nav className="site-nav" aria-label="Các phần của món quà">
                    <a href="#letter">Lá thư</a>
                    <a href="#gallery">Kỷ niệm</a>
                    <a href="#wishes">Lời chúc</a>
                    <a href="#gift">Món quà</a>
                  </nav>
                </div>
              </header>
              <main>
                <Hero />
                <Letter />
                <Gallery />
                <Wishes />
                <SecretGift />
                <Finale onReplay={replay} />
              </main>
              <footer className="site-footer"><div className="page-shell site-footer-inner"><a href="#home" className="wordmark">A little gift.</a><span>{content.footer}</span></div></footer>
            </motion.div>
          )}
        <MusicToggle />
      </div>
    </MotionConfig>
  );
}
