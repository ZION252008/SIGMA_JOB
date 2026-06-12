import { useRef } from 'react';

export function useTilt(intensity = 5) {
  const ref = useRef<HTMLDivElement>(null);

  return {
    ref,
    onMouseMove(e: React.MouseEvent) {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * intensity;
      const y = ((e.clientY - r.top) / r.height - 0.5) * -intensity;
      el.style.transform = `perspective(900px) rotateX(${y}deg) rotateY(${x}deg) scale3d(1.01,1.01,1.01)`;
      el.style.transition = 'transform 0.08s ease';
    },
    onMouseLeave() {
      const el = ref.current;
      if (!el) return;
      el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
      el.style.transition = 'transform 0.35s ease';
    },
  };
}
