'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase';

export default function Header({ active = 'home', forceDark = false }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // ✅ État pour savoir si admin
  const [loading, setLoading] = useState(true);
  const signupRef = useRef(null);
  const supabase = createSupabaseBrowserClient();

  // ✅ Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAdmin(!!session);
      setLoading(false);
    };
    checkAuth();

    // Écouter les changements d'auth (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

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

  // ✅ Gérer la déconnexion
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setSignupOpen(false);
  };

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
          <Link href="/services" className={`nav-link-wow ${active === 'services' ? 'active' : ''}`}>
            Services
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

          {/* ✅ Afficher le bouton Admin SEULEMENT si l'utilisateur est admin */}
          {!loading && (
            <div className="signup-wrap" ref={signupRef}>
              <button
                type="button"
                className="btn signup-btn"
                onClick={() => setSignupOpen((v) => !v)}
                aria-expanded={signupOpen}
              >
                {isAdmin ? 'Admin' : 'Connexion'}
                <svg 
                  className={`signup-chevron ${signupOpen ? 'rot' : ''}`} 
                  viewBox="0 0 24 24" 
                  width="14" 
                  height="14" 
                  fill="none"
                >
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              
              <div className={`signup-dropdown ${signupOpen ? 'open' : ''}`}>
                {isAdmin ? (
                  // ✅ Menu pour ADMIN connecté
                  <>
                    <Link href="/admin" className="signup-option" onClick={() => setSignupOpen(false)}>
                      <span className="signup-icon">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                          <rect x="3" y="11" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.6" />
                        </svg>
                      </span>
                      <span>
                        <strong>Dashboard</strong>
                        <small>Gérer projets & contenu</small>
                      </span>
                    </Link>
                    <button onClick={handleLogout} className="signup-option" style={{ width: '100%', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer' }}>
                      <span className="signup-icon">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                          <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                          <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                      </span>
                      <span>
                        <strong>Déconnexion</strong>
                        <small>Quitter l&apos;espace admin</small>
                      </span>
                    </button>
                  </>
                ) : (
                  // ✅ Menu pour CLIENT (non connecté)
                  <>
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
                        <strong>Espace Client</strong>
                        <small>Suivez vos projets et demandes</small>
                      </span>
                    </Link>
                    <Link href="/admin/login" className="signup-option" onClick={() => setSignupOpen(false)}>
                      <span className="signup-icon">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                          <rect x="3" y="11" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.6" />
                        </svg>
                      </span>
                      <span>
                        <strong>Espace Admin</strong>
                        <small>Gérer projets, photos &amp; pubs</small>
                      </span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
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