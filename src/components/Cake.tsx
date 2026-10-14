import { useId } from 'react';

// Match the photographed wicks; recalibrate if the cake artwork changes.
const WICKS = [{ x: 397, y: 151 }, { x: 513, y: 151 }, { x: 628, y: 151 }];

export default function Cake({ state }: { state: 'lit' | 'blowing' | 'out' }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <div className="cake-art" role="img" aria-label={state === 'lit' ? 'Bánh sinh nhật với ba ngọn nến đang cháy' : 'Bánh sinh nhật với nến đã được thổi tắt'}>
      <img src="/art/cake.webp" alt="" width={1024} height={1024} decoding="async" />
      <svg viewBox="0 0 1024 1024" className="cake-flames" aria-hidden="true">
        <defs>
          <radialGradient id={`${id}-glow`}><stop stopColor="#ffc36c" stopOpacity=".5" /><stop offset="1" stopColor="#ffc36c" stopOpacity="0" /></radialGradient>
          <linearGradient id={`${id}-flame`} x2="0" y2="1"><stop stopColor="#f5a33c" /><stop offset=".55" stopColor="#ffdb82" /><stop offset="1" stopColor="#f2ac55" /></linearGradient>
        </defs>
        {WICKS.map((wick, i) => <g key={wick.x}>
          {state !== 'out' && <g className={`flame ${state === 'blowing' ? 'blowing' : ''}`} style={{ animationDelay: state === 'lit' ? `${i * .3}s` : `${i * .08}s` }}>
            <ellipse cx={wick.x} cy={wick.y - 23} rx="42" ry="52" fill={`url(#${id}-glow)`} />
            <path d={`M${wick.x + 1} ${wick.y - 51}c-6 15-15 23-13 34 1 16 24 16 25 0 1-11-9-22-12-34Z`} fill={`url(#${id}-flame)`} />
            <ellipse cx={wick.x} cy={wick.y - 13} rx="5" ry="10" fill="#fff8db" />
          </g>}
          {state !== 'lit' && <path className="candle-smoke" style={{ animationDelay: `${.25 + i * .08}s` }} d={`M${wick.x} ${wick.y}c-17-20 17-31 1-48s12-28 3-44`} fill="none" stroke="#998b8d" strokeWidth="2.5" strokeLinecap="round" />}
        </g>)}
      </svg>
    </div>
  );
}
