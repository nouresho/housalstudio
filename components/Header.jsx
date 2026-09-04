'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

export default function Header({ active = 'home', forceDark = false }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const signupRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (signupRef.current && !signupRef.current.contains(e.target)) {
        setSignupOpen(false);
      }
    };
    document.addEventListener('click', onClickOutside);
    return () => document.removeEventListener('click', onClickOutside);
  }, []);

  return (
    <header className={`header-floating ${(scrolled || forceDark) ? 'is-scrolled' : ''}`}>
      <nav className="nav">
        <Link href="/" className="logo logo-wow">
          <span>HOUSAL<small>AGENCY</small></span>
        </Link>

        <div className={`navlinks ${open ? 'open' : ''}`}>
          <Link href="/" className={`nav-link-wow ${active === 'home' ? 'active' : ''}`}>
            Accueil
          </Link>
          
          <Link href="/portfolio" className={`nav-link-wow ${active === 'portfolio' ? 'active' : ''}`}>
            Portfolio
          </Link>
          <Link href="/plans" className={`nav-link-wow ${active === 'plans' ? 'active' : ''}`}>
            Offres
          </Link>
          <Link href="/contact" className={`nav-link-wow ${active === 'contact' ? 'active' : ''}`}>
            Contact
          </Link>

          <div className="signup-wrap" ref={signupRef}>
            
            <div className={`signup-dropdown ${signupOpen ? 'open' : ''}`}>
              <Link href="/contact" className="signup-option" onClick={() => setSignupOpen(false)}>
                <span className="signup-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </span>
                <span>
                  
                  
                </span>
              </Link>
            </div>
          </div>
        </div>

        <button className="burger" aria-label="Menu" onClick={() => setOpen(!open)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>
    </header>
  );
}