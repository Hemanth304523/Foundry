def test_create_component(client, admin_token):
    response = client.post(
        "/api/admin/components",
        json={
            "title": "Auth Module",
            "use_case": "Handles secure authentication logic",
            "category": "backend"
        },
        headers={"Authorization": f"Bearer {admin_token}"}
    )

    assert response.status_code == 201
    assert response.json()["category"] == "Backend"


def test_list_components_admin(client, admin_token):
    response = client.get(
        "/api/admin/components",
        headers={"Authorization": f"Bearer {admin_token}"}
    )

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_update_component_title(client, admin_token):
    create = client.post(
        "/api/admin/components",
        json={
            "title": "Old Component",
            "use_case": "Initial use case description",
            "category": "frontend"
        },
        headers={"Authorization": f"Bearer {admin_token}"}
    )

    component_id = create.json()["id"]

    update = client.put(
        f"/api/admin/components/{component_id}",
        json={"title": "Updated Component"},
        headers={"Authorization": f"Bearer {admin_token}"}
    )

    assert update.status_code == 200
    assert update.json()["title"] == "Updated Component"


def test_delete_component(client, admin_token):
    create = client.post(
        "/api/admin/components",
        json={
            "title": "Temp Component",
            "use_case": "Temporary component for deletion",
            "category": "devops"
        },
        headers={"Authorization": f"Bearer {admin_token}"}
    )

    component_id = create.json()["id"]

    delete = client.delete(
        f"/api/admin/components/{component_id}",
        headers={"Authorization": f"Bearer {admin_token}"}
    )

    assert delete.status_code == 204
