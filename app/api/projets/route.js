import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

// GET - Fetch all projects (public)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  const supabase = await createSupabaseServerClient();

  if (id) {
    // Get single project
    const { data, error } = await supabase
      .from('projets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(data);
  }

  // Get all projects
  const { data, error } = await supabase
    .from('projets')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST - Create new project (public)
export async function POST(request) {
  const body = await request.json();
  const { titre, description, categorie, image_url, lien, statut } = body;

  if (!titre || !description) {
    return NextResponse.json({ error: 'Titre et description requis' }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.from('projets').insert([{
    titre,
    description,
    categorie: categorie || null,
    image_url: image_url || null,
    lien: lien || null,
    statut: statut || 'actif'
  }]).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

// PUT - Update project (public)
export async function PUT(request) {
  const body = await request.json();
  const { id, titre, description, categorie, image_url, lien, statut } = body;

  if (!id) {
    return NextResponse.json({ error: 'ID requis' }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('projets')
    .update({
      titre,
      description,
      categorie,
      image_url,
      lien,
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

// DELETE - Delete project (public)
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID requis' }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from('projets').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
