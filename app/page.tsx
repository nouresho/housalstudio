import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServicesSection from '@/components/ServicesSection';

const projets = [
  {
    id: 'p1',
    titre: 'Elara — Skincare',
    categorie: 'BRANDING',
    image_url: '/images/elara.png',
    client: 'Elara',
    date_projet: '2026',
    statut: 'Projet personnel · Branding complet',
    note: '5.0',
  },
  {
    id: 'p2',
    titre: 'Flour Lab — Boulangerie',
    categorie: 'WEB & IDENTITÉ',
    image_url: '/images/floorlab.png',
    client: 'Flour Lab',
    date_projet: '2026',
    statut: 'Projet personnel · Web & Identité',
    note: '5.0',
  },
];

export default function HomePage() {
  return (
    <>
      <Header active="home" />

      <main>

        {/* =========================
            HERO
        ========================== */}
        <div className="video-hero">
         

          <div className="vh-overlay"></div>

          <div className="vh-content">

            <div className="vh-eyebrow">
              Agence de branding & communication — Agadir
            </div>

            <h1 className="display vh-title vh-title-anim">
              <span className="d1">H</span>
              <span className="d2">O</span>
              <span className="d3">U</span>
              <span className="d4">S</span>
              <span className="d5">A</span>
              <span className="d6">L</span>
            </h1>

            <p className="vh-sub">
              Housal Agency conçoit des identités visuelles fortes et des
              stratégies de communication qui marquent les esprits. Du logo à
              l&apos;événement, on construit votre marque avec précision.
            </p>

            <div className="vh-ctas">
              <Link
                href="/contact"
                className="btn btn-lg outline"
                style={{
                  borderColor: 'var(--cream)',
                  color: 'var(--cream)',
                }}
              >
                Démarrer un projet
              </Link>
            </div>

          </div>

          <div className="vh-scroll">
            <span>Scroll</span>
            <span className="line"></span>
          </div>
        </div>


        {/* =========================
            RIBBON
        ========================== */}
        <div className="ribbon-wrap">
          <svg viewBox="0 0 1200 90" preserveAspectRatio="none">
            <path
              d="M0,45 C150,90 250,0 400,45 C550,90 650,0 800,45 C950,90 1050,0 1200,45"
              fill="none"
              stroke="var(--orange)"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>
        </div>


        {/* =========================
            SERVICES
        ========================== */}
        <ServicesSection />


        {/* =========================
            GALERIE
        ========================== */}
        <div className="block-section block-cream reveal in">

          <div className="wrap">

            <div className="eyebrow">
              Galerie
            </div>

            <h2
              className="display"
              style={{
                fontSize: 'clamp(28px,4vw,42px)',
                margin: '0 0 12px',
              }}
            >
              Nos projets en image.
            </h2>

            <p
              style={{
                fontSize: 15,
                color: '#5A5A5A',
                maxWidth: 480,
                margin: '0 0 40px',
              }}
            >
              Une sélection de nos réalisations.
            </p>


            {/* =========================
                2 PROJETS
            ========================== */}
            <div className="gallery-grid">

              {projets.map((p) => (

                <div
                  className="gallery-item visible"
                  key={p.id}
                >

                  <div className="gi-photo">

                    <img
                      src={p.image_url}
                      alt={p.titre}
                    />

                    <span className="gi-badge">
                      {p.categorie}
                    </span>

                  </div>


                  <div className="gi-body">

                    <h3 className="gi-title">
                      {p.titre}
                    </h3>


                    <div className="gi-meta">

                      <span>
                        {p.client}
                      </span>

                      <span className="dot"></span>

                      <span>
                        {p.date_projet}
                      </span>

                    </div>


                    <div className="gi-footer">

                      <span className="gi-tag">
                        {p.statut}
                      </span>

                      <span className="gi-rating">
                        ★ {p.note}
                      </span>

                    </div>

                  </div>

                </div>

              ))}

            </div>


            {/* =========================
                BOUTON PORTFOLIO
            ========================== */}
            <div className="portfolio-explore">

              <Link
                href="/portfolio"
                className="btn"
              >
                Explorer le portfolio →
              </Link>

            </div>

          </div>

        </div>


        {/* =========================
            CTA
        ========================== */}
        <div className="reveal in">

          <div className="wrap">

            <div className="cta-band">

              <h2 className="display">
                Une marque qui marque vraiment ?
              </h2>

              <p>
                Parlons de votre projet. Premier échange gratuit,
                sans engagement.
              </p>

              <Link
                href="/contact"
                className="btn light"
              >
                Nous contacter
              </Link>

            </div>

          </div>

        </div>

      </main>

      <Footer />
    </>
  );
}