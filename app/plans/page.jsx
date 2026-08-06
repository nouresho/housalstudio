'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// ✅ Plans par défaut (seront remplacés par Supabase si disponible)
const PLANS_DEFAUT = [
  {
    id: 1,
    nom: 'Starter',
    slug: 'starter',
    prix_mensuel: 'À partir de 3 000 DH',
    prix_annuel: '32 400 DH/an',
    prix_annuel_subtitle: '(soit 2 700 DH/mois)',
    description: 'Pour démarrer votre identité visuelle',
    caracteristiques: ['Logo principal', 'Palette de couleurs', 'Carte de visite', 'Typographies de marque', 'Guide de marque basique'],
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    )
  },
  {
    id: 2,
    nom: 'Business',
    slug: 'business',
    prix_mensuel: 'À partir de 8 000 DH',
    prix_annuel: '86 400 DH/an',
    prix_annuel_subtitle: '(soit 7 200 DH/mois)',
    description: 'Pour une présence digitale complète',
    caracteristiques: ['Branding complet', 'Site vitrine responsive', 'Réseaux sociaux', 'Guide de marque détaillé', 'Signature email', 'Templates Instagram'],
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    featured: true
  },
  {
    id: 3,
    nom: 'Premium',
    slug: 'premium',
    prix_mensuel: 'Sur devis',
    prix_annuel: 'Sur devis',
    prix_annuel_subtitle: '',
    description: 'Pour une présence digitale sur-mesure',
    caracteristiques: ['Branding premium', 'Site sur mesure', 'SEO de base', 'Maintenance incluse', 'Accompagnement dédié', 'Support prioritaire'],
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    )
  }
];

// ✅ Avantages clés
const AVANTAGES = [
  { 
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ), 
    titre: 'Livraison rapide', 
    texte: '2 à 4 semaines selon la complexité' 
  },
  { 
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
        <path d="M16 21h5v-5" />
      </svg>
    ), 
    titre: 'Révisions incluses', 
    texte: '2 à 5 révisions selon le plan' 
  },
  { 
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ), 
    titre: 'Suivi personnalisé', 
    texte: 'Un interlocuteur dédié à votre projet' 
  },
  { 
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ), 
    titre: 'Formats multiples', 
    texte: 'Tous les livrables prêts à l\'emploi' 
  }
];

// ✅ FAQ spécifique aux offres
const FAQ_OFFRES = [
  { q: 'Les prix sont-ils mensuels ou uniques ?', r: 'Les prix affichés sont des paiements uniques pour chaque pack. Vous payez une seule fois et gardez tous les livrables.' },
  { q: 'Puis-je payer en plusieurs fois ?', r: 'Oui, un paiement en 2 fois est possible : 50% à la commande, 50% à la livraison.' },
  { q: 'Combien de temps pour la livraison ?', r: 'Comptez 2 à 4 semaines selon la complexité du projet et votre réactivité lors des phases de validation.' },
  { q: 'Que se passe-t-il après la livraison ?', r: 'Vous repartez avec tous les fichiers sources et un guide d\'utilisation. Nous restons disponibles pour des modifications ultérieures sur devis.' },
  { q: 'Proposez-vous des packs sur-mesure ?', r: 'Oui, contactez-nous pour discuter de vos besoins spécifiques. Nous créons des devis personnalisés pour les projets complexes.' }
];

