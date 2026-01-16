def test_get_categories(client):
    response = client.get("/api/categories")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_public_components_list(client, admin_token):
    client.post(
        "/api/admin/components",
        json={
            "title": "Public Component",
            "use_case": "Component visible to public users",
            "category": "database"
        },
        headers={"Authorization": f"Bearer {admin_token}"}
    )

    response = client.get("/api/components")
    assert response.status_code == 200
    assert len(response.json()) >= 1


def test_component_detail_public(client, admin_token):
    create = client.post(
        "/api/admin/components",
        json={
            "title": "Detail View",
            "use_case": "Component detail page testing",
            "category": "frontend"
        },
        headers={"Authorization": f"Bearer {admin_token}"}
    )

    component_id = create.json()["id"]

    response = client.get(f"/api/components/{component_id}")
    assert response.status_code == 200
    assert response.json()["id"] == component_id
