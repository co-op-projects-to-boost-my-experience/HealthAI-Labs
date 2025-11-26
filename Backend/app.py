from fastapi import FastAPI, APIRouter, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import httpx
import os
import time
from typing import Optional, Dict, Any, List

app = FastAPI()
router = APIRouter()

# Allow React frontend container to access backend
origins = [
    "http://frontend",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple in-memory cache for aggregated news pools
# Keyed by (category, lang). Value: {"ts": <epoch>, "articles": [..]}
NEWS_CACHE: Dict[str, Dict[str, Any]] = {}
CACHE_TTL_SECONDS = 300  # 5 minutes

# Root endpoints (keep your existing ones)
@app.get("/")
async def root():
    return {"message": "Welcome to Health API"}

@app.get("/rays")
async def rays():
    return {"message": "Medical imaging analysis"}

@app.get("/report")
async def report():
    return {"message": "Health report generation"}

@app.get("/about")
async def about():
    return {"message": "About our service"}

@app.get("/analysis")
async def analysis():
    return {"message": "Symptom analysis"}

@app.get("/askdoctor")
async def ask_doctor():
    return {"message": "AI doctor consultation"}

@app.get("/contact")
async def contact():
    return {"message": "contact us"}

def cache_key(category: str, lang: str) -> str:
    return f"{category}::{lang}"

async def fetch_search_pages(api_key: str, query: str, lang: str, per_page: int, max_pages: int = 5) -> List[Dict[str, Any]]:
    """
    Fetch multiple pages from GNews /search endpoint until we collect enough articles
    or reach max_pages. Returns list of articles (may be fewer than requested).
    """
    url = "https://gnews.io/api/v4/search"
    collected: List[Dict[str, Any]] = []
    seen_urls = set()

    async with httpx.AsyncClient() as client:
        for p in range(1, max_pages + 1):
            params = {
                "q": query or "",   # empty query returns broader results
                "lang": lang,
                "max": per_page,
                "page": p,
                "apikey": api_key
            }
            try:
                resp = await client.get(url, params=params, timeout=10.0)
                resp.raise_for_status()
                data = resp.json()
                page_articles = data.get("articles", [])
            except Exception:
                # stop on any external error and return what we have
                break

            for a in page_articles:
                u = a.get("url") or a.get("link") or a.get("title")
                if not u:
                    continue
                if u in seen_urls:
                    continue
                seen_urls.add(u)
                collected.append(a)

            # stop early if we already have enough for a single page of results
            # caller will request more pages by increasing max_pages if needed
            if len(collected) >= per_page * max_pages:
                break

            # if the API returned fewer items than requested, likely no more pages
            if len(page_articles) < per_page:
                break

    return collected

@router.get("/news")
async def get_medical_news(
    category: Optional[str] = Query("health"),
    lang: Optional[str] = Query("en"),
    max_results: Optional[int] = Query(12, ge=1, le=50),
    page: Optional[int] = Query(1, ge=1)
):
    """
    Returns paginated news built from an aggregated pool fetched from GNews.
    Strategy:
      - Try to use /search endpoint and fetch multiple pages until we have enough unique articles.
      - Cache the aggregated pool for CACHE_TTL_SECONDS to avoid repeated external calls.
      - Slice the pool for the requested page.
    """
    api_key = os.getenv("GNEWS_API_KEY")
    if not api_key:
        # Mock fallback for local dev
        return JSONResponse(content={
            "articles": [
                {
                    "title": "Mock Medical News 1",
                    "description": "This is a mock description",
                    "image": "https://via.placeholder.com/400x200",
                    "url": "#1",
                    "source": {"name": "MockSource"},
                    "publishedAt": "2025-11-25T12:00:00Z"
                },
                {
                    "title": "Mock Medical News 2",
                    "description": "This is a second mock description",
                    "image": "https://via.placeholder.com/400x200",
                    "url": "#2",
                    "source": {"name": "MockSource"},
                    "publishedAt": "2025-11-24T12:00:00Z"
                }
            ],
            "total": 2,
            "page": page,
            "has_more": False,
            "message": "No API key"
        })

    key = cache_key(category, lang)
    now = time.time()
    pool = NEWS_CACHE.get(key)

    # If cache expired or missing, rebuild pool
    if not pool or (now - pool.get("ts", 0) > CACHE_TTL_SECONDS):
        # We'll attempt to fetch a larger pool by querying multiple related terms
        # and multiple pages if necessary. This increases chance of more unique results.
        queries = [
            category or "health",
            "medicine",
            "medical",
            "healthcare",
            "clinical research",
            "medical research"
        ]

        aggregated: List[Dict[str, Any]] = []
        seen = set()
        # per_page for each external request (GNews max param is usually <= 100 depending on plan)
        per_page = 20
        max_pages_per_query = 3  # try up to 3 pages per query (tunable)
        # iterate queries until we have a reasonably large pool
        for q in queries:
            if len(aggregated) >= 200:  # safety cap
                break
            fetched = await fetch_search_pages(api_key=api_key, query=q, lang=lang, per_page=per_page, max_pages=max_pages_per_query)
            for a in fetched:
                u = a.get("url") or a.get("link") or a.get("title")
                if not u or u in seen:
                    continue
                seen.add(u)
                aggregated.append(a)
            # small delay could be added if rate limits are a concern

        # final fallback: if aggregated is empty, try top-headlines once
        if not aggregated:
            try:
                url = "https://gnews.io/api/v4/top-headlines"
                params = {"category": category, "lang": lang, "max": 50, "apikey": api_key}
                async with httpx.AsyncClient() as client:
                    resp = await client.get(url, params=params, timeout=10.0)
                    resp.raise_for_status()
                    data = resp.json()
                    for a in data.get("articles", []):
                        u = a.get("url") or a.get("title")
                        if not u or u in seen:
                            continue
                        seen.add(u)
                        aggregated.append(a)
            except Exception:
                # ignore and continue with whatever we have
                pass

        # store in cache
        NEWS_CACHE[key] = {"ts": now, "articles": aggregated}

        pool = NEWS_CACHE[key]

    all_articles = pool.get("articles", [])

    # compute slice for requested page
    start = (page - 1) * max_results
    end = start + max_results
    sliced = all_articles[start:end]

    # has_more if there are more items after this slice
    has_more = end < len(all_articles)

    return JSONResponse(content={
        "articles": sliced,
        "total": len(all_articles),
        "page": page,
        "has_more": has_more
    })

# Mount router
app.include_router(router, prefix="/api")