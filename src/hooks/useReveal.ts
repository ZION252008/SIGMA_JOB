import { useEffect, useRef, useState, type RefObject } from 'react';

/** Build reveal classes so `in` survives React re-renders (e.g. theme toggle). */
export function revealCls(revealed: boolean, ...parts: (string | false | null | undefined)[]): string {
  return ['reveal', revealed ? 'in' : '', ...parts.filter(Boolean)].join(' ');
}

export function useReveal(): { ref: RefObject<HTMLElement | null>; revealed: boolean } {
  const [revealed, setRevealed] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || revealed) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          obs.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [revealed]);

  return { ref, revealed };
}
