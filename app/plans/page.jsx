'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

/* =========================================================
   PACKS HOUSAL
========================================================= */

const PLANS = [
  {
    id: 1,
    nom: 'START',
    slug: 'start',
    prix: 'À partir de 1 500 DH',
    description: 'Les essentiels pour lancer votre marque avec une identité propre et cohérente.',
    caracteristiques: [
      'Logo principal',
      'Palette de couleurs',
      'Typographies',
      'Logo secondaire',
      'Carte de visite',
      'Mini guide de marque',
    ],
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="32"
        height="32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },

  {
    id: 2,
    nom: 'IDENTITÉ',
    slug: 'identite',
    prix: 'À partir de 3 000 DH',
    description:
      'Une identité visuelle complète pour donner une vraie personnalité à votre marque.',
    caracteristiques: [
      'Stratégie de marque',
      'Logo + variantes',
      'Palette couleurs',
      'Système typographique',
      'Direction artistique',
      'Carte de visite',
      '3 templates réseaux sociaux',
      'Brand guidelines',
    ],
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="32"
        height="32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M8 8h8" />
        <path d="M8 12h5" />
        <path d="M8 16h8" />
      </svg>
    ),
    featured: true,
  },

  {
    id: 3,
    nom: 'SIGNATURE',
    slug: 'signature',
    prix: 'À partir de 5 500 DH',
    description:
      'Une direction créative complète pour construire une marque forte sur tous ses supports.',
    caracteristiques: [
      'Branding complet',
      'Direction artistique',
      'Identité visuelle complète',
      'Supports print',
      'Packaging selon besoin',
      'Social media kit',
      '6 templates Instagram',
      'Guide de marque complet',
      'Accompagnement personnalisé',
    ],
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="32"
        height="32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },

  {
    id: 4,
    nom: 'FULL BRAND',
    slug: 'full-brand',
    prix: 'À partir de 9 000 DH',
    description:
      'Une expérience de marque complète : identité, digital et communication réunis dans un même projet.',
    caracteristiques: [
      'Branding complet',
      'Direction artistique',
      'Site web vitrine',
      'UI / UX design',
      'Responsive design',
      'Social media',
      'Templates réseaux sociaux',
      'SEO de base',
      'Supports de communication',
      'Accompagnement personnalisé',
    ],
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="32"
        height="32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3v18" />
        <path d="M3 12h18" />
        <path d="M5.5 5.5c3.5 2.8 9.5 2.8 13 0" />
        <path d="M5.5 18.5c3.5-2.8 9.5-2.8 13 0" />
      </svg>
    ),
  },
];

/* =========================================================
   AVANTAGES
========================================================= */

const AVANTAGES = [
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="32"
        height="32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2v20" />
        <path d="M2 12h20" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
    titre: 'Direction créative',
    texte: 'Une réflexion créative adaptée à votre marque, pas un template générique.',
  },

  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="32"
        height="32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 4h16v16H4z" />
        <path d="M8 8h8" />
        <path d="M8 12h8" />
        <path d="M8 16h5" />
      </svg>
    ),
    titre: 'Livrables prêts à l’emploi',
    texte: 'Tous les fichiers nécessaires pour utiliser votre identité au quotidien.',
  },

  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="32"
        height="32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
    titre: 'Accompagnement humain',
    texte: 'Un échange direct pour comprendre votre vision et faire évoluer le projet.',
  },

  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="32"
        height="32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2v20" />
        <path d="M5 7h14" />
        <path d="M5 17h14" />
      </svg>
    ),
    titre: 'Budget flexible',
    texte: 'Votre budget définit le périmètre du projet. On construit une solution qui vous correspond.',
  },
];

/* =========================================================
   FAQ
========================================================= */

