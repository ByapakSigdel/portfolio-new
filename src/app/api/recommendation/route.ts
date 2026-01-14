import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL as string;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY as string;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  // keep this file syntactically valid on client machines without env set
  console.warn('Supabase URL or service key not provided; /api/recommendation will return an error.');
}

const supabase = createClient(SUPABASE_URL ?? '', SUPABASE_SERVICE_KEY ?? '');

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const kind = (url.searchParams.get('kind') || 'movie').toLowerCase();
    // call RPC get_random_link (preferred)
    try {
      const { data, error } = await supabase.rpc('get_random_link', { p_kind: kind });
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
      const { data, error: selErr } = await supabase
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
