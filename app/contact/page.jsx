'use client'
import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Contact() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    sujet: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  
  const supabase = createSupabaseBrowserClient()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.nom,
          email: formData.email,
          phone: formData.telephone,
          service: formData.sujet,
          message: formData.message
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue')
      }

      setSuccess(true)
      setFormData({
        nom: '',
        email: '',
        telephone: '',
        sujet: '',
        message: ''
      })
      
      setTimeout(() => setSuccess(false), 5000)
      
    } catch (err) {
      console.error('Erreur:', err)
      setError('Une erreur est survenue, réessayez ou appelez-nous directement.')
    }
    
    setLoading(false)
  }

  return (
    <>
      <Header active="contact" forceDark />
      <main>
        <div className="page-hero" style={{ minHeight: '30vh' }}>
          <div className="wrap">
            <div className="eyebrow">Contact</div>
            <h1 className="display">Parlons de votre projet</h1>
            <p>Une idée, un besoin, une question ? Remplissez le formulaire et nous vous répondrons sous 24h.</p>
          </div>
        </div>

        <div className="reveal in">
          <div className="wrap">
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '4rem',
              maxWidth: '1100px',
              margin: '0 auto',
              padding: '2rem 0'
            }}>
              {/* Formulaire */}
              <div>
                <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.8rem', marginBottom: '1.5rem' }}>
                  Envoyez-nous un message
                </h2>

                {success && (
                  <div style={{
                    background: '#d4edda',
                    color: '#155724',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1.5rem',
                    border: '1px solid #c3e6cb'
                  }}>
                    ✅ Message envoyé avec succès ! Nous vous répondrons rapidement.
                  </div>
                )}

                {error && (
                  <div style={{
                    background: '#f8d7da',
                    color: '#721c24',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1.5rem',
                    border: '1px solid #f5c6cb'
                  }}>
                    ❌ {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#555', marginBottom: '0.3rem' }}>
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#555', marginBottom: '0.3rem' }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#555', marginBottom: '0.3rem' }}>
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#555', marginBottom: '0.3rem' }}>
                      Sujet
                    </label>
                    <input
                      type="text"
                      name="sujet"
                      value={formData.sujet}
                      onChange={handleChange}
                      placeholder="Ex: Demande de devis"
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#555', marginBottom: '0.3rem' }}>
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        resize: 'vertical',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: loading ? '#ccc' : '#1A1A1A',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'background 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) e.currentTarget.style.background = '#E8533A'
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) e.currentTarget.style.background = '#1A1A1A'
                    }}
                  >
                    {loading ? 'Envoi en cours...' : 'Envoyer le message →'}
                  </button>
                </form>
              </div>

              {/* Infos contact */}
              <div>
                <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.8rem', marginBottom: '1.5rem' }}>
                  Nos coordonnées
                </h2>

                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>📍</span>
                    <div>
                      <div style={{ fontWeight: '600' }}>Adresse</div>
                      <div style={{ color: '#666' }}>Agadir, Maroc</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>📧</span>
                    <div>
                      <div style={{ fontWeight: '600' }}>Email</div>
                      <div style={{ color: '#666' }}>contact@uzzal.ma</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>📞</span>
                    <div>
                      <div style={{ fontWeight: '600' }}>Téléphone</div>
                      <div style={{ color: '#666' }}>+212 6 12 34 56 78</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>⏰</span>
                    <div>
                      <div style={{ fontWeight: '600' }}>Horaires</div>
                      <div style={{ color: '#666' }}>Lun - Ven : 9h - 18h</div>
                    </div>
                  </div>
                </div>

                <div style={{
                  background: '#f5f0eb',
                  padding: '1.5rem',
                  borderRadius: '8px'
                }}>
                  <p style={{ margin: 0, color: '#555', fontSize: '0.9rem', lineHeight: '1.6' }}>
                    <strong>💡 Réponse garantie sous 24h</strong>
                    <br />
                    Nous traitons toutes les demandes dans les plus brefs délais.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}