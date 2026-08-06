'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';

// ✅ Projets par défaut
const PROJETS_DEFAUT = [
  {
    id: 'p1',
    titre: 'Elara — Skincare',
    categorie: 'BRANDING',
    image_url: '/images/elara.jpg',
    client: 'Elara',
    date_projet: '2024',
    statut: 'Projet personnel · Branding complet',
    description: "Identité visuelle complète et packaging pour une marque de soins premium."
  },
  {
    id: 'p2',
    titre: 'Flour Lab — Boulangerie',
    categorie: 'WEB & IDENTITÉ',
    image_url: '/images/flour-lab.jpg',
    client: 'Flour Lab',
    date_projet: '2024',
    statut: 'Projet personnel · Web & Identité',
    description: "Refonte de l'identité visuelle et création du site vitrine responsive."
  },
  {
    id: 'p3',
    titre: 'QHIWA — Coffee Brand',
    categorie: 'STRATÉGIE & CONTENU',
    image_url: '/images/qhiwa.jpg',
    client: 'QHIWA',
    date_projet: '2024',
    statut: 'Projet personnel · Stratégie & Contenu',
    description: "Stratégie de contenu et création de visuels pour accompagner le lancement de la marque."
  },
]

export default function Portfolio() {
  const [selectedFilter, setSelectedFilter] = useState('Tous')
  const projetsList = PROJETS_DEFAUT

  // Get unique categories
  const categories = ['Tous', ...Array.from(new Set(projetsList.map(p => p.categorie)))]

  // Filter projects
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
            <p className="portfolio-disclaimer">
              Projets personnels créés pour démontrer notre expertise — en attendant de présenter vos futurs résultats ici.
            </p>
          </div>
        </div>

        <div className="reveal in">
          <div className="wrap">
            {/* Filter buttons */}
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

            <div className="gallery-grid">
              {filteredProjects.map((p) => (
                <div className="gallery-item" key={p.id}>
                  <div className="gi-photo">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.titre} />
                    ) : (
                      <div className="ph-placeholder" style={{
                        borderRadius: 0,
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#f0f0f0',
                        color: '#999'
                      }}>
                        <span>Pas d&apos;image</span>
                      </div>
                    )}
                    <span className="gi-badge">
                      {p.categorie || 'Projet'}
                    </span>
                  </div>
                  <div className="gi-body">
                    <h3 className="gi-title">{p.titre}</h3>
                    <div className="gi-meta">
                      <span>{p.client || 'Client'}</span>
                      <span className="dot"></span>
                      <span>{p.date_projet || '2024'}</span>
                    </div>
                    <div className="gi-footer">
                      <span className="gi-tag">{p.statut || 'Terminé'}</span>
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