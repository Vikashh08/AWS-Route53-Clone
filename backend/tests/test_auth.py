def test_health_check(client):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_login_invalid_credentials(client):
    response = client.post("/api/v1/auth/login", json={
        "email": "notfound@example.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401
