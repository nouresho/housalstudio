'use client';

import Link from 'next/link';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

/* =========================================================
   PACKS HOUSAL 2026 — prix en DH
   (mêmes packs que la grille PDF et l'outil de devis)
========================================================= */

const ICONES = {
  contenu: <path d="M4 5h16v11H8l-4 4V5z" />,
  branding: <><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></>,
  web: <><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M3 8h18" /><path d="M8 21h8" /></>,
  combo: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
  app: <><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></>,
};

const OFFRES = [
  {
    id: 'contenu', label: 'Création de contenu', note: 'Prix mensuel · sans engagement', icone: 'contenu',
    packs: [
      { nom: 'Starter', prix: '990 DH', mois: true, description: 'Être présent sur les réseaux, sans y passer vos soirées.', inclus: ['8 visuels (posts ou carrousels)', 'Légendes rédigées', 'Calendrier de publication', '1 réseau social'] },
      { nom: 'Pro', prix: '1 990 DH', mois: true, tag: 'Le plus choisi', description: 'Du contenu régulier qui attire de nouveaux clients.', inclus: ['12 posts + 4 reels montés', '8 stories', 'Légendes + hashtags', '2 réseaux sociaux', 'Mini rapport mensuel'] },
      { nom: 'Premium', prix: '3 490 DH', mois: true, description: "On s'occupe de tout, du tournage à la publication.", inclus: ['16 posts + 8 reels', 'Tournage sur place (½ journée / mois)', 'Community management', 'Rapport + point mensuel'] },
    ],
  },
  {
    id: 'branding', label: 'Branding', note: 'Identité de marque', icone: 'branding',
    packs: [
      { nom: 'Logo Express', prix: '790 DH', description: 'Un logo pro pour démarrer vite.', inclus: ['Logo + 2 variantes', 'Palette de couleurs', 'Fichiers PNG, SVG et PDF', '2 propositions au choix', 'Livré en 5 jours'] },
      { nom: 'Identité', prix: '1 790 DH', tag: 'Meilleur rapport qualité-prix', description: 'Une image cohérente sur tous vos supports.', inclus: ['Logo + déclinaisons', 'Palette & typographies', 'Carte de visite', 'Mini charte graphique', '3 templates Instagram'] },
      { nom: 'Marque complète', prix: '3 490 DH', description: 'Une marque forte, prête à grandir.', inclus: ['Tout le pack Identité', 'Moodboard & positionnement', 'Charte graphique complète', '6 templates réseaux sociaux', '1 support print (flyer ou menu)'] },
    ],
  },
  {
    id: 'web', label: 'Sites web', note: 'Domaine + hébergement 1 an inclus', icone: 'web',
    packs: [
      { nom: 'Landing', prix: '1 990 DH', description: 'Une page qui présente votre activité et fait appeler.', inclus: ['Page unique responsive', 'Bouton WhatsApp & appel', 'Google Maps & réseaux sociaux', 'Mise en ligne en 5 à 7 jours'] },
      { nom: 'Vitrine', prix: '3 990 DH', tag: 'Recommandé', description: "Le site complet d'une entreprise sérieuse.", inclus: ["Jusqu'à 5 pages", 'Formulaire de contact', 'SEO de base + fiche Google Business', 'Statistiques de visites', 'Formation à la mise à jour'] },
      { nom: 'E-commerce', prix: '6 990 DH', description: 'Vendre en ligne au Maroc, simplement.', inclus: ["Boutique jusqu'à 30 produits", 'Paiement à la livraison (+ en ligne en option)', 'Commandes reçues sur WhatsApp', 'Gestion des stocks'] },
    ],
  },
  {
    id: 'combos', label: 'Offres de lancement', note: 'Plusieurs services, un seul prix', icone: 'combo',
    packs: [
      { nom: 'Démarrage', prix: '2 490 DH', avant: '2 780 DH', description: 'Logo Express + site Landing.', inclus: ['Logo + palette', 'Page web responsive', 'Domaine + hébergement 1 an', 'Prêt en 10 jours'] },
      { nom: 'Lancement', prix: '4 990 DH', avant: '5 780 DH', tag: '− 790 DH', description: 'Identité + site Vitrine.', inclus: ['Pack Identité complet', 'Site Vitrine 5 pages', 'Fiche Google Business', 'Prêt en 3 semaines'] },
      { nom: 'Visibilité', prix: '6 990 DH', avant: '7 770 DH', description: 'Identité + Vitrine + 1er mois de contenu Pro.', inclus: ['Pack Identité complet', 'Site Vitrine 5 pages', '1 mois de contenu Pro', 'Lancement en 1 mois'] },
    ],
  },
  {
    id: 'apps', label: 'Applications mobiles', note: 'iOS & Android · sur devis', icone: 'app',
    packs: [
      { nom: 'App simple', prix: '15 000 DH', apartir: true, description: 'Une première version pour tester votre idée.', inclus: ["Jusqu'à 8 écrans", 'Comptes utilisateurs', 'Notifications', 'Publication sur les stores'] },
      { nom: 'App complète', prix: '30 000 DH', apartir: true, description: 'Une app connectée à votre activité.', inclus: ['20+ écrans, espaces par profil', 'Réservations ou commandes', "Interface d'administration", 'Plusieurs langues'] },
      { nom: 'Maintenance', prix: '900 DH', mois: true, description: 'Votre app reste à jour.', inclus: ['Corrections & mises à jour', 'Compatibilité nouvelles versions', 'Petites évolutions (2 h / mois)'] },
    ],
  },
];