const FAQ_OFFRES = [
  {
    q: 'Les prix sont-ils fixes ?',
    r: 'Les prix indiqués sont des prix de départ. Le tarif final dépend du nombre de supports, du niveau de personnalisation et de la complexité du projet.',
  },

  {
    q: 'Je n’ai pas un gros budget. Est-ce que je peux travailler avec Housal ?',
    r: 'Oui. Nous proposons plusieurs niveaux d’accompagnement et surtout des projets sur mesure. Donnez-nous votre budget et nous vous proposerons les éléments les plus importants à réaliser en priorité.',
  },

  {
    q: 'Puis-je choisir uniquement certains services ?',
    r: 'Bien sûr. Vous pouvez commander uniquement un logo, une identité visuelle, des supports print, des visuels pour les réseaux sociaux, un site web ou une combinaison de plusieurs services.',
  },

  {
    q: 'Puis-je payer en plusieurs fois ?',
    r: 'Oui. Pour les projets plus importants, un paiement en deux étapes peut être proposé : une partie au lancement puis le solde à la livraison.',
  },

  {
    q: 'Combien de temps prend un projet ?',
    r: 'Cela dépend du projet. Une petite identité peut être réalisée rapidement, tandis qu’un branding complet ou un site web demande davantage de temps. Le délai est défini avant le lancement.',
  },

  {
    q: 'Proposez-vous des packs personnalisés ?',
    r: 'Oui. C’est même l’une de nos approches principales. Vous nous indiquez votre besoin et votre budget, et nous construisons une offre adaptée.',
  },
];

/* =========================================================
   COMPARAISON
========================================================= */

const COMPARAISON = [
  {
    nom: 'Logo principal',
    values: ['✓', '✓', '✓', '✓'],
  },
  {
    nom: 'Logo secondaire / variantes',
    values: ['✓', '✓', '✓', '✓'],
  },
  {
    nom: 'Palette de couleurs',
    values: ['✓', '✓', '✓', '✓'],
  },
  {
    nom: 'Typographies',
    values: ['✓', '✓', '✓', '✓'],
  },
  {
    nom: 'Direction artistique',
    values: ['-', '✓', '✓', '✓'],
  },
  {
    nom: 'Brand guidelines',
    values: ['Mini', '✓', '✓', '✓'],
  },
  {
    nom: 'Templates réseaux sociaux',
    values: ['-', '3', '6', '✓'],
  },
  {
    nom: 'Supports print',
    values: ['Carte de visite', '✓', '✓', '✓'],
  },
  {
    nom: 'Packaging',
    values: ['-', '-', 'Selon besoin', '✓'],
  },
  {
    nom: 'Site web',
    values: ['-', '-', '-', 'Site vitrine'],
  },
  {
    nom: 'SEO de base',
    values: ['-', '-', '-', '✓'],
  },
  {
    nom: 'Accompagnement personnalisé',
    values: ['-', '✓', '✓', '✓'],
  },
];

/* =========================================================
   PAGE
========================================================= */

