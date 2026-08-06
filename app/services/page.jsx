'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useEffect, useRef } from 'react';

const SERVICE_FEATURES = {
  branding: ['Logo principal', 'Palette de couleurs', 'Guide de marque', 'Templates réseaux sociaux', 'Kit de lancement'],
  events: ['Concept sur-mesure', 'Production complète', 'Scénographie & mise en scène', 'Gestion clients', 'Accompagnement 360°'],
  marketing: ['Stratégie de lancement', 'Plan media', 'Création de contenu', 'Community management', 'Reporting clair'],
  design: ['Direction artistique', 'Visuels de marque', 'Packaging', 'UI/UX', 'Moodboards inspirants'],
  web: ['Site responsive', 'SEO optimisé', 'CMS personnalisé', 'Performance', 'Maintenance simple'],
  default: ['Audit rapide', 'Proposition claire', 'Exécution soignée', 'Suivi continu']
}

// ✅ Services génériques de l'agence
const SERVICES_DEFAUT = [
  {
    id: '1',
    titre: 'Identité de marque',
    description: "Nous concevons des identités visuelles cohérentes et mémorables — logo, palette, typographie, guide de marque — pour que votre marque laisse une impression durable.",
    categorie: 'branding',
    image_url: '/images/elara.jpg',
    prix_depart: '4200',
    actif: true,
    features: ['Logo principal & variantes', 'Palette & typographies', 'Guide de marque complet']
  },
  {
    id: '2',
    titre: 'Création de site web',
    description: "Des sites web performants, pensés pour convertir : design soigné, expérience mobile-first, SEO intégré et CMS simple à prendre en main.",
    categorie: 'web',
    image_url: '/images/flour-lab.jpg',
    prix_depart: '3500',
    actif: true,
    features: ['Design responsive & accessible', 'SEO & performance', 'CMS personnalisé']
  },
  {
    id: '3',
    titre: 'Stratégie & contenus',
    description: "Nous construisons votre présence digitale de A à Z : stratégie éditoriale, création de contenus percutants et pilotage de vos réseaux sociaux.",
    categorie: 'marketing',
    image_url: '/images/qhiwa.jpg',
    prix_depart: '2800',
    actif: true,
    features: ['Plan éditorial sur-mesure', 'Contenus & visuels', 'Community management']
  }
]

// ✅ Notre processus (4 étapes)
const PROCESS_STEPS = [
  { ord: '01', titre: 'Audit & découverte', texte: "On prend le temps de comprendre votre marque, votre marché et vos objectifs avant de proposer quoi que ce soit." },
  { ord: '02', titre: 'Stratégie & positionnement', texte: "On définit un positionnement clair et différenciant, base de toutes les décisions créatives à venir." },
  { ord: '03', titre: 'Création & design', texte: "Identité visuelle, contenus ou site web : on conçoit chaque élément avec exigence et cohérence." },
  { ord: '04', titre: 'Livraison & accompagnement', texte: "Vous repartez avec des livrables prêts à l'emploi, et un accompagnement pour bien les déployer." },
]

// ✅ Réalisations (portfolio)
const PORTFOLIO_DEFAUT = [
  {
    id: 'p1',
    titre: 'Elara — Skincare',
    tag: 'BRANDING',
    image: '/images/elara.jpg',
    description: "Identité visuelle complète et packaging pour une marque de soins premium.",
    chips: ['Logo', 'Packaging', 'Guide de marque'],
  },
  {
    id: 'p2',
    titre: 'Flour Lab — Boulangerie',
    tag: 'WEB & IDENTITÉ',
    image: '/images/flour-lab.jpg',
    description: "Refonte de l'identité visuelle et création du site vitrine responsive.",
    chips: ['Web design', 'Identité visuelle', 'Photographie'],
  },
  {
    id: 'p3',
    titre: 'QHIWA — Coffee Brand',
    tag: 'STRATÉGIE & CONTENU',
    image: '/images/qhiwa.jpg',
    description: "Stratégie de contenu et création de visuels pour accompagner le lancement de la marque.",
    chips: ['Stratégie éditoriale', 'Content creation', 'Réseaux sociaux'],
  },
]

// ✅ FAQ (accordéon en CSS pur via <details>/<summary>, pas besoin de JS)
const FAQ_ITEMS = [
  { q: "Quels sont les délais moyens pour un projet de branding ?", r: "Comptez généralement 2 à 4 semaines pour une identité complète, selon la complexité du projet et la réactivité dans les échanges." },
  { q: "Combien de révisions sont incluses ?", r: "Chaque pack inclut un nombre de révisions défini (2 à 5 selon la formule). Des révisions supplémentaires peuvent être ajoutées sur devis." },
  { q: "Proposez-vous des paiements en plusieurs fois ?", r: "Oui, un paiement en deux fois (acompte au démarrage, solde à la livraison) est proposé pour la plupart des projets." },
  { q: "Travaillez-vous avec des clients hors du Maroc ?", r: "Oui, nous travaillons à distance avec des clients partout dans le monde, avec des points d'échange réguliers en visio." },
]

