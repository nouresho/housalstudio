'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';

const PROJETS_DEFAUT = [
  {
    id: 'rz-concept',
    titre: 'RZ Concept',
    categorie: 'SITES WEB',
    variant: 'housal-2',
    image_url: null,
    client: 'RZ Concept',
    lien: 'https://rz-concept-website.vercel.app/',
    statut: 'Site web',
    description: 'Projet de site web pour RZ Concept.',
  },
  {
    id: 'ecokepheyra',
    titre: 'Ecokepheyra',
    categorie: 'SITES WEB',
    variant: 'housal-3',
    image_url: null,
    client: 'Ecokepheyra',
    statut: 'Site web',
    description: 'Projet de site web pour Ecokepheyra.',
  },
  {
    id: 'dar-lmon',
    titre: 'Dar Limon',
    categorie: 'BRANDING',
    variant: 'housal-4',
    image_url: null,
    client: 'Dar Limon',
    lien: 'https://www.instagram.com/p/DdE2UhUxSDW/',
    statut: 'Branding',
    description: 'Projet de branding pour Dar Limon.',
  },
  {
    id: 'p1',
    titre: 'Elara — Skincare',
    categorie: 'BRANDING',
    variant: 'housal-1',
    image_url: '/images/elara.png',
    client: 'Elara',
    date_projet: '2026',
    statut: 'Projet personnel · Branding complet',
    description: "Identité visuelle complète et packaging pour une marque de soins premium.",
  },
  {
    id: 'p2',
    titre: 'Flour Lab — Boulangerie',
    categorie: 'WEB & IDENTITÉ',
    variant: 'housal-2',
    image_url: '/images/floorlab.png',
    client: 'Flour Lab',
    date_projet: '2026',
    statut: 'Projet personnel · Web & Identité',
    description: "Refonte de l'identité visuelle et création du site vitrine responsive.",
  },
  {
    id: 'p3',
    titre: 'QHIWA — Coffee Brand',
    categorie: 'STRATÉGIE & CONTENU',
    variant: 'housal-3',
    image_url: '/images/QHIWA.png',
    client: 'QHIWA',
    date_projet: '2026',
    statut: 'Projet personnel · Stratégie & Contenu',
    description: "Stratégie de contenu et création de visuels pour accompagner le lancement de la marque.",
  },
  {
    id: 'p4',
    titre: 'Melto — Cookies',
    categorie: 'BRANDING',
    variant: 'housal-1',
    image_url: '/images/melto.png',
    client: 'Melto',
    date_projet: '2026',
    statut: 'Branding complet',
    description: "Identité visuelle gourmande et packaging pour une marque de cookies artisanaux.",
  },
  {
    id: 'p5',
    titre: 'Idramel — Bijouterie',
    categorie: 'JEWELRY BRANDING',
    variant: 'housal-2',
    image_url: '/images/id.png',
    client: 'Idramel',
    date_projet: '2026',
    statut: 'Identité de marque premium',
    description: "Identité visuelle raffinée pour une maison de bijoux, entre héritage et modernité.",
  },
  {
    id: 'p6',
    titre: 'North Africa Surf',
    categorie: 'BRANDING & WEB',
    variant: 'housal-3',
    image_url: '/images/surf.png',
    client: 'North Africa Surf',
    date_projet: '2026',
    statut: 'Identité & site vitrine',
    description: "Identité visuelle et site web pour une communauté de surf ancrée dans la culture nord-africaine.",
  },
  {
    id: 'p7',
    titre: 'Lumo Gelato',
    categorie: 'BRANDING',
    variant: 'housal-4',
    image_url: '/images/lumo.png',
    client: 'Lumo Gelato',
    date_projet: '2024',
    statut: 'Identité complète',
    description: "Identité de marque fraîche et lumineuse pour une gelateria artisanale.",
  },
]

export default function Portfolio() {
  const [selectedFilter, setSelectedFilter] = useState('Tous')
  const projetsList = PROJETS_DEFAUT

  const categories = ['Tous', ...Array.from(new Set(projetsList.map(p => p.categorie)))]

  const filteredProjects = selectedFilter === 'Tous'
    ? projetsList
    : projetsList.filter(p => p.categorie === selectedFilter)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 100)
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.15 })

    const items = document.querySelectorAll('.gallery-item')
    items.forEach(el => observer.observe(el))

    return () => {
      items.forEach(el => observer.unobserve(el))
    }
  }, [filteredProjects])

  return (
    <>
      <Header active="portfolio" forceDark />
      <main>
        <div className="page-hero">
          <div className="wrap">
            <div className="eyebrow">Notre travail</div>
            <h1 className="display">Portfolio</h1>
            <p>Une sélection de projets qui démontrent notre approche créative et notre capacité à transformer des marques.</p>
          </div>
        </div>

        <div className="reveal in">
          <div className="wrap">
            <div className="portfolio-filters">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`filter-btn ${selectedFilter === category ? 'active' : ''}`}
                  onClick={() => setSelectedFilter(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="gallery-grid gallery-grid-lg">
              {filteredProjects.map((p) => (
                <div className={`gallery-item gallery-item-${p.variant}`} key={p.id}>
                  <div className="gi-photo">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.titre} />
                    ) : (
                      <div className="ph-placeholder" style={{
                        borderRadius: 0, position: 'absolute', inset: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: '#efe9df', color: '#262626',
                        flexDirection: 'column', gap: 12, padding: 24, textAlign: 'center'
                      }}>
                        <strong style={{ fontSize: 'clamp(24px, 4vw, 42px)' }}>{p.titre}</strong>
                        <span style={{ fontSize: 12 }}>Visuel à venir</span>
                      </div>
                    )}
                    <span className={`gi-badge gi-badge-${p.variant}`}>
                      {p.categorie || 'Projet'}
                    </span>
                  </div>
                  <div className="gi-body">
                    <h3 className="gi-title">{p.titre}</h3>
                    <div className="gi-meta">
                      <span>{p.client || 'Client'}</span>
                      {p.date_projet && <>
                        <span className="dot"></span>
                        <span>{p.date_projet}</span>
                      </>}
                    </div>
                    <div className="gi-footer">
                      <span className="gi-tag">{p.statut || 'Terminé'}</span>
                      {p.lien && (
                        <a className="gi-project-link" href={p.lien} target="_blank" rel="noopener noreferrer"
                          aria-label={`Voir le projet ${p.titre} (nouvel onglet)`}>
                          Voir le projet ↗
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="portfolio-cta-strip">
              <span className="icon">+</span>
              <div>
                <strong>Votre marque ici ?</strong>
                <p>Discutons de votre projet</p>
              </div>
              <button className="btn" onClick={() => window.location.href='/contact'}>Démarrer un projet</button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
