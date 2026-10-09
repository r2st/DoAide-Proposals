def test_get_seed_templates(client):
    resp = client.get("/api/public/seed-templates")
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    assert len(data) == 4
    slugs = [t["slug"] for t in data]
    assert "consulting" in slugs
    assert "software-development" in slugs
    assert "marketing-services" in slugs
    assert "freelance" in slugs
    for t in data:
        assert "name" in t
        assert "description" in t
        assert "sections" in t
        assert len(t["sections"]) >= 4


def test_seed_template_sections_have_hints(client):
    resp = client.get("/api/public/seed-templates")
    data = resp.json()
    for template in data:
        for section in template["sections"]:
            assert "title" in section
            assert "hint" in section
            assert len(section["hint"]) > 10


def test_builder_pdf_export(client):
    payload = {
        "title": "Test Proposal",
        "business_name": "Acme Corp",
        "client_name": "John Doe",
        "client_company": "Client Inc",
        "sections": [
            {"title": "Introduction", "content": "This is a test proposal."},
            {"title": "Scope", "content": "The scope includes testing."},
        ],
        "pricing_items": [
            {"description": "Design work", "quantity": 1, "unit_price": 5000},
            {"description": "Development", "quantity": 80, "unit_price": 150},
        ],
        "discount_percent": 10,
        "tax_percent": 8,
        "terms": "Net 30 payment terms.",
        "validity_days": 30,
    }
    resp = client.post("/api/public/builder/pdf", json=payload)
    assert resp.status_code == 200
    assert "pdf" in resp.headers.get("content-type", "") or "html" in resp.headers.get("content-type", "")
    assert len(resp.content) > 100


def test_builder_pdf_minimal(client):
    payload = {
        "title": "Minimal Proposal",
        "sections": [],
        "pricing_items": [],
    }
    resp = client.post("/api/public/builder/pdf", json=payload)
    assert resp.status_code == 200


def test_builder_pdf_validation(client):
    resp = client.post("/api/public/builder/pdf", json={})
    assert resp.status_code == 422
