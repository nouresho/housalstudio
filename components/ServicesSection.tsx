'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const SERVICES = [
  {
    label: 'Branding',
    title: 'Identité de marque',
    features: ['Logo & variantes', 'Palette & typographies', 'Guide de marque'],
    image: '/images/identity.jpg',
    variant: 'housal-1', // navy
  },
  {
    label: 'Marketing',
    title: 'Stratégie & contenus',
    features: ['Plan éditorial', 'Création de contenus', 'Community management'],
    image: '/images/marketing.jpg',
    variant: 'housal-2', // orange
  },
  {
    label: 'Web & digital',
    title: 'Création de site web',
    features: ['Design responsive', 'SEO & performance', 'CMS personnalisé'],
    image: '/images/creationweb.jpg',
    variant: 'housal-3', // cream
  },
  {
    label: 'Événementiel',
    title: 'Direction artistique',
    features: ['Concept sur-mesure', 'Scénographie', 'Production complète'],
    image: '/images/directionartistique.jpg',
    variant: 'housal-4', // navy-deep
  },
];

export default function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="reveal in">
      <div className="wrap">
        <div className="eyebrow">Ce que nous faisons</div>
        <h2 className="display" style={{ fontSize: 'clamp(28px,4vw,42px)', margin: '0 0 12px' }}>
          Une agence, quatre expertises.
        </h2>
        <p style={{ fontSize: 15, color: '#5A5A5A', maxWidth: 480, margin: '0 0 40px' }}>
          Un aperçu de ce qu'on fait. Le détail complet est sur la page services.
        </p>

        <div className={`services-list services-list-sm ${visible ? 'sv-in' : ''}`} ref={ref}>
          {SERVICES.map((s, i) => (
            <Link
              href="/services"
              className={`service-card service-card-${s.variant} ${visible ? 'visible' : ''}`}
              key={s.title}
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <div className="service-card-copy">
                <div className="service-card-label">{s.label}</div>
                <h2>{s.title}</h2>
                <ul>
                  {s.features.map((f) => <li key={f}>{f}</li>)}
                </ul>
              </div>
              <div className="service-card-media">
                <img src={s.image} alt={s.title} className="service-card-image" loading="lazy" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}