import pytest


@pytest.fixture()
def client_payload():
    return {
        "name": "Acme Corp",
        "email": "contact@acme.com",
        "phone": "+1234567890",
        "company": "Acme Corporation",
        "address": "123 Main St",
        "notes": "Important client",
    }


def test_create_client(client, auth_headers, client_payload):
    resp = client.post("/api/clients", json=client_payload, headers=auth_headers)
    assert resp.status_code == 201
    data = resp.json()
    assert data["name"] == "Acme Corp"
    assert data["company"] == "Acme Corporation"


def test_list_clients(client, auth_headers, client_payload):
    client.post("/api/clients", json=client_payload, headers=auth_headers)
    resp = client.get("/api/clients", headers=auth_headers)
    assert resp.status_code == 200
    assert len(resp.json()) >= 1


def test_get_client(client, auth_headers, client_payload):
    create = client.post("/api/clients", json=client_payload, headers=auth_headers)
    cid = create.json()["id"]
    resp = client.get(f"/api/clients/{cid}", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["id"] == cid


def test_update_client(client, auth_headers, client_payload):
    create = client.post("/api/clients", json=client_payload, headers=auth_headers)
    cid = create.json()["id"]
    resp = client.patch(f"/api/clients/{cid}", json={"name": "Updated Corp"}, headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["name"] == "Updated Corp"


def test_delete_client(client, auth_headers, client_payload):
    create = client.post("/api/clients", json=client_payload, headers=auth_headers)
    cid = create.json()["id"]
    resp = client.delete(f"/api/clients/{cid}", headers=auth_headers)
    assert resp.status_code == 204
    resp = client.get(f"/api/clients/{cid}", headers=auth_headers)
    assert resp.status_code == 404


def test_client_not_found(client, auth_headers):
    resp = client.get("/api/clients/9999", headers=auth_headers)
    assert resp.status_code == 404
