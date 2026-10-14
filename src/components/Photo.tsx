import { useEffect, useState, type ImgHTMLAttributes } from 'react';

export default function Photo({ src, onError, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const [attempt, setAttempt] = useState(0);
  useEffect(() => setAttempt(0), [src]);
  const imageSrc = src && attempt ? `${src}${src.includes('?') ? '&' : '?'}retry=${attempt}` : src;

  return <img {...props} src={imageSrc} onError={event => {
    if (attempt < 2) setAttempt(attempt + 1);
    onError?.(event);
  }} />;
}
