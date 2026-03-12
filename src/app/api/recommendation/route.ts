import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

let supabase: ReturnType<typeof createClient> | null = null;

function getSupabase() {
  if (supabase) return supabase;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) {
    return null;
  }
  supabase = createClient(url, key);
  return supabase;
}

export async function GET(req: Request) {
  try {
    const sb = getSupabase();
    if (!sb) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
    }

    const url = new URL(req.url);
    const kind = (url.searchParams.get('kind') || 'movie').toLowerCase();
    // call RPC get_random_link (preferred)
    try {
      const { data, error } = await (sb.rpc as Function)('get_random_link', { p_kind: kind });
      if (!error && data) {
        const link = Array.isArray(data) ? data[0] : data;
        return NextResponse.json({ link });
      }
    } catch (rpcErr) {
      // fall through to fallback selection
      console.warn('RPC get_random_link failed, falling back to direct select', rpcErr);
    }

    // Fallback: select rows from `recommendations` and pick a random non-empty value
    const column = kind; // expecting column names like 'movie', 'image', 'book', 'misc'
    try {
      const { data, error: selErr } = await sb
        .from('recommendations')
        .select(column)
        .limit(1000);
      if (selErr) {
        console.error('Supabase select error', selErr);
        return NextResponse.json({ error: selErr.message }, { status: 500 });
      }
      const rows = data as unknown as Record<string, unknown>[] | null;
      const valid = (rows || []).map((r: Record<string, unknown>) => r && r[column]).filter(Boolean);
      if (!valid || valid.length === 0) {
        return NextResponse.json({ link: null });
      }
      const pick = valid[Math.floor(Math.random() * valid.length)];
      return NextResponse.json({ link: pick });
    } catch (err) {
      console.error(err);
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
