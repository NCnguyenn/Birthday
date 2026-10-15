import { useEffect, useRef, useState } from 'react';
import { Music, Play } from 'lucide-react';
import { content } from '../data/content';

export default function MusicToggle() {
  const src = content.media.music;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pausedByUser = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    if (!src) return;
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.3;
    audio.preload = 'auto';
    audioRef.current = audio;
    setPlaying(false);
    setUnavailable(false);

    const tryPlay = () => {
      if (pausedByUser.current || audio.error || !audio.paused) return;
      void audio.play().catch(() => {});
    };

    const gestures = ['click', 'touchstart', 'touchend', 'pointerdown', 'mousedown', 'keydown', 'scroll'] as const;
    const onGesture = (event: Event) => {
      if (pausedByUser.current || audio.error) return;
      if (event.target instanceof Element && event.target.closest('.music-control')) return;
      if (event instanceof KeyboardEvent && !['Enter', ' '].includes(event.key)) return;
      tryPlay();
    };
    const removeGestures = () => gestures.forEach(type => {
      window.removeEventListener(type, onGesture, true);
      document.removeEventListener(type, onGesture, true);
    });
    const onPlay = () => {
      setPlaying(true);
      removeGestures();
    };
    const onPause = () => setPlaying(false);
    const onError = () => {
      setPlaying(false);
      setUnavailable(true);
      removeGestures();
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !pausedByUser.current) tryPlay();
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('error', onError);
    document.addEventListener('visibilitychange', onVisibilityChange);
    gestures.forEach(type => {
      window.addEventListener(type, onGesture, { capture: true, passive: true });
      document.addEventListener(type, onGesture, { capture: true, passive: true });
    });
    if (!pausedByUser.current) tryPlay();

    return () => {
      removeGestures();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('error', onError);
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      audioRef.current = null;
    };
  }, [src]);

  if (!src) return null;

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio || audio.error) return;
    if (audio.paused) {
      pausedByUser.current = false;
      void audio.play().catch(() => {});
    } else {
      pausedByUser.current = true;
      audio.pause();
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={unavailable}
      aria-label={unavailable ? 'Nhạc Happy Birthday chưa sẵn sàng' : playing ? 'Tạm dừng nhạc Happy Birthday' : 'Phát nhạc Happy Birthday'}
      aria-pressed={playing}
      className="music-control"
    >
      {playing ? <Music className="h-5 w-5 shrink-0" aria-hidden="true" /> : <Play className="h-5 w-5 shrink-0" aria-hidden="true" />}
      <span>
        <strong className="block text-xs font-semibold">Happy Birthday</strong>
        <small className="block text-[10px] opacity-70">
          {unavailable ? 'Nhạc chưa sẵn sàng' : playing ? 'Đang phát' : pausedByUser.current ? 'Đã tạm dừng' : 'Chạm để nghe'}
        </small>
      </span>
    </button>
  );
}
