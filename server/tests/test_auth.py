
import uuid

def test_admin_signup_success(client):
    unique = uuid.uuid4().hex[:8]
    signup_data = {
        "username": f"test_admin_{unique}",
        "email": f"test_{unique}@admin.com",
        "password": "StrongPass1"
    }
    response = client.post("/api/auth/signup", json=signup_data)
    assert response.status_code == 201
    assert response.json()["username"] == signup_data["username"]


def test_admin_signup_weak_password(client):
    response = client.post("/api/auth/signup", json={
        "username": "weakadmin",
        "email": "weak@admin.com",
        "password": "password"
    })

    assert response.status_code == 422


def test_admin_login_success(client):
    client.post("/api/auth/signup", json={
        "username": "login_admin",
        "email": "login@admin.com",
        "password": "LoginPass1"
    })

    response = client.post(
        "/api/auth/login",
        data={
            "username": "login_admin",
            "password": "LoginPass1"
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )

    assert response.status_code == 200
    assert "access_token" in response.json()
