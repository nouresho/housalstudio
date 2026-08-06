'use client'
import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase' // ✅
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  // ✅ Créer le client browser
  const supabase = createSupabaseBrowserClient()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    })

    setLoading(false)
    if (error) {
      setError('Email ou mot de passe incorrect.')
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          background: #0A0A0A;
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: 'Inter', sans-serif;
        }

        /* ── LEFT PANEL ── */
        .login-left {
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 3rem;
          background: #0D0D0D;
          border-right: 1px solid rgba(232,83,58,0.15);
        }
        .login-left::before {
          content: '';
          position: absolute;
          top: -30%;
          left: -20%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(232,83,58,0.12) 0%, transparent 65%);
          pointer-events: none;
        }
        .login-left::after {
          content: '';
          position: absolute;
          bottom: -10%;
          right: -10%;
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, rgba(232,83,58,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .brand-logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2rem;
          letter-spacing: 4px;
          color: #F7F1E8;
          position: relative;
          z-index: 1;
        }
        .brand-hero {
          position: relative;
          z-index: 1;
        }
        .brand-eyebrow {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.68rem;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #E8533A;
          margin-bottom: 1.5rem;
        }
        .brand-eyebrow::before {
          content: '';
          display: block;
          width: 28px;
          height: 1px;
          background: #E8533A;
        }
        .brand-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(4rem, 8vw, 6.5rem);
          line-height: 0.92;
          letter-spacing: 2px;
          color: #F7F1E8;
          margin-bottom: 1.5rem;
        }
        .brand-title span { color: #E8533A; }
        .brand-desc {
          font-size: 0.88rem;
          color: rgba(247,241,232,0.45);
          line-height: 1.7;
          max-width: 340px;
        }
        .brand-stats {
          display: flex;
          gap: 2.5rem;
          position: relative;
          z-index: 1;
          padding-top: 2rem;
          border-top: 1px solid rgba(247,241,232,0.08);
        }
        .stat-n {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2rem;
          color: #E8533A;
          line-height: 1;
        }
        .stat-l {
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: rgba(247,241,232,0.3);
          margin-top: 0.2rem;
        }

        /* ── RIGHT PANEL ── */
        .login-right {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          background: #0A0A0A;
        }
        .login-box {
          width: 100%;
          max-width: 400px;
        }
        .login-heading {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2.6rem;
          letter-spacing: 2px;
          color: #F7F1E8;
          margin-bottom: 0.4rem;
        }
        .login-sub {
          font-size: 0.82rem;
          color: rgba(247,241,232,0.35);
          margin-bottom: 2.5rem;
          letter-spacing: 0.3px;
        }
        .error-box {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: rgba(232,83,58,0.1);
          border: 1px solid rgba(232,83,58,0.25);
          border-radius: 6px;
          padding: 0.75rem 1rem;
          font-size: 0.82rem;
          color: #E8533A;
          margin-bottom: 1.5rem;
        }
        .field {
          margin-bottom: 1.25rem;
        }
        .field label {
          display: block;
          font-size: 0.7rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(247,241,232,0.4);
          margin-bottom: 0.5rem;
        }
        .field input {
          width: 100%;
          background: rgba(247,241,232,0.04);
          border: 1px solid rgba(247,241,232,0.1);
          border-radius: 8px;
          padding: 0.9rem 1.1rem;
          font-family: 'Inter', sans-serif;
          font-size: 0.88rem;
          color: #F7F1E8;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .field input:focus {
          border-color: #E8533A;
          background: rgba(232,83,58,0.04);
        }
        .field input::placeholder { color: rgba(247,241,232,0.2); }

        .btn-login {
          width: 100%;
          padding: 1rem;
          background: #E8533A;
          border: none;
          border-radius: 8px;
          font-family: 'Inter', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #fff;
          cursor: pointer;
          transition: background 0.2s, opacity 0.2s;
          margin-top: 0.5rem;
        }
        .btn-login:hover:not(:disabled) { background: #C23F28; }
        .btn-login:disabled { opacity: 0.5; cursor: not-allowed; }

        .login-footer {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(247,241,232,0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: rgba(247,241,232,0.2);
        }
        .login-footer span { color: #E8533A; font-weight: 600; }

        @media (max-width: 768px) {
          .login-root { grid-template-columns: 1fr; }
          .login-left { display: none; }
        }
      `}</style>

      <div className="login-root">

        {/* LEFT — Brand panel */}
        <div className="login-left">
          <div className="brand-logo">HOUSAL</div>

          <div className="brand-hero">
            <div className="brand-eyebrow">Agadir · Maroc</div>
            <h1 className="brand-title">
              Build.<br />
              <span>Grow.</span><br />
              Dominate.
            </h1>
            <p className="brand-desc">
              Panneau d&apos;administration HOUSAL. Gérez vos événements, clients et contenus depuis un seul endroit.
            </p>
          </div>

          <div className="brand-stats">
            <div><div className="stat-n">120+</div><div className="stat-l">Événements</div></div>
            <div><div className="stat-n">2.5K</div><div className="stat-l">Participants</div></div>
            <div><div className="stat-n">4</div><div className="stat-l">Univers</div></div>
          </div>
        </div>

        {/* RIGHT — Login form */}
        <div className="login-right">
          <div className="login-box">
            <h2 className="login-heading">Connexion</h2>
            <p className="login-sub">Accès réservé à l&apos;équipe HOUSAL.</p>

            {error && (
              <div className="error-box">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="admin@housal.ma"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label>Mot de passe</label>
                <input
                  type="password"
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn-login" disabled={loading}>
                {loading ? 'Connexion en cours...' : 'Se connecter →'}
              </button>
            </form>

            <div className="login-footer">
              <span>HOUSAL</span> Admin Panel · Agadir 2026
            </div>
          </div>
        </div>

      </div>
    </>
  )
}