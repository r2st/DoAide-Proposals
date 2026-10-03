# DoAide Proposals

AI proposal/quote generator for businesses.

## Tech Stack

- **Backend**: FastAPI + SQLAlchemy + PostgreSQL
- **Frontend**: React 18 + Vite + Tailwind CSS 3.4
- **AI**: OpenRouter (via httpx)
- **PDF**: WeasyPrint + Jinja2

## Project Structure

```
backend/
  app/
    core/       — config, database, security, deps
    models/     — SQLAlchemy models (User, Business, Template, Proposal, Client, etc.)
    routers/    — API endpoints (auth, templates, proposals, clients, health)
    schemas/    — Pydantic request/response models
    services/   — AI generator, pricing engine, PDF export
  tests/        — pytest tests with in-memory SQLite
frontend/
  src/
    components/ — Layout, Protected
    hooks/      — useAuth, useTheme
    lib/        — API client
    pages/      — Landing, Login, Register, Dashboard, Templates, Proposals, Clients, Settings, Pricing, PublicProposal
```

## Development

```bash
# Backend
cd backend
pip install -r requirements.txt -r requirements-dev.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev

# Tests
cd backend && pytest
cd frontend && npm test
```

## Key Conventions

- Backend uses app factory pattern (`create_app()`)
- All API routes prefixed with `/api`
- JWT auth via `Authorization: Bearer <token>`
- Database: in-memory SQLite for tests, PostgreSQL for production
- Tailwind CSS 3.4 — do NOT upgrade to v4
- Store API keys in `keys/` directory (gitignored)
- Use OpenRouter for all LLM calls
