import pytest


@pytest.fixture()
def template_payload():
    return {
        "name": "Web Dev Proposal",
        "description": "Standard web development proposal",
        "default_terms": "Net 30",
        "default_validity_days": 30,
        "sections": [
            {"title": "Introduction", "content": "We propose...", "order": 0, "section_type": "text"},
            {"title": "Scope", "content": "The scope includes...", "order": 1, "section_type": "text"},
        ],
    }


def test_create_template(client, auth_headers, template_payload):
    resp = client.post("/api/templates", json=template_payload, headers=auth_headers)
    assert resp.status_code == 201
    data = resp.json()
    assert data["name"] == "Web Dev Proposal"
    assert len(data["sections"]) == 2


def test_list_templates(client, auth_headers, template_payload):
    client.post("/api/templates", json=template_payload, headers=auth_headers)
    resp = client.get("/api/templates", headers=auth_headers)
    assert resp.status_code == 200
    assert len(resp.json()) >= 1


def test_get_template(client, auth_headers, template_payload):
    create = client.post("/api/templates", json=template_payload, headers=auth_headers)
    tid = create.json()["id"]
    resp = client.get(f"/api/templates/{tid}", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["id"] == tid


def test_update_template(client, auth_headers, template_payload):
    create = client.post("/api/templates", json=template_payload, headers=auth_headers)
    tid = create.json()["id"]
    resp = client.patch(f"/api/templates/{tid}", json={"name": "Updated"}, headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["name"] == "Updated"


def test_delete_template(client, auth_headers, template_payload):
    create = client.post("/api/templates", json=template_payload, headers=auth_headers)
    tid = create.json()["id"]
    resp = client.delete(f"/api/templates/{tid}", headers=auth_headers)
    assert resp.status_code == 204
    resp = client.get(f"/api/templates/{tid}", headers=auth_headers)
    assert resp.status_code == 404


def test_template_not_found(client, auth_headers):
    resp = client.get("/api/templates/9999", headers=auth_headers)
    assert resp.status_code == 404
