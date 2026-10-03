def test_register(client):
    resp = client.post("/api/auth/register", json={
        "email": "new@example.com",
        "password": "StrongP@ss1",
        "full_name": "New User",
        "business_name": "New Biz",
    })
    assert resp.status_code == 201
    data = resp.json()
    assert data["user"]["email"] == "new@example.com"
    assert data["business"]["name"] == "New Biz"
    assert "access_token" in data


def test_register_duplicate(client):
    payload = {
        "email": "dup@example.com",
        "password": "StrongP@ss1",
        "full_name": "Dup User",
        "business_name": "Dup Biz",
    }
    client.post("/api/auth/register", json=payload)
    resp = client.post("/api/auth/register", json=payload)
    assert resp.status_code == 409


def test_login(client):
    client.post("/api/auth/register", json={
        "email": "login@example.com",
        "password": "StrongP@ss1",
        "full_name": "Login User",
        "business_name": "Login Biz",
    })
    resp = client.post("/api/auth/login", data={
        "username": "login@example.com",
        "password": "StrongP@ss1",
    })
    assert resp.status_code == 200
    assert "access_token" in resp.json()


def test_login_wrong_password(client):
    client.post("/api/auth/register", json={
        "email": "wrong@example.com",
        "password": "StrongP@ss1",
        "full_name": "Wrong User",
        "business_name": "Wrong Biz",
    })
    resp = client.post("/api/auth/login", data={
        "username": "wrong@example.com",
        "password": "WrongPassword1",
    })
    assert resp.status_code == 401


def test_me(client, auth_headers):
    resp = client.get("/api/auth/me", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["email"] == "test@example.com"
    assert "business" in data


def test_me_unauthorized(client):
    resp = client.get("/api/auth/me")
    assert resp.status_code == 401
