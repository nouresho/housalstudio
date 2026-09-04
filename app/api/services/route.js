import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

// GET - Fetch all services (public)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  const supabase = await createSupabaseServerClient();

  if (id) {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(data);
  }

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('ordre', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST - Create new service (public)
export async function POST(request) {
  const body = await request.json();
  const { titre, description, icon, prix, duree, ordre, actif } = body;

  if (!titre) {
    return NextResponse.json({ error: 'Titre requis' }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.from('services').insert([{
    titre,
    description: description || null,
    icon: icon || null,
    prix: prix || null,
    duree: duree || null,
    ordre: ordre || 0,
    actif: actif !== undefined ? actif : true
  }]).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

// PUT - Update service (public)
export async function PUT(request) {
  const body = await request.json();
  const { id, titre, description, icon, prix, duree, ordre, actif } = body;

  if (!id) {
    return NextResponse.json({ error: 'ID requis' }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('services')
    .update({
      titre,
      description,
      icon,
      prix,
      duree,
      ordre,
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

// DELETE - Delete service (public)
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID requis' }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from('services').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
