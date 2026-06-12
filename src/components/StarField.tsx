import { useEffect, useRef } from 'react';

interface Star {
  x: number; y: number; r: number; o: number; speed: number;
}

export default function StarField({ dark }: { dark: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const count = dark ? 180 : 80;
    const stars: Star[] = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 0.8 + 0.2,
      o: Math.random() * 0.4 + 0.1,
      speed: Math.random() * 0.015 + 0.005,
    }));

    let frame: number;
    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        const flicker = s.o + Math.sin(t * s.speed * 100) * 0.08;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        const alpha = Math.max(0, flicker);
        ctx.fillStyle = dark
          ? `rgba(232, 232, 245, ${alpha})`
          : `rgba(91, 82, 196, ${alpha})`;
        ctx.fill();
      });
      t += 0.016;
      frame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, [dark]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: dark ? 0.7 : 0.18,
      }}
    />
  );
}
