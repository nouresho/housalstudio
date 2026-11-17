'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProjectCard from '@/components/ProjectCard';
import { PROJETS } from '@/lib/projets';
import { useEffect, useState } from 'react';

export default function Portfolio() {
  const [selectedFilter, setSelectedFilter] = useState('Tous')
  const projetsList = PROJETS

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
            <p>Applications mobiles, sites web et identités de marque : une sélection de projets qui montrent notre façon de transformer des marques.</p>
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
                <ProjectCard p={p} key={p.id} />
              ))}
            </div>

            <div className="portfolio-cta-strip">
              <span className="icon">+</span>
              <div>
                <strong>Votre marque ici ?</strong>
                <p>Discutons de votre projet</p>
              </div>
              <button className="btn" onClick={() => { window.location.href = '/contact' }}>Démarrer un projet</button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
