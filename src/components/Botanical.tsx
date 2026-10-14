import { useId } from 'react';

type Motif = 'branch' | 'flower' | 'sprig' | 'lily' | 'heart';

function Blossom({ x, y, size = 1 }: { x: number; y: number; size?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size})`}>
      {[0, 72, 144, 216, 288].map(angle => <path key={angle} transform={`rotate(${angle})`} d="M0 2C-13-2-18-15-10-20C-4-24 5-16 3-8C10-18 17-14 14-7C12 0 4 3 0 2Z" fill="#f1c4d1" fillOpacity=".38" />)}
      <path d="M-3-3l5 5M2-5l-2 5M-5 1l6-2" strokeWidth="1.1" />
      <circle r="2.5" fill="currentColor" fillOpacity=".4" stroke="none" />
    </g>
  );
}

export default function Botanical({ kind = 'branch', className = '' }: { kind?: Motif; className?: string }) {
  if (kind === 'heart') return (
    <svg viewBox="0 0 240 150" className={`botanical ${className}`} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth=".9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M119 120C103 100 33 61 49 29C64-1 106 19 120 39C135 15 170-1 190 25C214 58 144 100 119 120Z" />
      <path d="M55 48c-20-10-34-9-45-13M64 73C43 66 29 68 17 79M181 44c17-9 29-9 45-15M170 79c17-5 31-2 45 10" />
      <path d="M36 40c-2-17-12-21-12-21s-3 13 12 21ZM39 69c-13-6-24-2-24-2s7 9 24 2ZM199 35c2-14 12-19 12-19s2 12-12 19ZM195 81c16-2 26 5 26 5s-13 7-26-5Z" fill="#f1c4d1" fillOpacity=".22" />
      <Blossom x={54} y={47} size={.5} /><Blossom x={78} y={93} size={.4} /><Blossom x={184} y={46} size={.6} /><Blossom x={163} y={91} size={.4} />
    </svg>
  );
  return (
    <svg viewBox="0 0 200 240" className={`botanical ${className}`} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth=".85" strokeLinecap="round" strokeLinejoin="round">
      {kind === 'flower' ? <>
        <path d="M99 225C91 173 121 149 104 95M104 180C82 165 62 157 57 135M104 159c20-20 31-29 36-51" />
        <path d="M105 176c-17-30-35-32-35-32s-4 25 35 32ZM104 164c35-17 37-42 37-42s-27 7-37 42Z" fill="#f1c4d1" fillOpacity=".12" />
        <g transform="translate(103 90)">
          {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => <path key={angle} transform={`rotate(${angle})`} d="M0 0C-14-9-33-11-32-28C-24-39-9-20-4-8C-4-25 4-39 13-30C24-18 10-6 0 0Z" fill="#f1c4d1" fillOpacity=".16" />)}
          <Blossom x={0} y={0} size={.8} />
        </g>
        <Blossom x={55} y={131} size={.38} /><Blossom x={142} y={105} size={.35} />
      </> : kind === 'lily' ? <>
        <path d="M92 225c14-80 17-111-6-147M93 226c-29-33-43-83-37-123c29 40 42 89 37 123ZM95 226c3-59 37-101 55-123c-6 59-35 97-55 123Z" />
        <path d="M98 141c25-19 27-53 15-76M107 109c20-7 28-19 25-38M86 77c-3-15-18-14-19 1c0 8 6 15 10 14c3-1 7-5 9-15ZM114 66c-4-15-17-13-18 1c0 8 7 14 10 13c4-1 7-6 8-14ZM133 74c3-15 17-15 20-2c2 8-3 17-6 17c-4 0-10-6-14-15Z" fill="#f1c4d1" fillOpacity=".2" />
        <path d="M63 117c4 23 17 66 29 91M142 119c-15 32-33 60-43 91" />
      </> : <>
        <path d="M110 228C115 173 84 115 97 41M102 192C71 172 60 151 49 112M106 158c25-27 39-65 42-103" />
        <path d="M99 108C76 86 64 68 65 43M91 149c-17-3-29-16-29-16s17-3 29 16ZM105 184c22-8 31-28 31-28s-24 6-31 28ZM98 132c22-11 24-33 24-33s-25 7-24 33ZM73 162c-20 1-34-11-34-11s21-8 34 11ZM132 107c19-6 24-23 24-23s-21 3-24 23Z" fill="#f1c4d1" fillOpacity=".16" />
        {kind === 'sprig' ? <>
          <path d="M78 179c-29-12-42-23-48-45M129 130c27-5 38-20 40-41M94 79c19-16 22-33 16-49" />
          {[[49, 111], [65, 42], [97, 40], [148, 56], [32, 134], [167, 89], [110, 28], [131, 130]].map(([x, y], i) => <Blossom key={i} x={x} y={y} size={.3} />)}
        </> : <>
          <Blossom x={49} y={109} size={.58} /><Blossom x={64} y={42} size={.48} /><Blossom x={98} y={39} size={.65} /><Blossom x={148} y={55} size={.58} /><Blossom x={82} y={176} size={.28} />
        </>}
      </>}
    </svg>
  );
}

export function Ribbon({ className = '' }: { className?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <svg viewBox="0 0 1200 180" preserveAspectRatio="none" className={`ribbon ${className}`} aria-hidden="true">
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#f2b8cb" /><stop offset=".35" stopColor="#dfa0b6" /><stop offset=".75" stopColor="#bd718d" /><stop offset="1" stopColor="#f6c6d5" /></linearGradient></defs>
      <path d="M-40 23C24 4 63 21 63 76C63 134 114 150 184 120C325 58 418 63 554 121C689 179 810 178 956 110C1064 60 1153 57 1240 90L1240 108C1153 75 1067 76 960 128C813 198 680 194 546 140C411 81 324 77 191 137C112 173 35 160 40 103C44 49 6 37-40 43Z" fill={`url(#${id})`} opacity=".8" />
      <path d="M-40 23C24 4 63 21 63 76C63 134 114 150 184 120C325 58 418 63 554 121C689 179 810 178 956 110C1064 60 1153 57 1240 90" fill="none" stroke="#fff4f8" strokeOpacity=".7" strokeWidth="1.5" />
    </svg>
  );
}
