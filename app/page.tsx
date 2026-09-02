import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { createSupabaseServerClient } from '@/lib/supabase-server';

async function getProjets() {
  // ✅ await ici car createSupabaseServerClient est async
  const supabase = await createSupabaseServerClient()
  
  const { data } = await supabase
    .from('projets')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(6)
  
  return data || []
}

export default async function HomePage() {
  const projets = await getProjets()

  return (
    <>
      <Header active="home" />
      <main>
        <div className="video-hero">
          <video autoPlay muted loop playsInline poster="">
            <source src="/UZZAL1.mp4" type="video/mp4" />
          </video>
          <div className="vh-overlay"></div>
          <div className="vh-content">
            <div className="vh-eyebrow">Agence de branding & communication — Agadir</div>
            <h1 className="display vh-title vh-title-anim">
              <span className="d1">H</span>
              <span className="d2">O</span>
              <span className="d3">U</span>
              <span className="d4">S</span>
              <span className="d5">A</span>
              <span className="d6">L</span>
            </h1>
            <p className="vh-sub">
              Housal Agency conçoit des identités visuelles fortes et des stratégies de
              communication qui marquent les esprits. Du logo à l&apos;événement, on construit
              votre marque avec précision.
            </p>
            <div className="vh-ctas">
              <Link href="/services" className="btn btn-lg">Voir nos services</Link>
              <Link
                href="/contact"
                className="btn btn-lg outline"
                style={{ borderColor: 'var(--cream)', color: 'var(--cream)' }}
              >
                Démarrer un projet
              </Link>
            </div>
          </div>
          <div className="vh-scroll"><span>Scroll</span><span className="line"></span></div>
        </div>

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

        <div className="reveal in">
          <div className="wrap">
            <div className="eyebrow">Ce que nous faisons</div>
            <h2 className="display" style={{ fontSize: 'clamp(28px,4vw,42px)', margin: 0 }}>
              Une agence, quatre expertises.
            </h2>

            <div className="what-grid">
              {[
                {
                  title: 'Branding & Identité visuelle',
                  text: "Logo, palette, typographie, guide de marque. Une identité cohérente, du papier à l'écran.",
                  gradId: 'chrome1',
                  stops: ['#FFFFFF', '#E4E8EE', '#A7AEBA', '#5C636E', '#F4F6F9'],
                  dir: ['10%', '0%', '90%', '100%'],
                  highlight: { cx: '32%', cy: '28%' },
                  path: 'M48 38c18-22 54-26 74-8 16 14 12 34 28 44 20 12 30 36 14 52-18 18-46 8-64 18-20 11-46 6-58-14-10-17-2-34-8-52-7-20 0-30 14-40Z',
                },
                {
                  title: 'Marketing & promotion',
                  text: 'Des stratégies efficaces pour booster votre visibilité et votre impact réel.',
                  gradId: 'chrome4',
                  stops: ['#FFFFFF', '#EAEDF1', '#B1B7C1', '#606671', '#F6F8FA'],
                  dir: ['90%', '90%', '10%', '10%'],
                  highlight: { cx: '66%', cy: '32%' },
                  path: 'M70 22c26-6 50 10 56 32 5 18-8 28 2 46 11 20-1 44-24 48-22 4-32-16-54-18-20-2-36-18-34-40 2-20 18-24 22-42 4-16 14-22 32-26Z',
                },
              ].map((card) => (
                <div className="what-card" key={card.title}>
                  <div className="what-card-blob">
                    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id={card.gradId} x1={card.dir[0]} y1={card.dir[1]} x2={card.dir[2]} y2={card.dir[3]}>
                          <stop offset="0%" stopColor={card.stops[0]} />
                          <stop offset="28%" stopColor={card.stops[1]} />
                          <stop offset="52%" stopColor={card.stops[2]} />
                          <stop offset="74%" stopColor={card.stops[3]} />
                          <stop offset="100%" stopColor={card.stops[4]} />
                        </linearGradient>
                        <radialGradient id={`${card.gradId}-glow`} cx={card.highlight.cx} cy={card.highlight.cy} r="55%">
                          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                          <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                        </radialGradient>
                      </defs>
                      <path fill={`url(#${card.gradId})`} d={card.path} />
                      <path fill={`url(#${card.gradId}-glow)`} d={card.path} />
                    </svg>
                  </div>
                  <div className="what-card-body">
                    <h3>{card.title}</h3>
                    <p>{card.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="block-section block-cream reveal in">
          <div className="wrap">
            <div className="eyebrow">Galerie</div>
            <h2 className="display" style={{ fontSize: 'clamp(28px,4vw,42px)', margin: '0 0 12px' }}>
              Nos projets en image.
            </h2>
            <p style={{ fontSize: 15, color: '#5A5A5A', maxWidth: 480, margin: '0 0 40px' }}>
              Une sélection de réalisations, gérée depuis l&apos;interface admin.
            </p>

            <div className="gallery-grid">
              {projets.map((p) => (
                <div className="gallery-item" key={p.id}>
                  <div className="gi-photo">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.titre} />
                    ) : (
                      <div className="ph-placeholder" style={{ borderRadius: 0, position: 'absolute', inset: 0 }}>
                        <span>Photo non définie</span>
                      </div>
                    )}
                    <span className={`gi-badge ${p.mise_en_avant ? 'featured' : ''}`}>
                      {p.categorie || 'Projet'}
                    </span>
                  </div>
                  <div className="gi-body">
                    <h3 className="gi-title">{p.titre}</h3>
                    <div className="gi-meta">
                      <span>{p.client || 'Client'}</span>
                      <span className="dot"></span>
                      <span>{p.date_projet || new Date(p.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="gi-footer">
                      <span className="gi-tag">{p.statut || 'Terminé'}</span>
                      <span className="gi-rating">★ {p.note || '5.0'}</span>
                    </div>
                  </div>
                </div>
              ))}
              {projets.length === 0 && (
                <div className="gallery-item add-tile">
                  <div className="add-tile-inner">
                    <span className="icon">+</span>
                    <span>Aucun projet disponible pour le moment</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="reveal in">
          <div className="wrap">
            <div className="cta-band">
              <h2 className="display">Une marque qui marque vraiment ?</h2>
              <p>Parlons de votre projet. Premier échange gratuit, sans engagement.</p>
              <Link href="/contact" className="btn light">Nous contacter</Link>
            </div>
          </div>
        </div>
      </main>
   
      <Footer />
    </>
  );
}