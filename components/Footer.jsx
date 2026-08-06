import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo">
              <span>HOUSAL<small style={{ color: '#9A958A' }}>AGENCY</small></span>
            </div>
            <p>Create. Mark. Impact. Agence de branding et de communication basée à Agadir, Maroc.</p>
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <h4>Navigation</h4>
              <Link href="/">Accueil</Link>
              <Link href="/services">Services</Link>
              <Link href="/portfolio">Portfolio</Link>
              <Link href="/contact">Contact</Link>
            </div>
            <div className="footer-col">
              <h4>Coordonnées</h4>
              <a href="tel:+212606363312">+212 606 36 33 12</a>
              <a href="mailto:contact.housalagency@gmail.com">contact.housalagency@gmail.com</a>
              <p>Agadir, Morocco</p>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Housal Agency. All rights reserved.</span>
          <div className="social-row">
            <a href="#" aria-label="Instagram">IG</a>
            <a href="#" aria-label="LinkedIn">in</a>
            <a href="#" aria-label="Behance">Be</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
