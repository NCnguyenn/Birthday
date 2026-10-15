import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import useReducedMotion from '../lib/useReducedMotion';

export const focusReading = (node: HTMLElement | null) => {
  node?.focus({ preventScroll: true });
};

export function SectionHeading({ kicker, title, subtitle, number }: {
  kicker: string;
  title: ReactNode;
  subtitle?: string;
  number: string;
}) {
  return (
    <FadeIn className="page-shell section-heading">
      <div className="section-meta">
        <span className="section-number">{number}</span>
        <p className="eyebrow">{kicker}</p>
        <span className="section-rule" aria-hidden="true" />
      </div>
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </FadeIn>
  );
}

export function FadeIn({ children, delay = 0, className = '', y = 32 }: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.12 }}
      transition={{ duration: reducedMotion ? 0 : 0.65, delay: reducedMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
