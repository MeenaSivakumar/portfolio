import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useJourney } from '../../shared/journeyBus';
import type { VariantProps } from '../types';
import './nav-feedback.css';

export default function NavFeedback({ variant }: VariantProps) {
  const [group, setGroup] = useState<HTMLElement | null>(null);
  const [hovered, setHovered] = useState<HTMLElement | null>(null);
  const [rect, setRect] = useState<{ x: number; w: number; h: number; y: number } | null>(null);
  const chapter = useJourney((s) => s.chapter);

  useEffect(() => {
    const g = document.querySelector<HTMLElement>('[data-fx-nav-group]');
    setGroup(g);
    if (!g) return;
    document.documentElement.setAttribute('data-fx-nav-indicator', variant);
    const over = (e: Event) => setHovered((e.target as Element).closest('[data-fx-nav]') as HTMLElement | null);
    const out = () => setHovered(null);
    g.addEventListener('pointerover', over);
    g.addEventListener('pointerleave', out);
    g.addEventListener('focusin', over);
    g.addEventListener('focusout', out);
    return () => {
      document.documentElement.removeAttribute('data-fx-nav-indicator');
      g.removeEventListener('pointerover', over);
      g.removeEventListener('pointerleave', out);
      g.removeEventListener('focusin', over);
      g.removeEventListener('focusout', out);
    };
  }, [variant]);

  useEffect(() => {
    if (!group) return;
    const measure = () => {
      const target = hovered ?? group.querySelector<HTMLElement>('[data-fx-nav][aria-current]');
      if (!target) return setRect(null);
      const g = group.getBoundingClientRect();
      const r = target.getBoundingClientRect();
      setRect({ x: r.left - g.left, y: r.top - g.top, w: r.width, h: r.height });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [group, hovered, chapter]);

  if (!group) return null;
  return createPortal(
    <span
      className={`fx-navind fx-navind--${variant}`}
      aria-hidden="true"
      style={{
        opacity: rect ? 1 : 0,
        width: rect?.w ?? 0,
        height: rect?.h ?? 0,
        transform: `translate(${rect?.x ?? 0}px, ${rect?.y ?? 0}px)`,
      }}
    />,
    group,
  );
}
