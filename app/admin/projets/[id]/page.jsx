'use client'
import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function ProjetForm() {
  const [titre, setTitre] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [existingImage, setExistingImage] = useState('')
  const [categorie, setCategorie] = useState('branding')
  const [statut, setStatut] = useState('termine')
  const [client, setClient] = useState('')
  const [dateProjet, setDateProjet] = useState('')
  const [lienDemo, setLienDemo] = useState('')
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [technologies, setTechnologies] = useState([])
  const [techInput, setTechInput] = useState('')
  const [temoignage, setTemoignage] = useState('')
  const [nomClient, setNomClient] = useState('')
  
  const router = useRouter()
  const params = useParams()
  const id = params.id
  const isNew = id === 'nouveau'
  const supabase = createSupabaseBrowserClient()

  const fetchProjet = async () => {
    const { data } = await supabase.from('projets').select('*').eq('id', id).single()
    if (data) {
      setTitre(data.titre || '')
      setDescription(data.description || '')
      setExistingImage(data.image_url || '')
      setCategorie(data.categorie || 'branding')
      setStatut(data.statut || 'termine')
      setClient(data.client || '')
      setDateProjet(data.date_projet || '')
      setLienDemo(data.lien_demo || '')
      setTags(data.tags || [])
      setTechnologies(data.technologies || [])
      setTemoignage(data.temoignage || '')
      setNomClient(data.nom_client || '')
    }
  }

  useEffect(() => {
    if (isNew) return

    let mounted = true

    const loadProjet = async () => {
      const { data } = await supabase.from('projets').select('*').eq('id', id).single()

      if (!mounted || !data) return

      setTitre(data.titre || '')
      setDescription(data.description || '')
      setExistingImage(data.image_url || '')
      setCategorie(data.categorie || 'branding')
      setStatut(data.statut || 'termine')
      setClient(data.client || '')
      setDateProjet(data.date_projet || '')
      setLienDemo(data.lien_demo || '')
      setTags(data.tags || [])
      setTechnologies(data.technologies || [])
      setTemoignage(data.temoignage || '')
      setNomClient(data.nom_client || '')
    }

    loadProjet()

    return () => {
      mounted = false
    }
  }, [id, isNew, supabase])

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleAddTech = () => {
    if (techInput.trim() && !technologies.includes(techInput.trim())) {
      setTechnologies([...technologies, techInput.trim()])
      setTechInput('')
    }
  }

  const handleRemoveTech = (techToRemove) => {
    setTechnologies(technologies.filter(tech => tech !== techToRemove))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    let imageUrl = existingImage

    if (image) {
      const fileExt = image.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      
      const { error } = await supabase.storage
        .from('projets')
        .upload(fileName, image)

      if (!error) {
        const { data: { publicUrl } } = supabase.storage
          .from('projets')
          .getPublicUrl(fileName)
        imageUrl = publicUrl
      } else {
        alert('Erreur lors de l\'upload de l\'image')
        setLoading(false)
        return
      }
    }

    const projetData = { 
      titre, 
      description, 
      image_url: imageUrl,
      categorie,
      statut,
      client,
      date_projet: dateProjet,
      lien_demo: lienDemo,
      tags,
      technologies,
      temoignage,
      nom_client: nomClient
    }

    if (isNew) {
      await supabase.from('projets').insert([projetData])
    } else {
      await supabase.from('projets').update(projetData).eq('id', id)
    }

    setLoading(false)
    router.push('/admin')
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .form-wrap {
          min-height: 100vh;
          background: #F5F0EB;
          font-family: 'Inter', sans-serif;
          display: flex;
          flex-direction: column;
          padding: 0;
          margin: 0;
          overflow: hidden;
        }

        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 3rem;
          background: #FFFFFF;
          border-bottom: 1px solid rgba(0, 0, 0, 0.04);
          flex-shrink: 0;
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.02);
        }

        .form-header-left {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .form-logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.8rem;
          letter-spacing: 3px;
          color: #1A1A1A;
        }
        .form-logo span {
          color: #E8533A;
        }

        .form-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.5rem;
          letter-spacing: 2px;
          color: #8A8A8A;
        }
        .form-title strong {
          color: #1A1A1A;
        }

        .btn-back {
          padding: 0.4rem 1.2rem;
          background: #F5F0EB;
          color: #5A5A5A;
          border: 1px solid rgba(0, 0, 0, 0.04);
          border-radius: 6px;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.3s;
          text-decoration: none;
          letter-spacing: 0.5px;
        }
        .btn-back:hover {
          background: #E8533A;
          color: #FFFFFF;
          border-color: #E8533A;
        }

        .form-body {
          flex: 1;
          padding: 1.5rem 3rem 2rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        .form-body::-webkit-scrollbar {
          width: 4px;
        }
        .form-body::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.02);
        }
        .form-body::-webkit-scrollbar-thumb {
          background: rgba(232, 83, 58, 0.2);
          border-radius: 10px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1.2rem;
          flex: 1;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .form-group.full {
          grid-column: 1 / -1;
        }
        .form-group.half {
          grid-column: span 2;
        }

        .form-group label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #8A8A8A;
          font-weight: 600;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 8px;
          padding: 0.6rem 1rem;
          color: #1A1A1A;
          font-size: 0.85rem;
          transition: all 0.3s;
          font-family: 'Inter', sans-serif;
          width: 100%;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.01);
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #E8533A;
          box-shadow: 0 0 0 3px rgba(232, 83, 58, 0.05);
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: #C5C5C5;
        }

        .form-group select {
          appearance: none;
          cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M6 8L1 3h10z' fill='%238A8A8A'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
        }
        .form-group select option {
          background: #FFFFFF;
          color: #1A1A1A;
        }

        .form-group textarea {
          resize: none;
          min-height: 60px;
        }

        .tag-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          padding: 0.3rem 0;
        }

        .tag {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: rgba(232, 83, 58, 0.06);
          color: #E8533A;
          padding: 0.15rem 0.7rem;
          border-radius: 16px;
          font-size: 0.7rem;
          border: 1px solid rgba(232, 83, 58, 0.08);
        }

        .tag-remove {
          cursor: pointer;
          opacity: 0.4;
          transition: opacity 0.2s;
          background: none;
          border: none;
          color: #E8533A;
          font-size: 0.9rem;
          padding: 0 0.1rem;
        }
        .tag-remove:hover {
          opacity: 1;
        }

        .tag-input-group {
          display: flex;
          gap: 0.4rem;
        }
        .tag-input-group input {
          flex: 1;
        }

        .btn-add-tag {
          padding: 0.6rem 1rem;
          background: rgba(232, 83, 58, 0.06);
          color: #E8533A;
          border: 1px solid rgba(232, 83, 58, 0.08);
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.7rem;
          transition: all 0.3s;
          white-space: nowrap;
        }
        .btn-add-tag:hover {
          background: rgba(232, 83, 58, 0.1);
        }

        .image-preview {
          margin-top: 0.3rem;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid rgba(0, 0, 0, 0.04);
          max-width: 120px;
        }
        .image-preview img {
          width: 100%;
          height: 80px;
          object-fit: cover;
        }

        .file-input {
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 6px;
          padding: 0.5rem;
          color: #5A5A5A;
          font-size: 0.75rem;
          width: 100%;
          cursor: pointer;
        }
        .file-input::-webkit-file-upload-button {
          background: rgba(232, 83, 58, 0.06);
          color: #E8533A;
          border: none;
          padding: 0.3rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.7rem;
          margin-right: 0.5rem;
        }

        .form-hint {
          color: #C5C5C5;
          font-size: 0.6rem;
          letter-spacing: 0.5px;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          padding-top: 1.2rem;
          margin-top: 0.5rem;
          border-top: 1px solid rgba(0, 0, 0, 0.04);
          grid-column: 1 / -1;
          justify-content: flex-end;
        }

        .btn-submit {
          padding: 0.7rem 2.5rem;
          background: #1A1A1A;
          color: #FFFFFF;
          border: none;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s;
        }
        .btn-submit:hover:not(:disabled) {
          background: #E8533A;
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(232, 83, 58, 0.15);
        }
        .btn-submit:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .btn-cancel {
          padding: 0.7rem 1.8rem;
          background: #F5F0EB;
          color: #5A5A5A;
          border: 1px solid rgba(0, 0, 0, 0.04);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 0.8rem;
        }
        .btn-cancel:hover {
          background: rgba(0, 0, 0, 0.04);
          color: #1A1A1A;
        }

        @media (max-width: 1024px) {
          .form-grid {
            grid-template-columns: 1fr 1fr;
          }
          .form-group.full {
            grid-column: 1 / -1;
          }
          .form-group.half {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 768px) {
          .form-header {
            padding: 1rem 1.5rem;
            flex-wrap: wrap;
            gap: 0.5rem;
          }
          .form-body {
            padding: 1rem 1.5rem;
          }
          .form-grid {
            grid-template-columns: 1fr;
          }
          .form-group.full {
            grid-column: 1;
          }
          .form-title {
            font-size: 1rem;
          }
          .form-actions {
            flex-wrap: wrap;
            justify-content: center;
          }
          .btn-submit {
            width: 100%;
          }
          .btn-cancel {
            width: 100%;
          }
        }
      `}</style>

      <div className="form-wrap">
        {/* HEADER */}
        <header className="form-header">
          <div className="form-header-left">
            <div className="form-logo">HOUSAL<span>.</span></div>
            <h1 className="form-title">
              <strong>{isNew ? 'Nouveau' : 'Modifier'}</strong> Projet
            </h1>
          </div>
          <Link href="/admin" className="btn-back">✕ Fermer</Link>
        </header>

        {/* BODY */}
        <div className="form-body">
          <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div className="form-grid">
              {/* Titre */}
              <div className="form-group full">
                <label>Titre du projet</label>
                <input
                  type="text"
                  value={titre}
                  onChange={(e) => setTitre(e.target.value)}
                  placeholder="Ex: Refonte identité visuelle HOUSAL"
                  required
                />
              </div>

              {/* Catégorie */}
              <div className="form-group">
                <label>Catégorie</label>
                <select value={categorie} onChange={(e) => setCategorie(e.target.value)}>
                  <option value="branding">Branding</option>
                  <option value="events">Events</option>
                  <option value="marketing">Marketing</option>
                  <option value="web">Développement Web</option>
                  <option value="design">Design</option>
                </select>
              </div>

              {/* Statut */}
              <div className="form-group">
                <label>Statut</label>
                <select value={statut} onChange={(e) => setStatut(e.target.value)}>
                  <option value="termine">Terminé</option>
                  <option value="en-cours">En cours</option>
                  <option value="planifie">Planifié</option>
                  <option value="en-attente">En attente</option>
                </select>
              </div>

              {/* Client */}
              <div className="form-group">
                <label>Client</label>
                <input
                  type="text"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="Nom du client"
                />
              </div>

              {/* Date */}
              <div className="form-group">
                <label>Date du projet</label>
                <input
                  type="date"
                  value={dateProjet}
                  onChange={(e) => setDateProjet(e.target.value)}
                />
              </div>

              {/* Lien demo */}
              <div className="form-group">
                <label>Lien démo</label>
                <input
                  type="url"
                  value={lienDemo}
                  onChange={(e) => setLienDemo(e.target.value)}
                  placeholder="https://..."
                />
              </div>

              {/* Description */}
              <div className="form-group full">
                <label>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez le projet, les objectifs, les résultats..."
                  rows="2"
                />
              </div>

              {/* Tags */}
              <div className="form-group half">
                <label>Tags / Mots-clés</label>
                <div className="tag-input-group">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Ex: Branding, Luxe..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  />
                  <button type="button" className="btn-add-tag" onClick={handleAddTag}>
                    + Ajouter
                  </button>
                </div>
                <div className="tag-container">
                  {tags.map((tag, index) => (
                    <span key={index} className="tag">
                      #{tag}
                      <button type="button" className="tag-remove" onClick={() => handleRemoveTag(tag)}>
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Technologies */}
              <div className="form-group half">
                <label>Technologies</label>
                <div className="tag-input-group">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    placeholder="Ex: React, Next.js..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                  />
                  <button type="button" className="btn-add-tag" onClick={handleAddTech}>
                    + Ajouter
                  </button>
                </div>
                <div className="tag-container">
                  {technologies.map((tech, index) => (
                    <span key={index} className="tag" style={{ background: 'rgba(0,0,0,0.04)', color: '#1A1A1A' }}>
                      {tech}
                      <button type="button" className="tag-remove" onClick={() => handleRemoveTech(tech)}>
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Image */}
              <div className="form-group full">
                <label>Image du projet</label>
                {existingImage && (
                  <div className="image-preview">
                    <img src={existingImage} alt="Aperçu" />
                  </div>
                )}
                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                  accept="image/*"
                  className="file-input"
                />
                <span className="form-hint">Laissez vide pour conserver l&apos;image actuelle</span>
              </div>

              {/* Témoignage */}
              <div className="form-group half">
                <label>Témoignage client</label>
                <textarea
                  value={temoignage}
                  onChange={(e) => setTemoignage(e.target.value)}
                  placeholder="Retour du client..."
                  rows="2"
                />
              </div>

              {/* Nom du témoin */}
              <div className="form-group">
                <label>Nom du témoin</label>
                <input
                  type="text"
                  value={nomClient}
                  onChange={(e) => setNomClient(e.target.value)}
                  placeholder="Ex: Jean Dupont, CEO"
                />
              </div>

              {/* Actions */}
              <div className="form-actions">
                <Link href="/admin">
                  <button type="button" className="btn-cancel">Annuler</button>
                </Link>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? 'Enregistrement...' : isNew ? 'Créer le projet' : 'Mettre à jour'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}