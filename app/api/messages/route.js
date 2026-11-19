import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createSupabaseServerClient } from '@/lib/supabase-server';

// Messages du formulaire de contact.
// - POST (public) : enregistre la demande et l'envoie par e-mail à Housal.
// - GET / PUT / DELETE : réservés à l'agence (en-tête « Authorization: Bearer <ADMIN_TOKEN> »),
//   pour que personne ne puisse lire les coordonnées des clients.
//
// Variables d'environnement (Vercel → Settings → Environment Variables) :
//   GMAIL_USER          adresse Gmail qui envoie (ex. contact.housalagency@gmail.com)
//   GMAIL_APP_PASSWORD  mot de passe d'application Google (16 caractères)
//   CONTACT_TO          destinataire des demandes (par défaut : GMAIL_USER)
//   ADMIN_TOKEN         jeton pour lire / modifier les messages via l'API

const LIMITES = { name: 120, email: 160, phone: 40, service: 160, message: 4000 };

function nettoyer(v, max) {
  return String(v ?? '').replace(/\u0000/g, '').trim().slice(0, max);
}

function echapperHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function estAdmin(request) {
  const token = process.env.ADMIN_TOKEN;
  return Boolean(token) && request.headers.get('authorization') === `Bearer ${token}`;
}

const refuse = () => NextResponse.json({ error: 'Accès réservé' }, { status: 401 });

async function envoyerEmail(d) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return false;

  const transport = nodemailer.createTransport({ service: 'gmail', auth: { user, pass } });
  const lignes = [
    ['Nom', d.name], ['E-mail', d.email || '—'], ['Téléphone', d.phone || '—'], ['Sujet', d.service || '—'],
  ];
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px">
      <h2 style="color:#1600CF;margin:0 0 12px">Nouvelle demande — site Housal</h2>
      <table style="border-collapse:collapse;width:100%">
        ${lignes.map(([k, v]) => `<tr><td style="padding:6px 10px;color:#666;width:110px">${k}</td><td style="padding:6px 10px"><b>${echapperHtml(v)}</b></td></tr>`).join('')}
      </table>
      <p style="white-space:pre-wrap;background:#FAF6EF;padding:14px;border-radius:10px;margin-top:12px">${echapperHtml(d.message)}</p>
    </div>`;

  await transport.sendMail({
    from: `"Site Housal" <${user}>`,
    to: process.env.CONTACT_TO || user,
    replyTo: d.email || undefined,
    subject: `Nouvelle demande : ${d.service || 'Contact'} — ${d.name}`,
    text: lignes.map(([k, v]) => `${k} : ${v}`).join('\n') + `\n\n${d.message}`,
    html,
  });
  return true;
}

// GET - liste des messages (agence uniquement)
export async function GET(request) {
  if (!estAdmin(request)) return refuse();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST - nouvelle demande (public)
export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Requête invalide' }, { status: 400 }); }

  // Champ piège invisible : rempli seulement par les robots
  if (body.website) return NextResponse.json({ ok: true, saved: false, emailed: false });

  const d = Object.fromEntries(Object.entries(LIMITES).map(([k, max]) => [k, nettoyer(body[k], max)]));
  const canal = body.canal === 'whatsapp' ? 'whatsapp' : 'email';

  if (!d.name || !d.message || (canal === 'email' && !d.email)) {
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
  }
  if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) {
    return NextResponse.json({ error: 'Adresse e-mail invalide' }, { status: 400 });
  }

  // 1. enregistrement dans Supabase (on continue même si ça échoue)
  let saved = false;
  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from('messages').insert({
      nom: d.name,
      email: d.email || null,
      telephone: d.phone || null,
      sujet: `${d.service || 'Demande de contact'}${canal === 'whatsapp' ? ' (WhatsApp)' : ''}`,
      message: d.message,
      statut: 'non-lu',
      lu: false,
    });
    saved = !error;
    if (error) console.error('Supabase :', error.message);
  } catch (e) {
    console.error('Supabase :', e);
  }

  // 2. e-mail à l'agence (si Gmail est configuré)
  let emailed = false;
  try {
    emailed = await envoyerEmail(d);
  } catch (e) {
    console.error('E-mail :', e);
  }

  return NextResponse.json({ ok: true, saved, emailed });
}

// PUT - mise à jour d'un message (agence uniquement)
export async function PUT(request) {
  if (!estAdmin(request)) return refuse();
  const { id, statut, lu, reponse, repondu, repondu_le } = await request.json();
  if (!id) return NextResponse.json({ error: 'ID requis' }, { status: 400 });
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('messages')
    .update({ statut, lu, reponse, repondu, repondu_le })
    .eq('id', id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE - suppression d'un message (agence uniquement)
export async function DELETE(request) {
  if (!estAdmin(request)) return refuse();
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID requis' }, { status: 400 });
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('messages').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
