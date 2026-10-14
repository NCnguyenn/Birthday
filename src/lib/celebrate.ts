import confetti from 'canvas-confetti';

const COLORS = ['#F7E8EB', '#F0CBD4', '#A44360', '#502E39', '#FFF9FA'];

export function celebrationBurst() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  confetti({
    particleCount: 42,
    spread: 75,
    startVelocity: 24,
    scalar: 0.75,
    ticks: 130,
    origin: { y: 0.6 },
    colors: COLORS,
    disableForReducedMotion: true,
  });
}

export function popAt(el: HTMLElement, particleCount = 32) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const r = el.getBoundingClientRect();
  confetti({
    particleCount,
    startVelocity: 28,
    spread: 65,
    ticks: 130,
    scalar: 0.9,
    origin: {
      x: (r.left + r.width / 2) / window.innerWidth,
      y: (r.top + r.height / 2) / window.innerHeight,
    },
    colors: COLORS,
    disableForReducedMotion: true,
  });
}

export function heartBurst() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  try {
    const heart = confetti.shapeFromPath({ path: 'M10 18C7 15 0 11 0 6C0 0 7-2 10 3C13-2 20 0 20 6C20 11 13 15 10 18Z' });
    confetti({
      particleCount: 16,
      spread: 65,
      startVelocity: 20,
      scalar: 0.9,
      ticks: 110,
      shapes: [heart],
      colors: COLORS,
      origin: { y: 0.65 },
      disableForReducedMotion: true,
    });
  } catch {
    popAt(document.body);
  }
}