export default function PlansPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [plans] = useState(PLANS_DEFAUT);

  return (
    <>
      <Header active="plans" forceDark />
      <main>
        <div className="page-hero" style={{ minHeight: '40vh' }}>
          <div className="wrap">
            <div className="eyebrow">Nos offres</div>
            <h1 className="display">Choisissez le plan<br />qui vous correspond</h1>
            <p>Des formules flexibles pour tous les besoins et tous les budgets.</p>
          </div>
        </div>

        <div className="reveal in" style={{ padding: '4rem 0' }}>
          <div className="wrap">
            {/* ✅ Toggle Mensuel/Annuel */}
            <div className="billing-toggle">
              <button 
                className={`toggle-btn ${!isAnnual ? 'active' : ''}`}
                onClick={() => setIsAnnual(false)}
              >
                Mensuel
              </button>
              <button 
                className={`toggle-btn ${isAnnual ? 'active' : ''}`}
                onClick={() => setIsAnnual(true)}
              >
                Annuel <span className="save-badge">-10%</span>
              </button>
            </div>

            <div className="packs-grid">
              {plans.map((plan, index) => {
                const isFeatured = plan.featured
                const prix = isAnnual ? plan.prix_annuel : plan.prix_mensuel
                return (
                  <div className="pack-stand" key={plan.id}>
                    <div className={`pack ${isFeatured ? 'featured' : ''}`}>
                      {isFeatured && <span className="pack-tag">Le plus choisi</span>}
                      <div className="pack-icon">
                        {plan.icon}
                      </div>
                      <h3>{plan.nom}</h3>
                      <div className="pack-price">
                        {prix}
                        {isAnnual && plan.prix_annuel_subtitle && (
                          <span className="price-subtitle">{plan.prix_annuel_subtitle}</span>
                        )}
                      </div>
                      <p style={{ color: '#8A8A8A', marginBottom: '1.5rem' }}>
                        {plan.description}
                      </p>
                      <ul>
                        {plan.caracteristiques.map((item, idx) => (
                          <li key={idx}><span className="check">✓</span>{item}</li>
                        ))}
                      </ul>
                      <Link href="/contact" className={isFeatured ? 'btn' : 'btn outline'}>
                        Choisir ce plan
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ✅ Section Avantages */}
        <div className="reveal in" style={{ padding: '4rem 0', background: '#f5efe2' }}>
          <div className="wrap">
            <div className="packs-head">
              <span className="packs-pill">Avantages</span>
              <h2 className="display">Pourquoi nous choisir ?</h2>
            </div>
            <div className="avantages-grid">
              {AVANTAGES.map((avantage, idx) => (
                <div className="avantage-card" key={idx}>
                  <div className="avantage-icon" style={{ color: 'var(--orange)' }}>{avantage.icon}</div>
                  <h3>{avantage.titre}</h3>
                  <p>{avantage.texte}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ✅ Tableau Comparatif */}
        <div className="reveal in" style={{ padding: '4rem 0' }}>
          <div className="wrap">
            <div className="packs-head">
              <span className="packs-pill">Comparaison</span>
              <h2 className="display">Comparez les fonctionnalités</h2>
            </div>
            <div className="comparison-table">
              <table>
                <thead>
                  <tr>
                    <th>Fonctionnalité</th>
                    {plans.map(plan => (
                      <th key={plan.id} className={plan.featured ? 'featured-th' : ''}>
                        {plan.nom}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Logo principal</td>
                    <td>✓</td>
                    <td className="featured-td">✓</td>
                    <td>✓</td>
                  </tr>
                  <tr>
                    <td>Palette de couleurs</td>
                    <td>✓</td>
                    <td className="featured-td">✓</td>
                    <td>✓</td>
                  </tr>
                  <tr>
                    <td>Carte de visite</td>
                    <td>✓</td>
                    <td className="featured-td">✓</td>
                    <td>✓</td>
                  </tr>
                  <tr>
                    <td>Branding complet</td>
                    <td>-</td>
                    <td className="featured-td">✓</td>
                    <td>✓</td>
                  </tr>
                  <tr>
                    <td>Site web</td>
                    <td>-</td>
                    <td className="featured-td">Site vitrine</td>
                    <td>Site sur mesure</td>
                  </tr>
                  <tr>
                    <td>Réseaux sociaux</td>
                    <td>-</td>
                    <td className="featured-td">✓</td>
                    <td>✓</td>
                  </tr>
                  <tr>
                    <td>SEO de base</td>
                    <td>-</td>
                    <td className="featured-td">-</td>
                    <td>✓</td>
                  </tr>
                  <tr>
                    <td>Maintenance</td>
                    <td>-</td>
                    <td className="featured-td">-</td>
                    <td>✓</td>
                  </tr>
                  <tr>
                    <td>Accompagnement dédié</td>
                    <td>-</td>
                    <td className="featured-td">-</td>
                    <td>✓</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ✅ FAQ Offres */}
        <div className="reveal in" style={{ padding: '4rem 0' }}>
          <div className="wrap">
            <div className="packs-head">
              <span className="packs-pill">FAQ</span>
              <h2 className="display">Questions fréquentes</h2>
            </div>
            <div className="faq-list">
              {FAQ_OFFRES.map((item, idx) => (
                <details className="faq-item" key={idx}>
                  <summary>{item.q}</summary>
                  <p>{item.r}</p>
                </details>
              ))}
            </div>
          </div>
        </div>

        {/* ✅ CTA Sur-mesure */}
        <div className="reveal in" style={{ padding: '4rem 0' }}>
          <div className="wrap">
            <div className="cta-band">
              <h2 className="display">Besoin d'un projet sur-mesure ?</h2>
              <p>Discutons de vos besoins spécifiques et créons une offre adaptée à votre projet.</p>
              <Link href="/contact" className="btn light">Nous contacter</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}