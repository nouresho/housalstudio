import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServicesSection from '@/components/ServicesSection';
import AppsShowcase from '@/components/AppsShowcase';
import IridescentOrb from '@/components/IridescentOrb';
import ProjectCard from '@/components/ProjectCard';
import { PROJETS, PROJETS_VEDETTE } from '@/lib/projets';

const CHIFFRES = [
  { valeur: `${PROJETS.length}+`, label: 'projets réalisés' },
  { valeur: '2', label: 'applications mobiles' },
  { valeur: '3', label: 'sites en ligne' },
  { valeur: '4', label: 'expertises' },
];

export default function HomePage() {
  return (
    <>
      <Header active="home" />

      <main>

        {/* =========================
            HERO
        ========================== */}
        <section className="hero-wow">

          <div className="hero-wow-bg">
            <div className="hero-wow-top"></div>
            <div className="hero-wow-bottom"></div>
          </div>

          <IridescentOrb className="hero-orb" />

          <h1 className="hero-wow-title" aria-label="HOUSAL">
            <span className="hw-l hw-1">H</span>
            <span className="hw-l hw-2">O</span>
            <span className="hw-l hw-3">U</span>
            <span className="hw-l hw-4">S</span>
            <span className="hw-l hw-5">A</span>
            <span className="hw-l hw-6">L</span>
          </h1>

          <p className="hero-wow-caption">
            Housal Studio conçoit des identités visuelles fortes et des
            stratégies de communication qui marquent les esprits.
          </p>

          <Link href="/contact" className="hero-wow-cta">
            Démarrer un projet <span>→</span>
          </Link>

          <div className="vh-scroll">
            <span>Scroll</span>
            <span className="line"></span>
          </div>

        </section>


        {/* =========================
            RIBBON
        ========================== */}
        <div className="ribbon-wrap">
          <svg
            viewBox="0 0 1200 90"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
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
            CHIFFRES
        ========================== */}
        <section className="stats-strip" aria-label="Housal en chiffres">
          <div className="wrap stats-strip-inner">
            {CHIFFRES.map((c) => (
              <div className="stat" key={c.label}>
                <strong className="irid-text-deep">{c.valeur}</strong>
                <span>{c.label}</span>
              </div>
            ))}
          </div>
        </section>


        {/* =========================
            SERVICES
        ========================== */}
        <ServicesSection />


        {/* =========================
            APPLICATIONS MOBILES
        ========================== */}
        <AppsShowcase />


        {/* =========================
            GALERIE
        ========================== */}
        <section className="block-section block-cream reveal in">

          <div className="wrap">

            <div className="eyebrow">
              Projets récents
            </div>

            <h2
              className="display"
              style={{
                fontSize: 'clamp(28px, 4vw, 42px)',
                margin: '0 0 12px',
              }}
            >
              Nos derniers projets.
            </h2>

            <p
              style={{
                fontSize: 15,
                color: '#5A5A5A',
                maxWidth: 480,
                margin: '0 0 40px',
              }}
            >
              Applications, sites et identités livrés pour nos clients.
            </p>


            {/* =========================
                PROJETS
            ========================== */}
            <div className="gallery-grid">
              {PROJETS_VEDETTE.map((p) => (
                <ProjectCard p={p} key={p.id} visible />
              ))}
            </div>


            {/* =========================
                PORTFOLIO
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

        </section>


        {/* =========================
            CTA
        ========================== */}
        <section className="reveal in">

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

        </section>

      </main>

      <Footer />
    </>
  );
}
//hello