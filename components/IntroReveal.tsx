'use client';
import { useEffect, useState } from 'react';

const LETTERS = ['H', 'O', 'U', 'S', 'A', 'L'];

export default function IntroReveal() {
  const [phase, setPhase] = useState<'play' | 'exit' | 'done'>('play');

  useEffect(() => {
    if (sessionStorage.getItem('housal-intro-seen')) {
      setPhase('done');
      return;
    }
    const t1 = setTimeout(() => setPhase('exit'), 1700);
    const t2 = setTimeout(() => {
      setPhase('done');
      sessionStorage.setItem('housal-intro-seen', '1');
    }, 2300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (phase === 'done') return null;

  return (
    <div className={`intro-reveal ${phase === 'exit' ? 'intro-exit' : ''}`} aria-hidden="true">
      <svg className="intro-ribbon" viewBox="0 0 1200 90" preserveAspectRatio="none">
        <path
          d="M0,45 C150,90 250,0 400,45 C550,90 650,0 800,45 C950,90 1050,0 1200,45"
          fill="none" stroke="var(--orange)" strokeWidth="6" strokeLinecap="round"
        />
      </svg>
      <div className="intro-word">
        {LETTERS.map((l, i) => (
          <span key={i} className="intro-letter" style={{ animationDelay: `${i * 70}ms` }}>{l}</span>
        ))}
      </div>
    </div>
  );
}