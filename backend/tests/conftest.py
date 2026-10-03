from __future__ import annotations

import os

os.environ.update({
    "DATABASE_URL": "sqlite://",
    "JWT_SECRET": "test-secret-key-for-testing-only",
    "CORS_ORIGINS": "http://localhost:5173",
    "OPENROUTER_API_KEY": "",
})

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.database import Base, get_db
from app.main import create_app


@pytest.fixture(scope="session")
def engine():
    eng = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=eng)
    return eng


@pytest.fixture()
def db(engine):
    connection = engine.connect()
    transaction = connection.begin()
    session = sessionmaker(bind=connection)()

    yield session

    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture()
def client(db):
    app = create_app()

    def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c


@pytest.fixture()
def auth_headers(client):
    resp = client.post("/api/auth/register", json={
        "email": "test@example.com",
        "password": "StrongP@ss1",
        "full_name": "Test User",
        "business_name": "Test Biz",
    })
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
