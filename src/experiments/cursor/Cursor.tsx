import { useEffect, useRef } from 'react';
import { finePointer, reducedMotion } from '../_shared/env';
import type { VariantProps } from '../types';
import './cursor.css';

const INTERACTIVE = 'a, button, input, textarea, select, label, [role="button"], [data-fx-card], [tabindex]:not([tabindex="-1"])';

export default function Cursor({ variant }: VariantProps) {
  const a = useRef<HTMLDivElement>(null);
  const b = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!finePointer()) return;
    const hides = variant === 'dot-ring' || variant === 'blend';
    if (hides) document.documentElement.classList.add('fx-cursor-none');
    let x = innerWidth / 2;
    let y = innerHeight / 2;
    let rx = x;
    let ry = y;
    let hovering = false;
    let down = false;
    let visible = false;
    const pts: { x: number; y: number; t: number }[] = [];
    const ctx = canvas.current?.getContext('2d');
    const resize = () => {
      if (canvas.current) {
        canvas.current.width = innerWidth * devicePixelRatio;
        canvas.current.height = innerHeight * devicePixelRatio;
      }
    };
    resize();

    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      visible = true;
      hovering = !!(e.target as Element).closest?.(INTERACTIVE);
      if (variant === 'trail') pts.push({ x, y, t: performance.now() });
    };
    const leave = () => (visible = false);
    const pd = () => (down = true);
    const pu = () => (down = false);
    const ease = reducedMotion() ? 1 : 0.18;

    let raf = 0;
    const loop = () => {
      rx += (x - rx) * ease;
      ry += (y - ry) * ease;
      const A = a.current;
      const B = b.current;
      if (variant === 'dot-ring' && A && B) {
        A.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${down ? 0.6 : hovering ? 0 : 1})`;
        B.style.transform = `translate3d(${rx}px, ${ry}px, 0) scale(${hovering ? 1.8 : down ? 0.8 : 1})`;
        B.dataset.hover = String(hovering);
      }
      if (variant === 'blend' && A) {
        A.style.transform = `translate3d(${rx}px, ${ry}px, 0) scale(${hovering ? 2.2 : down ? 0.7 : 1})`;
      }
      if (variant === 'spotlight' && A) {
        A.style.setProperty('--x', `${rx}px`);
        A.style.setProperty('--y', `${ry}px`);
      }
      if (A) A.style.opacity = visible ? '1' : '0';
      if (B) B.style.opacity = visible ? '1' : '0';
      if (variant === 'trail' && ctx && canvas.current) {
        const now = performance.now();
        while (pts.length && now - pts[0].t > 500) pts.shift();
        ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        const color = getComputedStyle(document.documentElement).getPropertyValue('--fg').trim() || '#000';
        ctx.strokeStyle = color;
        ctx.lineCap = 'round';
        for (let i = 1; i < pts.length; i++) {
          const life = 1 - (now - pts[i].t) / 500;
          ctx.globalAlpha = life * 0.5;
          ctx.lineWidth = life * 6;
          ctx.beginPath();
          ctx.moveTo(pts[i - 1].x, pts[i - 1].y);
          ctx.lineTo(pts[i].x, pts[i].y);
          ctx.stroke();
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    window.addEventListener('pointerdown', pd);
    window.addEventListener('pointerup', pu);
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('fx-cursor-none');
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
      window.removeEventListener('pointerdown', pd);
      window.removeEventListener('pointerup', pu);
      window.removeEventListener('resize', resize);
    };
  }, [variant]);

  if (typeof window !== 'undefined' && !finePointer()) return null;
  if (variant === 'trail') return <canvas ref={canvas} className="fx-trail" aria-hidden="true" />;
  if (variant === 'spotlight') return <div ref={a} className="fx-spotlight" aria-hidden="true" />;
  if (variant === 'blend') return <div ref={a} className="fx-blend" aria-hidden="true" />;
  return (
    <>
      <div ref={b} className="fx-ring" aria-hidden="true" />
      <div ref={a} className="fx-dot" aria-hidden="true" />
    </>
  );
}