export default function ServicesPage() {
  const cardsRef = useRef(null)

  useEffect(() => {
    // Single shared observer for all reveal animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 100)
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.15 })

    // Observe service cards
    const cards = document.querySelectorAll('.service-card')
    cards.forEach(card => observer.observe(card))

    // Observe reveal items (portfolio + process steps)
    const revealItems = document.querySelectorAll('.reveal-item')
    revealItems.forEach(el => observer.observe(el))

    // FAQ accordion
    document.querySelectorAll('.faq-question').forEach(q => {
      q.addEventListener('click', () => {
        q.closest('.faq-item-custom').classList.toggle('open')
      })
    })

    return () => {
      cards.forEach(card => observer.unobserve(card))
      revealItems.forEach(el => observer.unobserve(el))
    }
  }, [])

  const displayServices = SERVICES_DEFAUT

  return (
    <>
      <Header active="services" forceDark />
      <main>
        {/* 1. Hero */}
        <section className="services-hero">
          <div className="services-hero-copy centered">
            <div className="eyebrow">Services</div>
            <h1>
              <span className="setup">N'importe qui peut vous vendre un logo.</span><br />
              <span className="payoff">Nous construisons des marques <span className="highlight">qui vendent</span> — celles qui captent l'attention, fidélisent vos clients et distancent la concurrence.</span>
            </h1>
            <p>Branding percutant, expériences digitales et systèmes de contenu conçus pour capter l'attention et convertir.</p>
            <Link href="/contact" className="btn btn-lg cta-button">Démarrer un projet</Link>
          </div>
        </section>

        {/* 2. Services cards */}
        <section className="services-list-wrap">
          <div className="services-list-title">SERVICES</div>
          <div className="services-list" ref={cardsRef}>
            {displayServices.slice(0, 3).map((s, i) => {
              const features = s.features || SERVICE_FEATURES[s.categorie] || SERVICE_FEATURES.default
              return (
                <Link href="/contact" className={`service-card service-card-${i + 1}`} key={s.id || i}>
                  <div className="service-card-copy">
                    <div className="service-card-label">{(s.categorie || 'service').toUpperCase()}</div>
                    <h2>{s.titre}</h2>
                    <ul>
                      {features.slice(0, 3).map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="service-card-media">
                    <img
                      src={s.image_url || '/placeholder.jpg'}
                      alt={s.titre || 'Service image'}
                      className="service-card-image"
                      loading="lazy"
                    />
                    <div className="service-card-price">
                      {s.prix_depart ? `À partir de ${s.prix_depart}` : 'À partir de 3500'}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* 3. CTA banner */}
        <section>
          <div className="wrap">
            <div className="cta-band">
              <h2 className="display">Prêt à transformer votre marque ?</h2>
              <p>Parlons de votre projet — premier échange gratuit et sans engagement.</p>
              <Link href="/contact" className="btn light">Discuter de mon projet</Link>
            </div>
          </div>
        </section>

        {/* 4. Portfolio teaser (2 cards) */}
        <section className="portfolio-teaser">
          <p className="teaser-label">Nos réalisations</p>
          <div className="teaser-grid">
            {PORTFOLIO_DEFAUT.slice(0, 2).map((p) => (
              <article className="pf-card reveal-item" key={p.id}>
                <div className="pf-visual">
                  <img src={p.image} alt={p.titre} loading="lazy" />
                </div>
                <div className="pf-body">
                  <div className="pf-tag">{p.tag}</div>
                  <h3>{p.titre}</h3>
                  <p>{p.description}</p>
                  <div className="pf-chips">
                    {p.chips.map((c, idx) => <span key={idx}>{c}</span>)}
                  </div>
                </div>
              </article>
            ))}
          </div>
          <Link href="/portfolio" className="teaser-link">Voir tout le portfolio →</Link>
        </section>

        {/* 5. Process steps */}
        <section>
          <div className="wrap">
            <div className="packs-head">
              <span className="packs-pill">Méthode</span>
              <h2 className="display">Notre processus</h2>
              <p>Une méthode claire en 4 étapes, du premier échange à la livraison finale.</p>
            </div>
            <div className="process-grid">
              {PROCESS_STEPS.map((step, idx) => (
                <div className="process-step reveal-item" key={idx}>
                  <span className="ord process-number">{step.ord}</span>
                  <h4>{step.titre}</h4>
                  <p>{step.texte}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. FAQ */}
        <section>
          <div className="wrap faq-section">
            <div className="packs-head">
              <span className="packs-pill">FAQ</span>
              <h2 className="display">Questions fréquentes</h2>
              <p>Tout ce qu'il faut savoir avant de démarrer un projet avec nous.</p>
            </div>
            <div className="faq-list">
              {FAQ_ITEMS.map((item, idx) => (
                <div className="faq-item faq-item-custom" key={idx}>
                  <div className="faq-question">
                    <span>{item.q}</span>
                    <span className="faq-icon">+</span>
                  </div>
                  <div className="faq-answer">
                    <p>{item.r}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
