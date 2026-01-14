# Portfolio Scraping Scripts

This directory contains Python scripts for populating the Supabase `recommendations` table with links from various platforms.

## Setup

```bash
# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Linux/Mac
# or: .venv\Scripts\activate  # On Windows

# Install dependencies
pip install -r requirements.txt

# Install Playwright browsers (required for VSCO scraping)
python -m playwright install chromium

# Set environment variables
export SUPABASE_URL="https://your-project.supabase.co"
Only `update_letterboxd_movies.py` should remain in this folder. VSCO scripts were removed per project decision.
```
