// Section « Nos applications » de l'accueil : ExportAuto et Ocean Palace avec leurs écrans.
const APPS = [
  {
    id: 'exportauto',
    nom: 'ExportAuto',
    secteur: 'Automobile',
    logo: '/images/apps/exportauto-exportauto-logo-white.png',
    accent: '#E62E2D',
    fond: 'linear-gradient(150deg, #17181d 0%, #0b0b0d 60%, #2a0d0d 100%)',
    accroche: "Acheter, faire laver ou vendre sa voiture, depuis une seule app.",
    points: ['30+ écrans', 'Espaces acheteur & vendeur', 'Notifications push'],
    ecrans: ['/images/apps/exportauto-screen-home.jpg', '/images/apps/exportauto-screen-accueil.jpg', '/images/apps/exportauto-screen-lavage.jpg'],
    lien: 'https://exportauto.fr/',
    lien_label: 'Découvrir ExportAuto',
  },
  {
    id: 'ocean-palace',
    nom: 'Ocean Palace',
    secteur: 'Immobilier de prestige',
    logo: '/images/apps/oceanpalace-logo-white.png',
    accent: '#D6A66B',
    fond: 'linear-gradient(150deg, #1b2496 0%, #070e6b 55%, #03062e 100%)',
    accroche: "Trouver son appartement de standing à Agadir et réserver une visite.",
    points: ['Français · English · العربية', 'Espaces client & propriétaire', 'Demandes de visite'],
    ecrans: ['/images/apps/oceanpalace-screen-catalogue.jpg', '/images/apps/oceanpalace-screen-bienvenue.jpg', '/images/apps/oceanpalace-screen-bien.jpg'],
    lien: 'https://oceanpalace.ma/',
    lien_label: 'Découvrir Ocean Palace',
  },
];

export default function AppsShowcase() {
  return (
    <section className="apps-section" aria-labelledby="apps-title">
      <div className="wrap">
        <div className="apps-head">
          <div>
            <div className="eyebrow eyebrow-light">Nouveau · Applications mobiles</div>
            <h2 id="apps-title" className="display apps-title">
              Des marques<br />qui tiennent <span className="apps-title-accent">dans la poche.</span>
            </h2>
          </div>
          <p className="apps-intro">
            Après l&apos;identité et le site, nous concevons et développons aussi des applications
            iOS &amp; Android, connectées aux outils de nos clients.
          </p>
        </div>

        <div className="apps-grid">
          {APPS.map((a) => (
            <article className="app-card" key={a.id} style={{ background: a.fond, '--app-accent': a.accent }}>
              <div className="app-phones" aria-hidden="true">
                {a.ecrans.map((src, i) => (
                  <div className={`app-phone app-phone-${i + 1}`} key={src}>
                    <img src={src} alt="" loading="lazy" />
                  </div>
                ))}
              </div>
              <div className="app-copy">
                <img className="app-logo" src={a.logo} alt={a.nom} loading="lazy" />
                <span className="app-sector">{a.secteur}</span>
                <h3>{a.accroche}</h3>
                <ul>
                  {a.points.map((pt) => <li key={pt}>{pt}</li>)}
                </ul>
                <a className="app-link" href={a.lien} target="_blank" rel="noopener noreferrer">
                  {a.lien_label} <span aria-hidden="true">↗</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
