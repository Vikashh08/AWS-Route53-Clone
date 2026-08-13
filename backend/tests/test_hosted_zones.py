def test_create_hosted_zone_unauthorized(client):
    response = client.post("/api/v1/hosted-zones", json={
        "name": "example.com",
        "description": "Test zone",
        "is_private": False
    })
    assert response.status_code == 401
