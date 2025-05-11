from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import api_router
from app.api.v1.endpoints import ticker as ticker_router
from app.api.v1.endpoints import leaderboard, leader
from app.api.v1.endpoints.article import router as article_router
from app.schemas.leader import Leader
from app.api.v1.endpoints import article
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import os

app = FastAPI()

# 👇 CORS fix
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 👇 Routers
app.include_router(api_router, prefix="/api/v1")
app.include_router(ticker_router.router, prefix="/api/v1/tickers", tags=["Tickers"])

app.include_router(leaderboard.router, prefix="/api/v1/leaderboard", tags=["Leaderboard"])
app.include_router(article_router, prefix="/api/v1/articles", tags=["Articles"])

# Get the project root directory (where your static folder should be)
PROJECT_ROOT = Path(__file__).parent  # Goes up to Sequencia from main.py
STATIC_DIR = PROJECT_ROOT / "static"

# Create directory if it doesn't exist
os.makedirs(STATIC_DIR, exist_ok=True)

# Mount static files
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

# Include your API routers
app.include_router(
    article.router,
    prefix="/api/v1/articles",
    tags=["articles"]
)

# Add this for leaders
app.include_router(
    leader.router,
    prefix="/api/v1/leaders",
    tags=["leaders"]
)


