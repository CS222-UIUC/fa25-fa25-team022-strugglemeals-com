import os
import json
from pathlib import Path
from dotenv import load_dotenv
import requests

# ----- config -----
MAX_PRICE_CENTS = 400     # <= $4.00 per serving (your new requirement)
MAX_READY_MIN   = 60      # <= 60 minutes
PAGE_SIZE       = 100     # Spoonacular complexSearch max per request
PAGES           = 2       # fetch up to 200 results (two pages)
# ------------------

# Load .env from dataset/
env_path = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(dotenv_path=env_path)

API_KEY  = os.getenv("SPOONACULAR_API_KEY")
if not API_KEY:
    raise ValueError("No API key found. Put SPOONACULAR_API_KEY=... in dataset/.env")

BASE_URL = "https://api.spoonacular.com"

RAW_DIR  = Path(__file__).resolve().parents[1] / "raw"
RAW_DIR.mkdir(parents=True, exist_ok=True)

def fetch_page(offset: int = 0, number: int = PAGE_SIZE):
    """Fetch one page of candidate 'struggle meals' from Spoonacular."""
    url = f"{BASE_URL}/recipes/complexSearch"
    params = {
        "apiKey": API_KEY,
        "maxPrice": MAX_PRICE_CENTS,      # server-side hint (not strict)
        "maxReadyTime": MAX_READY_MIN,
        "addRecipeInformation": True,
        "sort": "price",                  # cheap first
        "sortDirection": "asc",
        "number": number,
        "offset": offset,
    }
    r = requests.get(url, params=params, timeout=30)
    r.raise_for_status()
    return r.json().get("results", [])

def local_price_filter(recipes, max_price_cents=MAX_PRICE_CENTS):
    """HARD filter locally by price per serving (in cents)."""
    out = []
    for rec in recipes:
        price = rec.get("pricePerServing")
        if isinstance(price, (int, float)) and price <= max_price_cents:
            out.append(rec)
    return out

def main():
    # 1) Fetch multiple pages
    all_results = {}
    total_fetched = 0
    for i in range(PAGES):
        offset = i * PAGE_SIZE
        page = fetch_page(offset=offset, number=PAGE_SIZE)
        for rec in page:
            all_results[rec["id"]] = rec
        total_fetched += len(page)
        print(f"📥 Page {i+1}: fetched {len(page)} (running unique total: {len(all_results)})")

    candidates = list(all_results.values())
    print(f"Candidates before local filter: {len(candidates)} (raw fetched: {total_fetched})")

    # 2) Local HARD filter by price
    filtered = local_price_filter(candidates, MAX_PRICE_CENTS)
    print(f"After local price filter (≤ {MAX_PRICE_CENTS}¢/serving): {len(filtered)}")

    # 3) Save
    out_path = RAW_DIR / "struggle_meals.json"
    with open(out_path, "w") as f:
        json.dump(filtered, f, indent=2)

    print(f"Saved {len(filtered)} recipes to {out_path}")

if __name__ == "__main__":
    main()