export default function PlansPage() {
  return (
    <>
      <Header active="plans" forceDark />

      <main>

        {/* =====================================================
            HERO
        ===================================================== */}

        <section
          className="page-hero"
          style={{ minHeight: '45vh' }}
        >
          <div className="wrap">

            <div className="eyebrow">
              Nos offres
            </div>

            <h1 className="display">
              Des idées fortes.
              <br />
              Des offres simples.
            </h1>

            <p>
              Branding, design, digital et communication.
              <br />
              Choisissez ce dont votre marque a réellement besoin.
            </p>

          </div>
        </section>


        {/* =====================================================
            PACKS
        ===================================================== */}

        <section
          className="reveal in"
          style={{ padding: '5rem 0' }}
        >
          <div className="wrap">

            <div
              className="packs-head"
              style={{ marginBottom: '3rem' }}
            >
              <span className="packs-pill">
                Nos packs
              </span>

              <h2 className="display">
                Commencez là où
                <br />
                votre marque en a besoin.
              </h2>

              <p style={{ maxWidth: '650px' }}>
                Pas besoin de prendre plus que nécessaire.
                Nos offres sont pensées pour s’adapter à différents
                niveaux de budget et de maturité.
              </p>
            </div>


            <div className="packs-grid">

              {PLANS.map((plan) => {

                const isFeatured = plan.featured;

                return (
                  <div
                    className="pack-stand"
                    key={plan.id}
                  >

                    <div
                      className={`pack ${
                        isFeatured ? 'featured' : ''
                      }`}
                    >

                      {isFeatured && (
                        <span className="pack-tag">
                          Le plus choisi
                        </span>
                      )}


                      <div className="pack-icon">
                        {plan.icon}
                      </div>


                      <h3>
                        {plan.nom}
                      </h3>


                      <div className="pack-price">
                        {plan.prix}
                      </div>


                      <p
                        style={{
                          color: '#8A8A8A',
                          marginBottom: '1.5rem',
                          lineHeight: '1.6',
                        }}
                      >
                        {plan.description}
                      </p>


                      <ul>
                        {plan.caracteristiques.map(
                          (item, index) => (
                            <li key={index}>
                              <span className="check">
                                ✓
                              </span>

                              {item}
                            </li>
                          )
                        )}
                      </ul>


                      <Link
                        href="/contact"
                        className={
                          isFeatured
                            ? 'btn'
                            : 'btn outline'
                        }
                      >
                        Démarrer ce projet
                      </Link>

                    </div>

                  </div>
                );

              })}

            </div>

          </div>
        </section>


        {/* =====================================================
            PACK SUR MESURE / BUDGET
        ===================================================== */}

        <section
          className="reveal in"
          style={{
            padding: '5rem 0',
            background: '#f5efe2',
          }}
        >

          <div className="wrap">

            <div
              className="packs-head"
              style={{ marginBottom: '3rem' }}
            >

              <span className="packs-pill">
                Votre budget
              </span>

              <h2 className="display">
                Pas de budget fixe ?
                <br />
                Aucun problème.
              </h2>

            </div>


            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '2rem',
                alignItems: 'stretch',
              }}
            >

              {/* Budget 1 */}

              <div
                style={{
                  padding: '2rem',
                  background: '#fff',
                  border: '1px solid rgba(0,0,0,.08)',
                }}
              >

                <span
                  style={{
                    fontSize: '.75rem',
                    letterSpacing: '.12em',
                    textTransform: 'uppercase',
                    color: 'var(--orange)',
                  }}
                >
                  Petit budget
                </span>

                <h3
                  style={{
                    fontSize: '2rem',
                    margin: '1rem 0 .5rem',
                  }}
                >
                  1 000 — 2 500 DH
                </h3>

                <p>
                  Idéal pour commencer avec les éléments
                  essentiels : logo, couleurs, typographies
                  ou quelques supports de communication.
                </p>

              </div>


              {/* Budget 2 */}

              <div
                style={{
                  padding: '2rem',
                  background: '#fff',
                  border: '1px solid rgba(0,0,0,.08)',
                }}
              >

                <span
                  style={{
                    fontSize: '.75rem',
                    letterSpacing: '.12em',
                    textTransform: 'uppercase',
                    color: 'var(--orange)',
                  }}
                >
                  Budget intermédiaire
                </span>

                <h3
                  style={{
                    fontSize: '2rem',
                    margin: '1rem 0 .5rem',
                  }}
                >
                  2 500 — 5 000 DH
                </h3>

                <p>
                  Pour construire une identité plus complète
                  avec direction artistique, branding et
                  premiers supports digitaux.
                </p>

              </div>


              {/* Budget 3 */}

              <div
                style={{
                  padding: '2rem',
                  background: '#fff',
                  border: '1px solid rgba(0,0,0,.08)',
                }}
              >

                <span
                  style={{
                    fontSize: '.75rem',
                    letterSpacing: '.12em',
                    textTransform: 'uppercase',
                    color: 'var(--orange)',
                  }}
                >
                  Projet complet
                </span>

                <h3
                  style={{
                    fontSize: '2rem',
                    margin: '1rem 0 .5rem',
                  }}
                >
                  5 000 DH+
                </h3>

                <p>
                  Pour une identité forte, du contenu,
                  du digital, un site web ou une expérience
                  de marque complète.
                </p>

              </div>

            </div>


            {/* CTA budget */}

            <div
              style={{
                marginTop: '3rem',
                padding: '3rem',
                background: '#111',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '2rem',
                flexWrap: 'wrap',
              }}
            >

              <div>

                <h3
                  style={{
                    fontSize: 'clamp(1.6rem, 3vw, 2.5rem)',
                    marginBottom: '.75rem',
                  }}
                >
                  Vous avez déjà votre budget ?
                </h3>

                <p
                  style={{
                    margin: 0,
                    color: '#aaa',
                    maxWidth: '600px',
                  }}
                >
                  Dites-nous combien vous souhaitez investir
                  et ce que vous voulez créer. Nous vous proposerons
                  la meilleure combinaison de services possible.
                </p>

              </div>


              <Link
                href="/contact"
                className="btn light"
              >
                Parler de mon projet
              </Link>

            </div>

          </div>

        </section>


        {/* =====================================================
            AVANTAGES
        ===================================================== */}

        <section
          className="reveal in"
          style={{ padding: '5rem 0' }}
        >

          <div className="wrap">

            <div className="packs-head">

              <span className="packs-pill">
                Pourquoi Housal ?
              </span>

              <h2 className="display">
                Une approche simple.
                <br />
                Un résultat qui compte.
              </h2>

            </div>


            <div className="avantages-grid">

              {AVANTAGES.map(
                (avantage, index) => (

                  <div
                    className="avantage-card"
                    key={index}
                  >

                    <div
                      className="avantage-icon"
                      style={{
                        color: 'var(--orange)',
                      }}
                    >
                      {avantage.icon}
                    </div>

                    <h3>
                      {avantage.titre}
                    </h3>

                    <p>
                      {avantage.texte}
                    </p>

                  </div>

                )
              )}

            </div>

          </div>

        </section>


        {/* =====================================================
            COMPARAISON
        ===================================================== */}

        <section
          className="reveal in"
          style={{ padding: '5rem 0' }}
        >

          <div className="wrap">

            <div className="packs-head">

              <span className="packs-pill">
                Comparaison
              </span>

              <h2 className="display">
                Trouvez le bon niveau
                <br />
                pour votre projet.
              </h2>

            </div>


            <div className="comparison-table">

              <table>

                <thead>

                  <tr>

                    <th>
                      Fonctionnalité
                    </th>

                    {PLANS.map((plan) => (

                      <th
                        key={plan.id}
                        className={
                          plan.featured
                            ? 'featured-th'
                            : ''
                        }
                      >
                        {plan.nom}
                      </th>

                    ))}

                  </tr>

                </thead>


                <tbody>

                  {COMPARAISON.map(
                    (row, index) => (

                      <tr key={index}>

                        <td>
                          {row.nom}
                        </td>

                        {row.values.map(
                          (value, valueIndex) => (

                            <td
                              key={valueIndex}
                              className={
                                valueIndex === 1
                                  ? 'featured-td'
                                  : ''
                              }
                            >
                              {value}
                            </td>

                          )
                        )}

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>

        </section>


        {/* =====================================================
            FAQ
        ===================================================== */}

        <section
          className="reveal in"
          style={{ padding: '5rem 0' }}
        >

          <div className="wrap">

            <div className="packs-head">

              <span className="packs-pill">
                FAQ
              </span>

              <h2 className="display">
                Questions fréquentes
              </h2>

            </div>


            <div className="faq-list">

              {FAQ_OFFRES.map(
                (item, index) => (

                  <details
                    className="faq-item"
                    key={index}
                  >

                    <summary>
                      {item.q}
                    </summary>

                    <p>
                      {item.r}
                    </p>

                  </details>

                )
              )}

            </div>

          </div>

        </section>


        {/* =====================================================
            CTA FINAL
        ===================================================== */}

        <section
          className="reveal in"
          style={{ padding: '5rem 0' }}
        >

          <div className="wrap">

            <div className="cta-band">

              <h2 className="display">
                Votre projet mérite
                <br />
                mieux qu’un template.
              </h2>

              <p>
                Vous avez une idée, un budget ou simplement
                une envie de créer quelque chose de différent ?
                Parlons-en.
              </p>

              <Link
                href="/contact"
                className="btn light"
              >
                Démarrer un projet
              </Link>

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}