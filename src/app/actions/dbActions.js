'use server';

import { createClient } from '@supabase/supabase-js';

function getSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error('Missing Supabase environment variables.');
  }

  return createClient(supabaseUrl, supabasePublishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function fetchClientUsers() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('client_users')
    .select('id, name, email, phone, created_at')
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Could not fetch client users: ${error.message}`);
  return data ?? [];
}

export async function createClientUser(formData) {
  const name = String(formData?.name ?? '').trim();
  const email = String(formData?.email ?? '').trim().toLowerCase();
  const phone = String(formData?.phone ?? '').trim();

  if (!name || !email || !phone) {
    return { success: false, error: 'Name, email and phone are required.' };
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('client_users')
    .insert({ name, email, phone })
    .select('id, name, email, phone, created_at')
    .single();

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: 'This email is already registered.' };
    }
    return { success: false, error: error.message };
  }

  return { success: true, data };
}
