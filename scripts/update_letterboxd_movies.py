#!/usr/bin/env python3
"""
Fetch film links from a Letterboxd user page and push unique links
into the `movies` array column of the `public.recommendations` table in Supabase.

Usage:
  pip install -r requirements.txt
  # set SUPABASE_URL and SUPABASE_SERVICE_KEY in your .env (or environment)
  python scripts/update_letterboxd_movies.py --user byapak --row-id 1

This script will:
 - scrape pages under https://letterboxd.com/<user>/films/ and /films/page/X/
 - collect unique film links (e.g. https://letterboxd.com/film/parasite/)
 - fetch existing `movies` array from the specified recommendations row (default id=1)
 - merge scraped links with existing links (no duplicates)
 - update the row with the merged array

Note: The script updates a single row (id provided). If you want a different
behaviour (one row per film), let me know and I can convert to a normalized
`recommendation_items` table and insert individual rows.
"""

import os
import re
import sys
import time
import argparse
from typing import List, Set

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
import hashlib

try:
    from supabase import create_client
except Exception:
    create_client = None
    
# No VSCO/Playwright support — script focuses on Letterboxd movie links only


LETTERBOXD_FILMS_PATH = "/{user}/films/"
LETTERBOXD_REVIEWS_PATH = "/{user}/films/reviews/"


def fetch_film_links(user: str, max_pages: int = 20, delay: float = 0.6) -> List[str]:
    """Scrape Letterboxd user's films pages and return unique film links.

    Args:
      user: letterboxd username (e.g. 'byapak')
      max_pages: upper limit for pagination to avoid infinite loops
      delay: seconds to sleep between requests
    Returns:
      list of full URLs (https://letterboxd.com/film/slug/)
    """
    base = "https://letterboxd.com"
    collected: Set[str] = set()

    session = requests.Session()
    headers = {
        "User-Agent": "Mozilla/5.0 (compatible; byapak-bot/1.0; +https://example.com)"
    }

    # fetch both the main films list (watched) and the reviews list to ensure
    # we capture both watched-only and reviewed films
    paths = []
    for p in range(1, max_pages + 1):
        if p == 1:
            paths.append(f"{base}/{user}/films/")
            paths.append(f"{base}/{user}/films/reviews/")
        else:
            paths.append(f"{base}/{user}/films/page/{p}/")
            paths.append(f"{base}/{user}/films/reviews/page/{p}/")

    for url in paths:

        print(f"Fetching {url}")
        try:
            r = session.get(url, headers=headers, timeout=15)
        except Exception as e:
            print(f"Fetch error {e} for {url}")
            break
        if r.status_code != 200:
            print(f"Non-200 response {r.status_code} for {url}, stopping pagination")
            break

        soup = BeautifulSoup(r.text, "html.parser")

        # Find anchors that reference /film/slug
        anchors = soup.find_all('a', href=True)
        page_links_before = len(collected)
        for a in anchors:
            href = a['href']
            if not href:
                continue

            # normalize and accept urls that include the film path
            if href.startswith('/film/') or '/film/' in href:
                # convert relative to absolute
                full = requests.compat.urljoin(base, href)
                # only keep canonical film paths
                if '/film/' in requests.compat.urlparse(full).path:
                    collected.add(full.rstrip('\n'))

        time.sleep(delay)

    return sorted(collected)


# Removed VSCO image upload helpers — script now only handles Letterboxd movie links


def load_env():
    # load .env if present
    load_dotenv()
    url = os.getenv('SUPABASE_URL')
    key = os.getenv('SUPABASE_SERVICE_KEY') or os.getenv('SUPABASE_KEY') or os.getenv('SUPABASE_ANON_KEY')
    if not url or not key:
        print('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in environment or .env')
        sys.exit(2)
    if create_client is None:
        print('Python supabase client not installed. Install with: pip install supabase')
        sys.exit(2)
    return url, key


