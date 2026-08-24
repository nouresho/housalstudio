import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

// GET - Fetch all plans (public)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  const supabase = await createSupabaseServerClient();

  if (id) {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(data);
  }

  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .order('prix', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST - Create new plan (public)
export async function POST(request) {
  const body = await request.json();
  const { nom, prix, description, caracteristiques, actif } = body;

  if (!nom || !prix) {
    return NextResponse.json({ error: 'Nom et prix requis' }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.from('plans').insert([{
    nom,
    prix,
    description: description || null,
    caracteristiques: caracteristiques || [],
    actif: actif !== undefined ? actif : true
  }]).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

// PUT - Update plan (public)
export async function PUT(request) {
  const body = await request.json();
  const { id, nom, prix, description, caracteristiques, actif } = body;

  if (!id) {
    return NextResponse.json({ error: 'ID requis' }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('plans')
    .update({
      nom,
      prix,
      description,
      caracteristiques,
      actif
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE - Delete plan (public)
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID requis' }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from('plans').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
