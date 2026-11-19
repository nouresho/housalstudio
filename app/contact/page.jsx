'use client'
import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// Coordonnées de l'agence
const WHATSAPP = '212604853266'
const TEL_AFFICHE = '+212 604 853 266'
const EMAIL = 'contact.housalagency@gmail.com'
const INSTAGRAM = 'https://www.instagram.com/housal.studio?igsi=MWMwNDhjbDE5c2NuYg%3D%3D'

const VIDE = { nom: '', email: '', telephone: '', sujet: '', message: '', website: '' }

// Texte envoyé sur WhatsApp ou par e-mail
function texteDemande(f) {
  const infos = [
    `Nom : ${f.nom}`,
    f.telephone ? `Téléphone : ${f.telephone}` : null,
    f.email ? `E-mail : ${f.email}` : null,
    f.sujet ? `Sujet : ${f.sujet}` : null,
  ].filter(Boolean)
  return ['Bonjour Housal 👋', '', ...infos, '', f.message].join('\n')
}

export default function Contact() {
  const [formData, setFormData] = useState(VIDE)
  const [loading, setLoading] = useState('')
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  // Sujet pré-rempli depuis la page Offres : /contact?sujet=...
  // (lu après l'affichage, pour que la page reste identique côté serveur et navigateur)
  useEffect(() => {
    const sujet = new URLSearchParams(window.location.search).get('sujet')
    if (!sujet) return
    const id = setTimeout(() => setFormData((f) => (f.sujet ? f : { ...f, sujet: sujet.slice(0, 160) })), 0)
    return () => clearTimeout(id)
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const enregistrer = (canal) => fetch('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: formData.nom,
      email: formData.email,
      phone: formData.telephone,
      service: formData.sujet,
      message: formData.message,
      website: formData.website,
      canal,
    }),
  }).then(async (r) => ({ ok: r.ok, ...(await r.json().catch(() => ({}))) }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const canal = e.nativeEvent.submitter?.value === 'whatsapp' ? 'whatsapp' : 'email'
    setError('')
    setSuccess('')

    if (!formData.nom.trim() || !formData.message.trim()) {
      setError('Merci d’indiquer votre nom et votre message.')
      return
    }

    if (canal === 'whatsapp') {
      // ouvrir WhatsApp pendant le clic, pour éviter le blocage des fenêtres
      const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texteDemande(formData))}`
      const w = window.open(url, '_blank')
      if (w) w.opener = null
      else window.location.href = url
      enregistrer('whatsapp').catch(() => {})
      setSuccess('WhatsApp s’est ouvert avec votre message : il ne vous reste qu’à appuyer sur « Envoyer ».')
      setFormData(VIDE)
      return
    }

    if (!formData.email.trim()) {
      setError('Indiquez votre e-mail pour qu’on puisse vous répondre, ou choisissez WhatsApp.')
      return
    }

    setLoading('email')
    try {
      const res = await enregistrer('email')
      if (!res.ok) throw new Error(res.error || 'Erreur')
      if (res.emailed) {
        setSuccess('Message envoyé ! Nous vous répondrons sous 24 h.')
      } else {
        // envoi automatique indisponible : on ouvre la messagerie du visiteur, message prêt
        const sujet = formData.sujet || 'Demande de contact'
        window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(`${sujet} — ${formData.nom}`)}&body=${encodeURIComponent(texteDemande(formData))}`
        setSuccess('Votre messagerie s’ouvre avec le message prêt : il ne reste qu’à l’envoyer.')
      }
      setFormData(VIDE)
    } catch (err) {
      console.error('Erreur:', err)
      setError(err.message === 'Adresse e-mail invalide'
        ? 'Cette adresse e-mail ne semble pas valide.'
        : 'L’envoi n’a pas fonctionné. Réessayez, ou écrivez-nous directement sur WhatsApp.')
    }
    setLoading('')
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
              Une idée, un besoin, une question ? Remplissez le formulaire et envoyez-le
              sur WhatsApp ou par e-mail : nous vous répondons sous 24 h.
            </p>
          </div>
        </div>

        {/* Split : formulaire + coordonnées */}
        <div className="reveal in">
          <div className="wrap contact-split">
            <div>
              <h2 className="contact-col-title">Envoyez-nous un message</h2>

              {success && <div className="contact-alert contact-alert-ok" role="status">{success}</div>}
              {error && <div className="contact-alert contact-alert-err" role="alert">{error}</div>}

              <form onSubmit={handleSubmit} className="contact-form-minimal" noValidate>
                <div className="cf-field">
                  <label htmlFor="cf-nom">Nom complet *</label>
                  <input id="cf-nom" type="text" name="nom" value={formData.nom} onChange={handleChange} required autoComplete="name" maxLength={120} />
                </div>
                <div className="cf-field">
                  <label htmlFor="cf-tel">Téléphone / WhatsApp</label>
                  <input id="cf-tel" type="tel" name="telephone" value={formData.telephone} onChange={handleChange} autoComplete="tel" maxLength={40} />
                </div>
                <div className="cf-field">
                  <label htmlFor="cf-email">E-mail</label>
                  <input id="cf-email" type="email" name="email" value={formData.email} onChange={handleChange} autoComplete="email" maxLength={160} />
                </div>
                <div className="cf-field">
                  <label htmlFor="cf-sujet">Sujet</label>
                  <input id="cf-sujet" type="text" name="sujet" value={formData.sujet} onChange={handleChange} placeholder="Ex : Demande de devis" maxLength={160} />
                </div>
                <div className="cf-field">
                  <label htmlFor="cf-message">Message *</label>
                  <textarea id="cf-message" name="message" value={formData.message} onChange={handleChange} required rows="4" maxLength={4000} />
                </div>

                {/* champ piège anti-robots, invisible pour les humains */}
                <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
                  <label htmlFor="cf-website">Site web</label>
                  <input id="cf-website" type="text" name="website" value={formData.website} onChange={handleChange} tabIndex={-1} autoComplete="off" />
                </div>

                <div className="contact-send-row">
                  <button type="submit" value="whatsapp" className="btn btn-lg contact-submit contact-submit-wa">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.1 5.1 0 0 0 1.1 2.7 11.7 11.7 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .2-1.2c-.1-.1-.3-.2-.5-.3Z" /></svg>
                    Envoyer sur WhatsApp
                  </button>
                  <button type="submit" value="email" disabled={loading === 'email'} className="btn btn-lg outline contact-submit contact-submit-mail">
                    {loading === 'email' ? 'Envoi en cours…' : 'Envoyer par e-mail →'}
                  </button>
                </div>
                <p className="contact-privacy">Vos informations servent uniquement à vous répondre.</p>
              </form>
            </div>

            <div>
              <h2 className="contact-col-title">Nos coordonnées</h2>
              <a href={`mailto:${EMAIL}`} className="contact-big-mail">{EMAIL}</a>

              <ul className="contact-info-minimal">
                <li><span>Adresse</span><strong>Agadir, Maroc</strong></li>
                <li><span>Téléphone</span><strong><a href={`tel:+${WHATSAPP}`}>{TEL_AFFICHE}</a></strong></li>
                <li><span>WhatsApp</span><strong><a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer">Écrire sur WhatsApp ↗</a></strong></li>
                <li><span>Horaires</span><strong>Lun – Ven · 9h – 18h</strong></li>
              </ul>

              <div className="contact-social-row">
                <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1"/></svg></a>
                <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Z" /></svg></a>
                <a href={`mailto:${EMAIL}`} aria-label="E-mail"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg></a>
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
              <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer">Dites bonjour</a>
            </div>
            <div className="contact-together-nav">
              <a href={`mailto:${EMAIL}`}>E-Mail</a>
              <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
              <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">Instagram</a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