const A_LA_CARTE = [
  ['Post / visuel supplémentaire', '100 DH'], ['Carrousel', '150 DH'], ['Reel monté', '200 DH'],
  ['Shooting photo (1 h)', '500 DH'], ['Carte de visite', '250 DH'], ['Flyer / affiche', '300 DH'],
  ['Menu restaurant', '500 DH'], ['Packaging (par référence)', '900 DH'], ['Fiche Google Business', '300 DH'],
  ['Page web supplémentaire', '500 DH'], ['Langue supplémentaire', '500 DH'], ['Maintenance site / mois', '250 DH'],
];

const BUDGETS = [
  { label: 'Petit budget', montant: '790 — 2 000 DH', texte: 'Pour démarrer : un logo, un mois de contenu Starter ou une landing page.' },
  { label: 'Budget intermédiaire', montant: '2 000 — 5 000 DH', texte: 'Une identité complète, un site vitrine ou une offre de lancement.' },
  { label: 'Projet complet', montant: '5 000 DH +', texte: 'Marque, site, contenu mensuel, e-commerce ou application.' },
];

/* =========================================================
   AVANTAGES
========================================================= */

const AVANTAGES = [
  { icon: <><path d="M12 2v20" /><path d="M2 12h20" /><circle cx="12" cy="12" r="9" /></>, titre: 'Direction créative', texte: 'Une réflexion adaptée à votre marque, pas un template générique.' },
  { icon: <><path d="M4 4h16v16H4z" /><path d="M8 8h8" /><path d="M8 12h8" /><path d="M8 16h5" /></>, titre: 'Livrables prêts à l’emploi', texte: 'Tous les fichiers pour utiliser votre identité et votre contenu au quotidien.' },
  { icon: <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />, titre: 'Accompagnement humain', texte: 'Un échange direct, sur WhatsApp ou en rendez-vous, pour faire avancer votre projet.' },
  { icon: <><path d="M12 2v20" /><path d="M5 7h14" /><path d="M5 17h14" /></>, titre: 'Prix accessibles', texte: 'Des packs pensés pour les petites entreprises, avec paiement en deux fois.' },
];

/* =========================================================
   FAQ
========================================================= */

