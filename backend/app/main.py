from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from app.core.config import settings
from app.core.database import check_database, engine, get_db
from app.models import *  # noqa: F401,F403 — register models on Base.metadata

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    db = next(get_db())
    try:
        ok, err = check_database(db)
        if ok:
            logger.info("Database connected")
        else:
            logger.warning("Database check failed: %s", err)
    finally:
        db.close()
    yield
    engine.dispose()


def create_app() -> FastAPI:
    app = FastAPI(
        title="DoAide Proposals",
        description="AI proposal & quote generator for businesses",
        version="0.1.0",
        lifespan=lifespan,
    )

    app.add_middleware(GZipMiddleware, minimum_size=1000)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    from app.routers import auth, clients, health, proposals, templates

    app.include_router(health.router, prefix="/api")
    app.include_router(auth.router, prefix="/api")
    app.include_router(templates.router, prefix="/api")
    app.include_router(clients.router, prefix="/api")
    app.include_router(proposals.router, prefix="/api")

    return app


app = create_app()
