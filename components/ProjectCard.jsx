// Carte projet partagée par l'accueil et la page Portfolio.
export default function ProjectCard({ p, visible = false }) {
  return (
    <article className={`gallery-item gallery-item-${p.variant || 'housal-1'} ${visible ? 'visible' : ''}`}>
      <div className="gi-photo" style={{ background: p.image_background }}>
        <img
          src={p.image_url}
          alt={p.titre}
          loading="lazy"
          className={p.image_fit === 'contain' ? 'gi-image-contain' : undefined}
          style={{ objectFit: p.image_fit || 'cover' }}
        />
        <span className={`gi-badge gi-badge-${p.variant}`}>{p.categorie || 'Projet'}</span>
      </div>
      <div className="gi-body">
        <div className="gi-meta">
          <span>{p.client}</span>
          {p.date_projet && <>
            <span className="dot"></span>
            <span>{p.date_projet}</span>
          </>}
        </div>
        <h3 className="gi-title">{p.titre}</h3>
        {p.description && <p className="gi-desc">{p.description}</p>}
        <div className="gi-footer">
          <span className="gi-tag">{p.statut || 'Terminé'}</span>
          {p.lien && (
            <a className="gi-project-link" href={p.lien} target="_blank" rel="noopener noreferrer"
              aria-label={`${p.lien_label || 'Voir le projet'} : ${p.titre} (nouvel onglet)`}>
              {p.lien_label || 'Voir le projet'} <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
