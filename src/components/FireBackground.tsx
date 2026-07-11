import { useMemo } from 'react';

export default function FireBackground() {
  const embers = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => {
        const left = Math.random() * 100;
        const duration = 6 + Math.random() * 8;
        const delay = Math.random() * 8;
        const drift = (Math.random() - 0.5) * 80;
        const size = 3 + Math.random() * 4;
        return { i, left, duration, delay, drift, size };
      }),
    [],
  );

  return (
    <div className="fire-bg" aria-hidden="true">
      {embers.map((e) => (
        <span
          key={e.i}
          className="ember"
          style={{
            left: `${e.left}%`,
            width: `${e.size}px`,
            height: `${e.size}px`,
            animationDuration: `${e.duration}s`,
            animationDelay: `${e.delay}s`,
            ['--drift' as string]: `${e.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
