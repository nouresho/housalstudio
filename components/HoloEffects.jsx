'use client';

// Inclinaison 3D + reflet holographique sur les cartes, au survol de la souris.
// Un seul écouteur pour tout le document : fonctionne aussi pour les cartes
// ajoutées après coup (onglets de la page Offres, filtres du portfolio).
import { useEffect } from 'react';

const SELECTOR = '.gallery-item, .pack, .app-card, .service-card';
const MAX_TILT = 7; // degrés

export default function HoloEffects() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let current = null;
    let frame = 0;
    let last = null;

    const reset = (el) => {
      el.classList.remove('holo-on');
      el.style.removeProperty('--rx');
      el.style.removeProperty('--ry');
    };

    const apply = () => {
      frame = 0;
      if (!last) return;
      const { el, x, y } = last;
      const r = el.getBoundingClientRect();
      const px = Math.min(Math.max((x - r.left) / r.width, 0), 1);
      const py = Math.min(Math.max((y - r.top) / r.height, 0), 1);
      el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
      el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
      el.style.setProperty('--ry', `${((px - 0.5) * 2 * MAX_TILT).toFixed(2)}deg`);
      el.style.setProperty('--rx', `${((0.5 - py) * 2 * MAX_TILT).toFixed(2)}deg`);
      el.style.setProperty('--hue', `${Math.round((px + py) * 180)}deg`);
    };

    const onMove = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      const el = e.target.closest?.(SELECTOR);
      if (el !== current) {
        if (current) reset(current);
        current = el;
        if (el) {
          if (!el.querySelector(':scope > .holo-sheen')) {
            const s = document.createElement('span');
            s.className = 'holo-sheen';
            s.setAttribute('aria-hidden', 'true');
            el.appendChild(s);
          }
          el.classList.add('holo-on');
        }
      }
      if (!el) return;
      last = { el, x: e.clientX, y: e.clientY };
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const onLeave = () => { if (current) reset(current); current = null; };

    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(frame);
      if (current) reset(current);
    };
  }, []);

  return null;
}