const FAQ_OFFRES = [
  { q: 'Les prix sont-ils fixes ?', r: 'Ce sont nos prix de départ. Le tarif final est confirmé sur devis, gratuit, selon le nombre de supports et la complexité du projet.' },
  { q: 'Le contenu mensuel est-il avec engagement ?', r: 'Non. Vous payez au début de chaque mois et vous pouvez arrêter quand vous voulez. En payant 3 mois d’avance, vous avez 10 % de réduction.' },
  { q: 'Comment se passe le paiement ?', r: '50 % à la commande pour lancer le projet, et le solde à la livraison. Paiement par virement ou en espèces.' },
  { q: 'Puis-je choisir uniquement certains services ?', r: 'Bien sûr : un logo seul, quelques visuels, un menu, une page web… Les options à la carte sont faites pour ça.' },
  { q: 'Combien de modifications sont incluses ?', r: 'Deux allers-retours par livrable. Au-delà, chaque révision est à 150 DH.' },
  { q: 'Combien de temps prend un projet ?', r: 'De 5 jours pour un logo à 3 semaines pour une marque complète ou un site. Le délai commence à la réception de l’acompte et de vos contenus.' },
];

const Icone = ({ children }) => (
  <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);

/* =========================================================
   PAGE
========================================================= */

export default function PlansPage() {
  const [actif, setActif] = useState(OFFRES[0].id);
  const offre = OFFRES.find((o) => o.id === actif);

  return (
    <>
      <Header active="plans" forceDark />

      <main>

        {/* HERO */}
        <section className="page-hero" style={{ minHeight: '45vh' }}>
          <div className="wrap">
            <div className="eyebrow">Nos offres 2026</div>
            <h1 className="display">
              Des idées fortes.
              <br />
              Des prix accessibles.
            </h1>
            <p>
              Création de contenu, branding et sites web pour les marques qui veulent grandir.
              <br />
              Choisissez un pack, ou composez le vôtre.
            </p>
          </div>
        </section>


        {/* PACKS */}
        <section className="reveal in" style={{ padding: '5rem 0' }}>
          <div className="wrap">

            <div className="packs-head" style={{ marginBottom: '2rem' }}>
              <span className="packs-pill">Nos packs</span>
              <h2 className="display">
                Commencez là où
                <br />
                votre marque en a besoin.
              </h2>
              <p style={{ maxWidth: '650px' }}>
                Pas besoin de prendre plus que nécessaire : chaque pack existe en trois niveaux.
              </p>
            </div>

            <div className="portfolio-filters offres-tabs" role="tablist" aria-label="Catégories d'offres">
              {OFFRES.map((o) => (
                <button
                  key={o.id}
                  role="tab"
                  aria-selected={actif === o.id}
                  className={`filter-btn ${actif === o.id ? 'active' : ''}`}
                  onClick={() => setActif(o.id)}
                >
                  {o.label}
                </button>
              ))}
            </div>
            <p className="offres-note">{offre.note}</p>

            <div className="packs-grid" key={offre.id}>
              {offre.packs.map((plan) => (
                <div className="pack-stand" key={plan.nom}>
                  <div className={`pack ${plan.tag ? 'featured' : ''}`}>

                    {plan.tag && <span className="pack-tag">{plan.tag}</span>}

                    <div className="pack-icon"><Icone>{ICONES[offre.icone]}</Icone></div>

                    <h3>{plan.nom}</h3>

                    <div className="pack-price">
                      {plan.apartir && <small className="pack-price-small">dès </small>}
                      {plan.prix}
                      {plan.mois && <small className="pack-price-small"> / mois</small>}
                    </div>
                    {plan.avant && <div className="pack-before">au lieu de {plan.avant}</div>}

                    <p style={{ color: '#8A8A8A', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                      {plan.description}
                    </p>

                    <ul>
                      {plan.inclus.map((item) => (
                        <li key={item}><span className="check">✓</span>{item}</li>
                      ))}
                    </ul>

                    <Link href="/contact" className={plan.tag ? 'btn' : 'btn outline'}>
                      Demander un devis
                    </Link>

                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>


        {/* À LA CARTE */}
        <section className="reveal in" style={{ padding: '4rem 0', background: '#f5efe2' }}>
          <div className="wrap">
            <div className="packs-head" style={{ marginBottom: '2.5rem' }}>
              <span className="packs-pill">À la carte</span>
              <h2 className="display">
                Juste ce qu&apos;il vous faut.
              </h2>
            </div>
            <div className="alacarte-grid">
              {A_LA_CARTE.map(([nom, prix]) => (
                <div className="alacarte-item" key={nom}>
                  <span>{nom}</span>
                  <strong>{prix}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* BUDGET */}
        <section className="reveal in" style={{ padding: '5rem 0' }}>
          <div className="wrap">

            <div className="packs-head" style={{ marginBottom: '3rem' }}>
              <span className="packs-pill">Votre budget</span>
              <h2 className="display">
                Pas de budget fixe ?
                <br />
                Aucun problème.
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem', alignItems: 'stretch' }}>
              {BUDGETS.map((b) => (
                <div key={b.label} style={{ padding: '2rem', background: '#fff', border: '1px solid rgba(0,0,0,.08)', borderRadius: 18 }}>
                  <span style={{ fontSize: '.75rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--orange)' }}>{b.label}</span>
                  <h3 style={{ fontSize: '2rem', margin: '1rem 0 .5rem' }}>{b.montant}</h3>
                  <p>{b.texte}</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '3rem', padding: '3rem', background: '#111', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap', borderRadius: 22 }}>
              <div>
                <h3 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', marginBottom: '.75rem' }}>
                  Vous avez déjà votre budget ?
                </h3>
                <p style={{ margin: 0, color: '#aaa', maxWidth: '600px' }}>
                  Dites-nous combien vous souhaitez investir et ce que vous voulez créer.
                  Nous vous proposerons la meilleure combinaison de services, avec un devis gratuit.
                </p>
              </div>
              <Link href="/contact" className="btn light">Parler de mon projet</Link>
            </div>

          </div>
        </section>


        {/* AVANTAGES */}
        <section className="reveal in" style={{ padding: '5rem 0' }}>
          <div className="wrap">
            <div className="packs-head">
              <span className="packs-pill">Pourquoi Housal ?</span>
              <h2 className="display">
                Une approche simple.
                <br />
                Un résultat qui compte.
              </h2>
            </div>
            <div className="avantages-grid">
              {AVANTAGES.map((a) => (
                <div className="avantage-card" key={a.titre}>
                  <div className="avantage-icon" style={{ color: 'var(--orange)' }}><Icone>{a.icon}</Icone></div>
                  <h3>{a.titre}</h3>
                  <p>{a.texte}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* FAQ */}
        <section className="reveal in" style={{ padding: '5rem 0' }}>
          <div className="wrap">
            <div className="packs-head">
              <span className="packs-pill">FAQ</span>
              <h2 className="display">Questions fréquentes</h2>
            </div>
            <div className="faq-list">
              {FAQ_OFFRES.map((item) => (
                <details className="faq-item" key={item.q}>
                  <summary>{item.q}</summary>
                  <p>{item.r}</p>
                </details>
              ))}
            </div>
          </div>
        </section>


        {/* CTA FINAL */}
        <section className="reveal in" style={{ padding: '5rem 0' }}>
          <div className="wrap">
            <div className="cta-band">
              <h2 className="display">
                Votre projet mérite
                <br />
                mieux qu’un template.
              </h2>
              <p>
                Une idée, un budget ou simplement l’envie de créer quelque chose de différent ?
                Parlons-en, le premier échange est gratuit.
              </p>
              <Link href="/contact" className="btn light">Demander mon devis gratuit</Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
