import pytest


@pytest.fixture()
def template_id(client, auth_headers):
    resp = client.post("/api/templates", json={
        "name": "Test Template",
        "description": "For testing",
        "default_terms": "Net 30",
        "default_validity_days": 30,
        "sections": [
            {"title": "Intro", "content": "Hello {client_name}", "order": 0, "section_type": "text"},
        ],
    }, headers=auth_headers)
    return resp.json()["id"]


@pytest.fixture()
def client_id(client, auth_headers):
    resp = client.post("/api/clients", json={
        "name": "Test Client",
        "email": "client@test.com",
        "company": "Test LLC",
    }, headers=auth_headers)
    return resp.json()["id"]


@pytest.fixture()
def proposal_payload(template_id, client_id):
    return {
        "title": "Test Proposal",
        "client_id": client_id,
        "template_id": template_id,
        "client_name": "Test Client",
        "client_email": "client@test.com",
        "client_company": "Test LLC",
        "sections": [
            {"title": "Intro", "content": "Hello Test Client", "order": 0, "section_type": "text"},
        ],
        "pricing_items": [
            {"description": "Web Design", "quantity": 1, "unit_price": 5000, "amount": 5000},
        ],
        "discount_percent": 10,
        "tax_percent": 8,
        "terms": "Net 30",
        "validity_days": 30,
    }


def test_create_proposal(client, auth_headers, proposal_payload):
    resp = client.post("/api/proposals", json=proposal_payload, headers=auth_headers)
    assert resp.status_code == 201
    data = resp.json()
    assert data["title"] == "Test Proposal"
    assert data["view_token"] is not None


def test_list_proposals(client, auth_headers, proposal_payload):
    client.post("/api/proposals", json=proposal_payload, headers=auth_headers)
    resp = client.get("/api/proposals", headers=auth_headers)
    assert resp.status_code == 200
    assert len(resp.json()) >= 1


def test_get_proposal(client, auth_headers, proposal_payload):
    create = client.post("/api/proposals", json=proposal_payload, headers=auth_headers)
    pid = create.json()["id"]
    resp = client.get(f"/api/proposals/{pid}", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["id"] == pid


def test_update_proposal(client, auth_headers, proposal_payload):
    create = client.post("/api/proposals", json=proposal_payload, headers=auth_headers)
    pid = create.json()["id"]
    resp = client.patch(f"/api/proposals/{pid}", json={"title": "Updated"}, headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["title"] == "Updated"


def test_send_proposal(client, auth_headers, proposal_payload):
    create = client.post("/api/proposals", json=proposal_payload, headers=auth_headers)
    pid = create.json()["id"]
    resp = client.post(f"/api/proposals/{pid}/send", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["status"] == "sent"
    assert resp.json()["sent_at"] is not None


def test_delete_proposal(client, auth_headers, proposal_payload):
    create = client.post("/api/proposals", json=proposal_payload, headers=auth_headers)
    pid = create.json()["id"]
    resp = client.delete(f"/api/proposals/{pid}", headers=auth_headers)
    assert resp.status_code == 204


def test_proposal_stats(client, auth_headers, proposal_payload):
    client.post("/api/proposals", json=proposal_payload, headers=auth_headers)
    resp = client.get("/api/proposals/stats", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "total" in data
    assert "monthly_usage" in data


def test_generate_proposal(client, auth_headers, template_id, client_id):
    resp = client.post("/api/proposals/generate", json={
        "template_id": template_id,
        "client_id": client_id,
        "brief": "Build a website for our company",
        "client_name": "Test Client",
        "client_company": "Test LLC",
    }, headers=auth_headers)
    assert resp.status_code == 201
    data = resp.json()
    assert "Proposal for" in data["title"]
    assert len(data["sections"]) >= 1


def test_public_view(client, auth_headers, proposal_payload):
    create = client.post("/api/proposals", json=proposal_payload, headers=auth_headers)
    pid = create.json()["id"]
    client.post(f"/api/proposals/{pid}/send", headers=auth_headers)

    proposal = client.get(f"/api/proposals/{pid}", headers=auth_headers).json()
    token = proposal["view_token"]

    resp = client.get(f"/api/proposals/view/{token}")
    assert resp.status_code == 200
    data = resp.json()
    assert data["title"] == "Test Proposal"
    assert "business_name" in data


def test_sign_proposal(client, auth_headers, proposal_payload):
    create = client.post("/api/proposals", json=proposal_payload, headers=auth_headers)
    pid = create.json()["id"]
    client.post(f"/api/proposals/{pid}/send", headers=auth_headers)

    proposal = client.get(f"/api/proposals/{pid}", headers=auth_headers).json()
    token = proposal["view_token"]

    # View first to change status to VIEWED
    client.get(f"/api/proposals/view/{token}")

    resp = client.post(f"/api/proposals/view/{token}/sign", json={
        "signer_name": "John Doe",
        "signer_email": "john@test.com",
        "signature_data": "base64signaturedata",
        "accepted": True,
    })
    assert resp.status_code == 200
    assert resp.json()["status"] == "accepted"


def test_proposal_not_found(client, auth_headers):
    resp = client.get("/api/proposals/9999", headers=auth_headers)
    assert resp.status_code == 404
