'use client'
import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projets: 0,
    evenements: 0,
    messages: 0,
    services: 0,
    plans: 0,
    messagesNonLus: 0
  })
  const [recentProjects, setRecentProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [adminName, setAdminName] = useState('Admin')
  const [showMessages, setShowMessages] = useState(false)
  const [showServices, setShowServices] = useState(false)
  const [showPlans, setShowPlans] = useState(false)
  const [messages, setMessages] = useState([])
  const [services, setServices] = useState([])
  const [plans, setPlans] = useState([])
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [isReplying, setIsReplying] = useState(false)
  
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

  // Formulaires
  const [showServiceForm, setShowServiceForm] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [serviceForm, setServiceForm] = useState({ titre: '', description: '', icon: '', prix: '', duree: '' })
  
  const [showPlanForm, setShowPlanForm] = useState(false)
  const [editingPlan, setEditingPlan] = useState(null)
  const [planForm, setPlanForm] = useState({ nom: '', prix: '', description: '', caracteristiques: [], actif: true })
  const [caractInput, setCaractInput] = useState('')

  const fetchAdminInfo = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user?.user_metadata?.full_name) {
      setAdminName(user.user_metadata.full_name)
    } else if (user?.email) {
      setAdminName(user.email.split('@')[0])
    }
  }

  const fetchDashboardData = async () => {
    setLoading(true)
    
    const [projets, evenements, messages, services, plans] = await Promise.all([
      supabase.from('projets').select('*', { count: 'exact', head: true }),
      supabase.from('evenements').select('*', { count: 'exact', head: true }),
      supabase.from('messages').select('*', { count: 'exact', head: true }),
      supabase.from('services').select('*', { count: 'exact', head: true }).eq('actif', true),
      supabase.from('plans').select('*', { count: 'exact', head: true }).eq('actif', true)
    ])

    const { count: nonLus } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('statut', 'non-lu')

    setStats({
      projets: projets.count || 0,
      evenements: evenements.count || 0,
      messages: messages.count || 0,
      services: services.count || 0,
      plans: plans.count || 0,
      messagesNonLus: nonLus || 0
    })

    const { data: recentProj } = await supabase
      .from('projets')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3)

    setRecentProjects(recentProj || [])
    setLoading(false)
  }

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
    setMessages(data || [])
  }

  const fetchServices = async () => {
    const { data } = await supabase
      .from('services')
      .select('*')
      .order('ordre', { ascending: true })
    setServices(data || [])
  }

  const fetchPlans = async () => {
    const { data } = await supabase
      .from('plans')
      .select('*')
      .order('prix', { ascending: true })
    setPlans(data || [])
  }

  useEffect(() => {
    const loadDashboard = async () => {
      await Promise.all([
        fetchDashboardData(),
        fetchAdminInfo(),
        fetchMessages(),
        fetchServices(),
        fetchPlans()
      ])
    }

    loadDashboard()
  }, [])

  // === GESTION MESSAGES ===
  const markAsRead = async (id) => {
    await supabase.from('messages').update({ statut: 'lu', lu: true }).eq('id', id)
    fetchMessages()
    fetchDashboardData()
  }

  const deleteMessage = async (id) => {
    if (confirm('Supprimer ce message ?')) {
      await supabase.from('messages').delete().eq('id', id)
      fetchMessages()
      fetchDashboardData()
    }
  }

  const sendReply = async (e) => {
    e.preventDefault()
    if (!replyText.trim() || !selectedMessage) return
    
    setIsReplying(true)
    // Ici tu peux intégrer un service d'envoi d'email (Resend, SendGrid, etc.)
    // Pour l'instant on sauvegarde juste la réponse dans la base
    await supabase
      .from('messages')
      .update({ 
        reponse: replyText, 
        repondu: true,
        repondu_le: new Date().toISOString()
      })
      .eq('id', selectedMessage.id)
    
    setReplyText('')
    setSelectedMessage(null)
    setIsReplying(false)
    fetchMessages()
  }

  // === GESTION SERVICES ===
  const saveService = async (e) => {
    e.preventDefault()
    if (editingService) {
      await supabase.from('services').update(serviceForm).eq('id', editingService.id)
    } else {
      await supabase.from('services').insert([{ ...serviceForm, ordre: services.length + 1 }])
    }
    setServiceForm({ titre: '', description: '', icon: '', prix: '', duree: '' })
    setEditingService(null)
    setShowServiceForm(false)
    fetchServices()
    fetchDashboardData()
  }

  const deleteService = async (id) => {
    if (confirm('Supprimer ce service ?')) {
      await supabase.from('services').delete().eq('id', id)
      fetchServices()
      fetchDashboardData()
    }
  }

  // === GESTION PLANS ===
  const addCaracteristique = () => {
    if (caractInput.trim()) {
      setPlanForm({ ...planForm, caracteristiques: [...planForm.caracteristiques, caractInput.trim()] })
      setCaractInput('')
    }
  }

  const removeCaracteristique = (index) => {
    setPlanForm({
      ...planForm,
      caracteristiques: planForm.caracteristiques.filter((_, i) => i !== index)
    })
  }

  const savePlan = async (e) => {
    e.preventDefault()
    if (editingPlan) {
      await supabase.from('plans').update(planForm).eq('id', editingPlan.id)
    } else {
      await supabase.from('plans').insert([planForm])
    }
    setPlanForm({ nom: '', prix: '', description: '', caracteristiques: [], actif: true })
    setCaractInput('')
    setEditingPlan(null)
    setShowPlanForm(false)
    fetchPlans()
    fetchDashboardData()
  }

  const deletePlan = async (id) => {
    if (confirm('Supprimer ce plan ?')) {
      await supabase.from('plans').delete().eq('id', id)
      fetchPlans()
      fetchDashboardData()
    }
  }

  const togglePlanStatus = async (id, actif) => {
    await supabase.from('plans').update({ actif: !actif }).eq('id', id)
    fetchPlans()
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const statCards = [
    { key: 'projets', label: 'Projets', value: stats.projets, icon: '🎯', link: '/admin/projets' },
    { key: 'evenements', label: 'Événements', value: stats.evenements, icon: '🎉', link: '/admin/evenements' },
    { key: 'messages', label: 'Messages', value: stats.messages, icon: '💬', link: '#', badge: stats.messagesNonLus, onClick: () => setShowMessages(!showMessages) },
    { key: 'services', label: 'Services', value: stats.services, icon: '⚡', link: '#', onClick: () => setShowServices(!showServices) },
    { key: 'plans', label: 'Plans', value: stats.plans, icon: '📦', link: '#', onClick: () => setShowPlans(!showPlans) }
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700;800&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        .db-wrap {
          min-height: 100vh;
          background: #F5F0EB;
          font-family: 'Inter', sans-serif;
          display: flex;
          flex-direction: column;
        }

        .db-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 3rem;
          background: #FFFFFF;
          border-bottom: 1px solid rgba(0,0,0,0.04);
          flex-shrink: 0;
          box-shadow: 0 2px 20px rgba(0,0,0,0.02);
        }

        .db-header-left { display: flex; align-items: center; gap: 1.5rem; }
        .db-logo { font-family: 'Bebas Neue', sans-serif; font-size: 2rem; letter-spacing: 3px; color: #1A1A1A; }
        .db-logo span { color: #E8533A; }
        .db-logo small { font-size: 0.6rem; letter-spacing: 2px; color: #C5C5C5; margin-left: 0.5rem; }
        .db-greeting { color: #8A8A8A; font-size: 0.85rem; }
        .db-greeting strong { color: #1A1A1A; }

        .db-header-right { display: flex; align-items: center; gap: 1rem; }
        .db-time { color: #C5C5C5; font-size: 0.75rem; }
        .db-logout { padding: 0.5rem 1.5rem; background: #F5F0EB; color: #5A5A5A; border: none; border-radius: 6px; font-size: 0.75rem; cursor: pointer; transition: all 0.3s; }
        .db-logout:hover { background: #E8533A; color: #fff; }

        .db-body { flex: 1; padding: 2rem 3rem; overflow-y: auto; }

        .db-stats {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: #FFFFFF;
          border-radius: 12px;
          padding: 1.2rem 1.5rem;
          border: 1px solid rgba(0,0,0,0.04);
          transition: all 0.3s;
          cursor: pointer;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.04); }
        .stat-card .stat-icon { font-size: 1.5rem; margin-bottom: 0.3rem; }
        .stat-card .stat-value { font-family: 'Bebas Neue', sans-serif; font-size: 2.2rem; color: #1A1A1A; line-height: 1; }
        .stat-card .stat-label { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 2px; color: #C5C5C5; margin-top: 0.2rem; }
        .stat-card .stat-badge {
          position: absolute; top: -6px; right: -6px;
          background: #E8533A; color: #fff; border-radius: 50%;
          width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;
          font-size: 0.65rem; font-weight: 700;
        }

        /* Section panels */
        .db-section {
          background: #FFFFFF;
          border-radius: 12px;
          border: 1px solid rgba(0,0,0,0.04);
          margin-bottom: 1.5rem;
          overflow: hidden;
        }

        .db-section-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 1.2rem 1.5rem;
          border-bottom: 1px solid rgba(0,0,0,0.04);
          cursor: pointer;
        }
        .db-section-header h3 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.2rem; letter-spacing: 2px; color: #1A1A1A;
        }
        .db-section-header h3 span { color: #E8533A; }
        .db-section-header .badge {
          background: rgba(232,83,58,0.08); color: #E8533A;
          padding: 0.15rem 0.6rem; border-radius: 12px; font-size: 0.7rem;
        }
        .db-section-body { padding: 1.2rem 1.5rem; }

        .db-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }

        /* Messages */
        .msg-item {
          display: flex; align-items: center; gap: 1rem;
          padding: 0.8rem 1rem;
          border-bottom: 1px solid rgba(0,0,0,0.03);
          transition: all 0.3s;
        }
        .msg-item:hover { background: #F5F0EB; }
        .msg-item .msg-avatar {
          width: 40px; height: 40px; border-radius: 50%;
          background: rgba(232,83,58,0.08); color: #E8533A;
          display: flex; align-items: center; justify-content: center;
          font-weight: 600; flex-shrink: 0;
        }
        .msg-item .msg-content { flex: 1; min-width: 0; }
        .msg-item .msg-name { font-size: 0.85rem; font-weight: 600; color: #1A1A1A; }
        .msg-item .msg-text { font-size: 0.8rem; color: #8A8A8A; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .msg-item .msg-date { font-size: 0.6rem; color: #C5C5C5; }
        .msg-item .msg-status {
          padding: 0.15rem 0.6rem; border-radius: 12px; font-size: 0.55rem;
          text-transform: uppercase; letter-spacing: 1px;
        }
        .msg-item .msg-status.non-lu { background: rgba(232,83,58,0.08); color: #E8533A; }
        .msg-item .msg-status.lu { background: rgba(0,0,0,0.04); color: #8A8A8A; }
        .msg-item .msg-actions { display: flex; gap: 0.3rem; }
        .msg-item .msg-actions button {
          background: none; border: none; cursor: pointer; font-size: 0.8rem;
          padding: 0.2rem 0.4rem; border-radius: 4px; transition: all 0.2s;
        }
        .msg-item .msg-actions .reply-btn { color: #E8533A; }
        .msg-item .msg-actions .reply-btn:hover { background: rgba(232,83,58,0.08); }
        .msg-item .msg-actions .delete-btn { color: #C5C5C5; }
        .msg-item .msg-actions .delete-btn:hover { background: rgba(0,0,0,0.04); color: #E8533A; }

        /* Reply modal */
        .reply-modal {
          background: #FFFFFF; border-radius: 12px; padding: 1.5rem;
          border: 1px solid rgba(0,0,0,0.04); margin-top: 1rem;
        }
        .reply-modal textarea {
          width: 100%; padding: 0.75rem; border: 1px solid rgba(0,0,0,0.06);
          border-radius: 8px; font-family: 'Inter', sans-serif; font-size: 0.85rem;
          resize: vertical; min-height: 80px;
        }
        .reply-modal textarea:focus { outline: none; border-color: #E8533A; }
        .reply-modal .reply-actions { display: flex; gap: 0.5rem; margin-top: 0.5rem; }
        .reply-modal .reply-actions button {
          padding: 0.5rem 1.5rem; border: none; border-radius: 6px;
          cursor: pointer; font-size: 0.75rem; font-weight: 600;
        }
        .reply-modal .reply-actions .send { background: #1A1A1A; color: #fff; }
        .reply-modal .reply-actions .send:hover { background: #E8533A; }
        .reply-modal .reply-actions .cancel { background: #F5F0EB; color: #8A8A8A; }

        /* Services & Plans */
        .item-card {
          display: flex; align-items: center; gap: 1rem;
          padding: 0.8rem 1rem; background: #F5F0EB; border-radius: 8px;
          margin-bottom: 0.5rem;
        }
        .item-card .item-icon { font-size: 1.5rem; }
        .item-card .item-info { flex: 1; }
        .item-card .item-info .item-title { font-weight: 600; color: #1A1A1A; }
        .item-card .item-info .item-desc { font-size: 0.8rem; color: #8A8A8A; }
        .item-card .item-actions { display: flex; gap: 0.3rem; }
        .item-card .item-actions button {
          padding: 0.3rem 0.8rem; border: none; border-radius: 4px;
          cursor: pointer; font-size: 0.7rem; transition: all 0.2s;
        }
        .item-card .item-actions .edit { background: rgba(0,0,0,0.04); color: #5A5A5A; }
        .item-card .item-actions .edit:hover { background: #1A1A1A; color: #fff; }
        .item-card .item-actions .delete { background: rgba(232,83,58,0.06); color: #E8533A; }
        .item-card .item-actions .delete:hover { background: #E8533A; color: #fff; }
        .item-card .item-actions .toggle { background: rgba(78,205,196,0.08); color: #4ECDC4; }
        .item-card .item-actions .toggle:hover { background: #4ECDC4; color: #fff; }

        .form-inline {
          display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;
          padding: 1rem; background: #F5F0EB; border-radius: 8px;
          margin-bottom: 1rem;
        }
        .form-inline.full { grid-template-columns: 1fr; }
        .form-inline input, .form-inline select, .form-inline textarea {
          padding: 0.6rem 1rem; border: 1px solid rgba(0,0,0,0.06);
          border-radius: 6px; font-family: 'Inter', sans-serif; font-size: 0.85rem;
          background: #FFFFFF; width: 100%;
        }
        .form-inline input:focus, .form-inline textarea:focus { outline: none; border-color: #E8533A; }
        .form-inline .btn-save {
          padding: 0.6rem 1.5rem; background: #1A1A1A; color: #fff;
          border: none; border-radius: 6px; cursor: pointer; font-weight: 600;
        }
        .form-inline .btn-save:hover { background: #E8533A; }
        .form-inline .btn-cancel-form {
          padding: 0.6rem 1.5rem; background: #F5F0EB; color: #8A8A8A;
          border: none; border-radius: 6px; cursor: pointer;
        }

        .btn-add {
          padding: 0.4rem 1.2rem; background: rgba(232,83,58,0.06);
          color: #E8533A; border: 1px solid rgba(232,83,58,0.08);
          border-radius: 6px; cursor: pointer; font-size: 0.75rem;
          transition: all 0.3s;
        }
        .btn-add:hover { background: rgba(232,83,58,0.1); }

        .tag-group { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.5rem; }
        .tag-group .tag {
          background: rgba(0,0,0,0.04); color: #5A5A5A;
          padding: 0.15rem 0.6rem; border-radius: 12px; font-size: 0.7rem;
          display: flex; align-items: center; gap: 0.3rem;
        }
        .tag-group .tag .remove {
          cursor: pointer; opacity: 0.4; background: none; border: none;
          font-size: 0.8rem;
        }
        .tag-group .tag .remove:hover { opacity: 1; }

        @media (max-width: 1024px) {
          .db-stats { grid-template-columns: repeat(3, 1fr); }
          .db-grid-2 { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .db-header { flex-direction: column; gap: 1rem; padding: 1rem; }
          .db-body { padding: 1rem; }
          .db-stats { grid-template-columns: repeat(2, 1fr); }
          .form-inline { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="db-wrap">
        {/* HEADER */}
        <header className="db-header">
          <div className="db-header-left">
            <div className="db-logo">HOUSAL<span>.</span><small>ADMIN</small></div>
            <div className="db-greeting">👋 Bonjour, <strong>{adminName}</strong></div>
          </div>
          <div className="db-header-right">
            <span className="db-time">{new Date().toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
            <button className="db-logout" onClick={handleLogout}>Déconnexion</button>
          </div>
        </header>

        {/* BODY */}
        <div className="db-body">
          {/* STATS */}
          <div className="db-stats">
            {statCards.map((stat) => (
              <div key={stat.key} className="stat-card" onClick={stat.onClick}>
                {stat.badge && <span className="stat-badge">{stat.badge}</span>}
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* MESSAGES SECTION */}
          {showMessages && (
            <div className="db-section">
              <div className="db-section-header" onClick={() => setShowMessages(false)}>
                <h3>💬 <span>Messages</span> clients</h3>
                <span className="badge">{messages.filter(m => m.statut === 'non-lu').length} non lus</span>
              </div>
              <div className="db-section-body">
                {messages.length === 0 ? (
                  <p style={{ color: '#C5C5C5', textAlign: 'center', padding: '1rem' }}>Aucun message</p>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className="msg-item">
                      <div className="msg-avatar">{msg.nom?.charAt(0) || '?'}</div>
                      <div className="msg-content">
                        <div className="msg-name">{msg.nom || 'Anonyme'} <span className="msg-date">· {new Date(msg.created_at).toLocaleDateString('fr-FR')}</span></div>
                        <div className="msg-text">{msg.message}</div>
                        {msg.reponse && <div style={{ fontSize: '0.75rem', color: '#4ECDC4', marginTop: '0.2rem' }}>✓ Répondu</div>}
                      </div>
                      <span className={`msg-status ${msg.statut === 'non-lu' ? 'non-lu' : 'lu'}`}>
                        {msg.statut === 'non-lu' ? 'Nouveau' : 'Lu'}
                      </span>
                      <div className="msg-actions">
                        {msg.statut === 'non-lu' && (
                          <button className="reply-btn" onClick={() => markAsRead(msg.id)}>📩</button>
                        )}
                        <button className="reply-btn" onClick={() => setSelectedMessage(selectedMessage?.id === msg.id ? null : msg)}>✏️</button>
                        <button className="delete-btn" onClick={() => deleteMessage(msg.id)}>🗑️</button>
                      </div>
                    </div>
                  ))
                )}

                {/* Reply modal */}
                {selectedMessage && (
                  <div className="reply-modal">
                    <h4 style={{ marginBottom: '0.5rem', color: '#1A1A1A' }}>Répondre à {selectedMessage.nom}</h4>
                    <p style={{ fontSize: '0.8rem', color: '#8A8A8A', marginBottom: '0.5rem' }}>&ldquo;{selectedMessage.message}&rdquo;</p>
                    <form onSubmit={sendReply}>
                      <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Votre réponse..." required />
                      <div className="reply-actions">
                        <button type="submit" className="send" disabled={isReplying}>{isReplying ? 'Envoi...' : 'Envoyer'}</button>
                        <button type="button" className="cancel" onClick={() => { setSelectedMessage(null); setReplyText(''); }}>Annuler</button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SERVICES SECTION */}
          {showServices && (
            <div className="db-section">
              <div className="db-section-header" onClick={() => setShowServices(false)}>
                <h3>⚡ <span>Services</span> proposés</h3>
                <button className="btn-add" onClick={(e) => { e.stopPropagation(); setShowServiceForm(!showServiceForm); setEditingService(null); }}>+ Ajouter</button>
              </div>
              <div className="db-section-body">
                {showServiceForm && (
                  <form className="form-inline" onSubmit={saveService}>
                    <input type="text" placeholder="Titre" value={serviceForm.titre} onChange={(e) => setServiceForm({...serviceForm, titre: e.target.value})} required />
                    <input type="text" placeholder="Description" value={serviceForm.description} onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})} />
                    <input type="text" placeholder="Icon (emoji)" value={serviceForm.icon} onChange={(e) => setServiceForm({...serviceForm, icon: e.target.value})} />
                    <input type="text" placeholder="Prix" value={serviceForm.prix} onChange={(e) => setServiceForm({...serviceForm, prix: e.target.value})} />
                    <input type="text" placeholder="Durée" value={serviceForm.duree} onChange={(e) => setServiceForm({...serviceForm, duree: e.target.value})} />
                    <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.5rem' }}>
                      <button type="submit" className="btn-save">{editingService ? 'Modifier' : 'Ajouter'}</button>
                      <button type="button" className="btn-cancel-form" onClick={() => { setShowServiceForm(false); setEditingService(null); setServiceForm({ titre: '', description: '', icon: '', prix: '', duree: '' }); }}>Annuler</button>
                    </div>
                  </form>
                )}
                {services.map((s) => (
                  <div key={s.id} className="item-card">
                    <div className="item-icon">{s.icon || '⚡'}</div>
                    <div className="item-info">
                      <div className="item-title">{s.titre} <span style={{ fontSize: '0.7rem', color: '#8A8A8A' }}>{s.prix && `· ${s.prix}`}</span></div>
                      <div className="item-desc">{s.description}</div>
                    </div>
                    <div className="item-actions">
                      <button className="edit" onClick={() => { setEditingService(s); setServiceForm(s); setShowServiceForm(true); }}>✏️</button>
                      <button className="delete" onClick={() => deleteService(s.id)}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PLANS SECTION */}
          {showPlans && (
            <div className="db-section">
              <div className="db-section-header" onClick={() => setShowPlans(false)}>
                <h3>📦 <span>Plans</span> & Offres</h3>
                <button className="btn-add" onClick={(e) => { e.stopPropagation(); setShowPlanForm(!showPlanForm); setEditingPlan(null); setPlanForm({ nom: '', prix: '', description: '', caracteristiques: [], actif: true }); }}>+ Ajouter</button>
              </div>
              <div className="db-section-body">
                {showPlanForm && (
                  <form className="form-inline" onSubmit={savePlan}>
                    <input type="text" placeholder="Nom du plan" value={planForm.nom} onChange={(e) => setPlanForm({...planForm, nom: e.target.value})} required />
                    <input type="text" placeholder="Prix (ex: 499€)" value={planForm.prix} onChange={(e) => setPlanForm({...planForm, prix: e.target.value})} required />
                    <div className="full">
                      <textarea placeholder="Description" value={planForm.description} onChange={(e) => setPlanForm({...planForm, description: e.target.value})} rows="2" />
                    </div>
                    <div className="full">
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input type="text" placeholder="Caractéristique" value={caractInput} onChange={(e) => setCaractInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCaracteristique())} />
                        <button type="button" className="btn-add" onClick={addCaracteristique}>+</button>
                      </div>
                      <div className="tag-group">
                        {planForm.caracteristiques.map((c, i) => (
                          <span key={i} className="tag">{c} <button type="button" className="remove" onClick={() => removeCaracteristique(i)}>×</button></span>
                        ))}
                      </div>
                    </div>
                    <div className="full">
                      <label style={{ fontSize: '0.75rem', color: '#8A8A8A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input type="checkbox" checked={planForm.actif} onChange={(e) => setPlanForm({...planForm, actif: e.target.checked})} /> Actif
                      </label>
                    </div>
                    <div className="full" style={{ display: 'flex', gap: '0.5rem' }}>
                      <button type="submit" className="btn-save">{editingPlan ? 'Modifier' : 'Ajouter'}</button>
                      <button type="button" className="btn-cancel-form" onClick={() => { setShowPlanForm(false); setEditingPlan(null); setPlanForm({ nom: '', prix: '', description: '', caracteristiques: [], actif: true }); setCaractInput(''); }}>Annuler</button>
                    </div>
                  </form>
                )}
                {plans.map((p) => (
                  <div key={p.id} className="item-card">
                    <div className="item-icon">📦</div>
                    <div className="item-info">
                      <div className="item-title">{p.nom} <span style={{ fontSize: '0.7rem', color: '#E8533A' }}>{p.prix}</span></div>
                      <div className="item-desc">{p.description}</div>
                      <div className="tag-group">
                        {p.caracteristiques?.map((c, i) => <span key={i} className="tag">{c}</span>)}
                      </div>
                    </div>
                    <div className="item-actions">
                      <button className="toggle" onClick={() => togglePlanStatus(p.id, p.actif)}>{p.actif ? 'Actif' : 'Inactif'}</button>
                      <button className="edit" onClick={() => { setEditingPlan(p); setPlanForm(p); setShowPlanForm(true); }}>✏️</button>
                      <button className="delete" onClick={() => deletePlan(p.id)}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RECENT PROJECTS */}
          <div className="db-grid-2">
            <div className="db-section">
              <div className="db-section-header">
                <h3>🎯 <span>Derniers</span> projets</h3>
                <Link href="/admin/projets" style={{ fontSize: '0.7rem', color: '#C5C5C5', textDecoration: 'none' }}>Voir tout →</Link>
              </div>
              <div className="db-section-body">
                {loading ? <p style={{ color: '#C5C5C5' }}>Chargement...</p> : recentProjects.length > 0 ? recentProjects.map((p) => (
                  <div key={p.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                    <div style={{ fontWeight: 600, color: '#1A1A1A' }}>{p.titre}</div>
                    <div style={{ fontSize: '0.7rem', color: '#C5C5C5' }}>{p.categorie || 'Non catégorisé'}</div>
                  </div>
                )) : <p style={{ color: '#C5C5C5' }}>Aucun projet</p>}
              </div>
            </div>

            <div className="db-section">
              <div className="db-section-header">
                <h3>📊 <span>Rapide</span></h3>
              </div>
              <div className="db-section-body">
                <Link href="/admin/projets/nouveau">
                  <button style={{ width: '100%', padding: '0.8rem', marginBottom: '0.5rem', background: '#1A1A1A', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>+ Nouveau projet</button>
                </Link>
                <button style={{ width: '100%', padding: '0.8rem', background: '#F5F0EB', color: '#1A1A1A', border: 'none', borderRadius: '6px', cursor: 'pointer' }} onClick={() => setShowMessages(true)}>📩 Voir les messages</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}