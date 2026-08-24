import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

// GET - Fetch all events (public)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  const supabase = await createSupabaseServerClient();

  if (id) {
    const { data, error } = await supabase
      .from('evenements')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(data);
  }

  const { data, error } = await supabase
    .from('evenements')
    .select('*')
    .order('date', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST - Create new event (public)
export async function POST(request) {
  const body = await request.json();
  const { titre, description, date, lieu, image_url, statut } = body;

  if (!titre || !date) {
    return NextResponse.json({ error: 'Titre et date requis' }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.from('evenements').insert([{
    titre,
    description: description || null,
    date,
    lieu: lieu || null,
    image_url: image_url || null,
    statut: statut || 'actif'
  }]).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

// PUT - Update event (public)
export async function PUT(request) {
  const body = await request.json();
  const { id, titre, description, date, lieu, image_url, statut } = body;

  if (!id) {
    return NextResponse.json({ error: 'ID requis' }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('evenements')
    .update({
      titre,
      description,
      date,
      lieu,
      image_url,
      statut
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE - Delete event (public)
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID requis' }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from('evenements').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
