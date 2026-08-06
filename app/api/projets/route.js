import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function POST(request) {
  const body = await request.json();
  const { name, email, phone, service, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
  }

  const cookieStore = cookies();
  const supabase = createSupabaseServerClient(cookieStore);

  const { error } = await supabase.from('messages').insert({
    name,
    email,
    phone: phone || null,
    service: service || null,
    message,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}