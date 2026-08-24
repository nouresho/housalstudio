import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

// GET - Fetch all messages (public)
export async function GET(request) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST - Create new message (public)
export async function POST(request) {
  const body = await request.json();
  const { name, email, phone, service, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from('messages').insert({
    nom: name,
    email,
    telephone: phone || null,
    sujet: service || 'Demande de contact',
    message,
    statut: 'non-lu',
    lu: false
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

// PUT - Update message (public)
export async function PUT(request) {
  const body = await request.json();
  const { id, statut, lu, reponse, repondu, repondu_le } = body;

  if (!id) {
    return NextResponse.json({ error: 'ID requis' }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('messages')
    .update({
      statut,
      lu,
      reponse,
      repondu,
      repondu_le
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE - Delete message (public)
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID requis' }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from('messages').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}