def get_existing_movies(supabase, row_id: int):
    """Return existing movies array, handling alternate column names.

    Tries to read `movies` first, then falls back to selecting `*` and
    inspecting the returned row for `movies` or `movie` keys.
    """
    try:
        res = supabase.table('recommendations').select('movies').eq('id', row_id).execute()
        if getattr(res, 'error', None):
            raise RuntimeError(f"Supabase select error: {res.error}")
        data = res.data
        if not data:
            return []
        movies = data[0].get('movies') or []
        return movies
    except Exception:
        # fallback: fetch entire row and inspect keys
        res2 = supabase.table('recommendations').select('*').eq('id', row_id).execute()
        if getattr(res2, 'error', None):
            raise RuntimeError(f"Supabase select error: {res2.error}")
        data2 = res2.data
        if not data2:
            return []
        row = data2[0]
        if 'movies' in row:
            return row.get('movies') or []
        if 'movie' in row:
            val = row.get('movie')
            if isinstance(val, list):
                return val
            if isinstance(val, str):
                parts = [p.strip() for p in re.split(r'[\n,]+', val) if p.strip()]
                return parts
        return []


def update_movies_row(supabase, row_id: int, movies_list: List[str]):
    """Update the specified recommendations row with the merged movies list.

    Tries `movies` column first, falls back to `movie` column (joined string).
    """
    try:
        res = supabase.table('recommendations').update({'movies': movies_list}).eq('id', row_id).execute()
        if getattr(res, 'error', None):
            raise RuntimeError(f"Supabase update error: {res.error}")
        return res.data
    except Exception:
        # fallback to `movie` column as joined string
        joined = ','.join(movies_list)
        res2 = supabase.table('recommendations').update({'movie': joined}).eq('id', row_id).execute()
        if getattr(res2, 'error', None):
            raise RuntimeError(f"Supabase update error: {res2.error}")
        return res2.data


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--user', '-u', required=True, help='Letterboxd username (e.g. byapak)')
    parser.add_argument('--row-id', '-r', type=int, default=1, help='(deprecated) recommendations row id to update')
    parser.add_argument('--max-pages', type=int, default=10, help='max pages to scrape')
    parser.add_argument('--per-row', dest='per_row', action='store_true', help='Insert each link as its own recommendations row (default)')
    parser.set_defaults(per_row=True)
    args = parser.parse_args()

    url, key = load_env()
    supabase = create_client(url, key)

    print('Scraping Letterboxd...')
    scraped = fetch_film_links(args.user, max_pages=args.max_pages)
    print(f'Found {len(scraped)} film links')

    if args.per_row:
        print('Inserting each link as its own recommendations row (skipping existing)...')
        # Deduplicate scraped links locally
        scraped_unique = []
        seen = set()
        for s in scraped:
            if s in seen:
                continue
            seen.add(s)
            scraped_unique.append(s)

        added = 0
        for link in scraped_unique:
            # check existence
            q = supabase.table('recommendations').select('id').eq('movie', link).execute()
            if getattr(q, 'error', None):
                print(f'Warning: select error for link {link}: {q.error}')
                continue
            if q.data:
                # already exists
                continue
            # Try inserting with `kind` first; fallback to no-kind if schema lacks it
            ins = supabase.table('recommendations').insert({'movie': link, 'kind': 'movie'}).execute()
            if getattr(ins, 'error', None):
                err = ins.error
                msg = getattr(err, 'message', str(err))
                if 'kind' in msg or getattr(err, 'code', '') == 'PGRST204':
                    ins2 = supabase.table('recommendations').insert({'movie': link}).execute()
                    if getattr(ins2, 'error', None):
                        print(f'Error inserting {link}: {ins2.error}')
                        continue
                else:
                    print(f'Error inserting {link}: {ins.error}')
                    continue
            added += 1

        print(f'Inserted {added} new rows.')
        return

    # legacy merge mode (update a single row)
    print('Fetching existing movies from Supabase...')
    existing = get_existing_movies(supabase, args.row_id)
    print(f'Existing movies count: {len(existing)}')

    # merge unique while preserving order: keep existing order then append new ones
    existing_set = set(existing)
    to_add = [s for s in scraped if s not in existing_set]

    if not to_add:
        print('No new film links to add; exiting')
        return

    merged = existing + to_add

    # update supabase row
    print(f'Adding {len(to_add)} new links to row id {args.row_id}...')
    update_movies_row(supabase, args.row_id, merged)
    print('Update complete.')


if __name__ == '__main__':
    main()
