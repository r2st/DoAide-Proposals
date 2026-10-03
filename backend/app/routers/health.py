from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import check_database, get_db

router = APIRouter(tags=["health"])


@router.get("/health")
def health(db: Session = Depends(get_db)) -> dict:
    db_ok, db_error = check_database(db)
    return {
        "status": "healthy" if db_ok else "degraded",
        "database": {"reachable": db_ok, "error": db_error},
    }
