'use client'
import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Contact() {
  const [formData, setFormData] = useState({
    nom: '', email: '', telephone: '', sujet: '', message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.nom,
          email: formData.email,
          phone: formData.telephone,
          service: formData.sujet,
          message: formData.message
        })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Une erreur est survenue')

      setSuccess(true)
      setFormData({ nom: '', email: '', telephone: '', sujet: '', message: '' })
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
        {/* Hero */}
        <div className="contact-hero-alt">
          <div className="wrap">
            <div className="eyebrow">Contact</div>
            <h1 className="display contact-hero-title">Parlons de<br />votre projet.</h1>
            <p className="contact-hero-sub">
              Une idée, un besoin, une question ? Remplissez le formulaire et nous vous répondrons sous 24h.
            </p>
          </div>
        </div>

        {/* Split : form + coordonnées, sans cartes */}
        <div className="reveal in">
          <div className="wrap contact-split">
            <div>
              <h2 className="contact-col-title">Envoyez-nous un message</h2>

              {success && <div className="contact-alert contact-alert-ok">Message envoyé avec succès ! Nous vous répondrons rapidement.</div>}
              {error && <div className="contact-alert contact-alert-err">{error}</div>}

              <form onSubmit={handleSubmit} className="contact-form-minimal">
                <div className="cf-field">
                  <label>Nom complet *</label>
                  <input type="text" name="nom" value={formData.nom} onChange={handleChange} required />
                </div>
                <div className="cf-field">
                  <label>Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="cf-field">
                  <label>Téléphone</label>
                  <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} />
                </div>
                <div className="cf-field">
                  <label>Sujet</label>
                  <input type="text" name="sujet" value={formData.sujet} onChange={handleChange} placeholder="Ex : Demande de devis" />
                </div>
                <div className="cf-field">
                  <label>Message *</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} required rows="4" />
                </div>

                <button type="submit" disabled={loading} className="btn btn-lg contact-submit">
                  {loading ? 'Envoi en cours...' : 'Envoyer le message →'}
                </button>
              </form>
            </div>

            <div>
              <h2 className="contact-col-title">Nos coordonnées</h2>
              <a href="mailto:contact@housal.ma" className="contact-big-mail">contact@housal.ma</a>

              <ul className="contact-info-minimal">
                <li><span>Adresse</span><strong>Agadir, Maroc</strong></li>
                <li><span>Téléphone</span><strong>+212 6 12 34 56 78</strong></li>
                <li><span>Horaires</span><strong>Lun – Ven · 9h – 18h</strong></li>
              </ul>

              <div className="contact-social-row">
                <a href="https://www.instagram.com/housal.studio?igsi=MWMwNDhjbDE5c2NuYg%3D%3D" aria-label="Instagram"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1"/></svg></a>
                <a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7 10v7M7 7v.01M11 17v-4.5a2 2 0 0 1 4 0V17M11 12.5V17" strokeLinecap="round"/></svg></a>
                <a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15 8h2V5h-2a4 4 0 0 0-4 4v2H9v3h2v6h3v-6h2.5l.5-3H14V9a1 1 0 0 1 1-1Z" strokeLinejoin="round"/></svg></a>
              </div>
            </div>
          </div>
        </div>

        {/* Bande sombre "Travaillons ensemble" */}
        <div className="contact-together-band">
          <div className="wrap">
            <h2 className="display contact-together-title">Travaillons<br />ensemble<span className="accent">.</span></h2>
            <div className="contact-together-row">
              <span>Un projet en tête ?</span>
              <span className="contact-together-line"></span>
              <a href="mailto:contact@housal.ma">Dites bonjour</a>
            </div>
            <div className="contact-together-nav">
              <a href="mailto:contact@housal.ma">E-Mail</a>
              <a href="https://www.instagram.com/housal.studio?igsi=MWMwNDhjbDE5c2NuYg%3D%3D">Instagram</a>
              <a href="#">LinkedIn</a>
              <a href="#">Facebook</a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}