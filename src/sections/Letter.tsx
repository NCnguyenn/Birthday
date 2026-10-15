import { useEffect, useId, useRef, useState } from 'react';
import { ArrowRight, Heart } from 'lucide-react';
import { content } from '../data/content';
import { SectionHeading, FadeIn, focusReading } from '../components/decor';
import Botanical from '../components/Botanical';
import useReducedMotion from '../lib/useReducedMotion';

const ENVELOPE_ART = `${import.meta.env.BASE_URL}art/letter-envelope.webp`;

export default function Letter() {
  const [opened, setOpened] = useState(false);
  const [readable, setReadable] = useState(false);
  const sceneRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLElement>(null);
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const reducedMotion = useReducedMotion();
  const { letter } = content;

  useEffect(() => {
    if (opened && reducedMotion) setReadable(true);
  }, [opened, reducedMotion]);

  useEffect(() => {
    if (!readable || document.activeElement !== sceneRef.current) return;
    focusReading(paperRef.current);
    paperRef.current?.scrollIntoView({ block: 'nearest', behavior: reducedMotion ? 'instant' : 'smooth' });
  }, [readable, reducedMotion]);

  const open = () => {
    if (opened) return;
    sceneRef.current?.focus({ preventScroll: true });
    setOpened(true);
  };

  return (
    <section id="letter" className="chapter letter-section" aria-label="Lá thư gửi Chị 2">
      <SectionHeading number="01" kicker={letter.kicker} title={letter.title} />
      <div className="page-shell">
        <FadeIn delay={0.1} y={35}>
          <div ref={sceneRef} className={`letter-scene focus:outline-none${opened ? ' is-open' : ''}${readable ? ' is-readable' : ''}`} tabIndex={-1}>
            <Botanical kind="sprig" className="letter-botanical" />
            <div className="envelope-body">
              <div className="envelope-back" aria-hidden="true" />
              <div className="envelope-flap" aria-hidden="true">
                {/* Crops and the seal mask are calibrated to the two-part 1024×1536 sprite. */}
                <svg viewBox="68 118 890 485" preserveAspectRatio="none">
                  <defs><clipPath id={`${id}-flap`}><polygon points="73 124 953 124 513 553" /><circle cx="513" cy="519" r="77" /></clipPath></defs>
                  <image href={ENVELOPE_ART} width="1024" height="1536" clipPath={`url(#${id}-flap)`} />
                </svg>
              </div>
              <div className="envelope-paper-slot">
                <article ref={paperRef} id={`${id}-paper`} className="letter-paper focus:outline-none" aria-label="Nội dung lá thư gửi Chị 2" aria-hidden={!readable} inert={!readable} tabIndex={readable ? -1 : undefined} onTransitionEnd={event => {
                  if (opened && event.target === event.currentTarget && event.propertyName === 'transform') setReadable(true);
                }}>
                  <Heart className="letter-paper-heart" aria-hidden="true" />
                  <p className="letter-greeting">{letter.greeting}</p>
                  <h3>{letter.birthday}</h3>
                  {letter.paragraphs.map(paragraph => <p className="letter-paragraph" key={paragraph}>{paragraph}</p>)}
                  <p className="letter-sign">{letter.sign}<br /><span>{letter.signName}</span></p>
                </article>
              </div>
              <div className="envelope-front" aria-hidden="true"><svg viewBox="64 864 910 537" preserveAspectRatio="none"><image href={ENVELOPE_ART} width="1024" height="1536" /></svg></div>
            </div>
            {!readable && <button type="button" onClick={open} disabled={opened} aria-label="Mở lá thư gửi Chị 2" aria-expanded={opened} aria-controls={`${id}-paper`} className="letter-open">
              <span className="primary-button button-outline letter-open-label">{opened ? 'Đang mở thư…' : 'Mở lá thư ♡'}<ArrowRight className="h-4 w-4" aria-hidden="true" /></span>
            </button>}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
