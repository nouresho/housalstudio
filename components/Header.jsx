'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header({ active = 'home', forceDark = false }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <header
      className={`header-floating ${
        scrolled || forceDark ? 'is-scrolled' : ''
      }`}
    >
      <nav className="nav">

        <Link href="/" className="logo logo-wow" onClick={closeMenu}>
          <span>
            HOUSAL
            <small>AGENCY</small>
          </span>
        </Link>

        <div className={`navlinks ${open ? 'open' : ''}`}>
          <Link
            href="/"
            onClick={closeMenu}
            className={`nav-link-wow ${active === 'home' ? 'active' : ''}`}
          >
            Accueil
          </Link>

          <Link
            href="/portfolio"
            onClick={closeMenu}
            className={`nav-link-wow ${active === 'portfolio' ? 'active' : ''}`}
          >
            Portfolio
          </Link>

          <Link
            href="/plans"
            onClick={closeMenu}
            className={`nav-link-wow ${active === 'plans' ? 'active' : ''}`}
          >
            Offres
          </Link>

          <Link
            href="/contact"
            onClick={closeMenu}
            className={`nav-link-wow ${active === 'contact' ? 'active' : ''}`}
          >
            Contact
          </Link>
        </div>

        <button
          type="button"
          className={`burger ${open ? 'active' : ''}`}
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

      </nav>
    </header>
  );
}