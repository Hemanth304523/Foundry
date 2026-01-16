import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import pytest
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

# Provide a reusable admin_token fixture for authenticated requests
@pytest.fixture(scope="module")
def admin_token(client):
    # Register a test admin
    signup_data = {
        "username": "testadmin",
        "email": "testadmin@example.com",
        "password": "TestPass123"
    }
    client.post("/api/auth/signup", json=signup_data)
    # Log in to get token
    response = client.post(
        "/api/auth/login",
        data={"username": signup_data["username"], "password": signup_data["password"]},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    token = response.json().get("access_token")
    return token
import pytest
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

# Set test DB URL before any app/model import
os.environ['FOUNDRY_DATABASE_URL'] = 'sqlite:///./test_foundry.db'

from server.database import Base, get_db
from server.model import Admin, Category, Component, CodeSnippet
from server.routers.auth import pwd_context
import server.main as main_module

# --------------------------------------------------
# Test Database (SQLite in-memory or file)
# --------------------------------------------------

TEST_DATABASE_URL = "sqlite:///./test_foundry.db"

engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)



# Ensure tables are created before any tests run
@pytest.fixture(scope="session", autouse=True)
def setup_test_database():
    Base.metadata.create_all(bind=engine)

# Create a FastAPI app with test DB override
@pytest.fixture(scope="session")
def test_app():
    app = main_module.app
    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()
    app.dependency_overrides[get_db] = override_get_db
    yield app

# Provide a test client for the app
@pytest.fixture(scope="module")
def client(test_app):
    with TestClient(test_app) as c:
        yield c

# --------------------------------------------------
# Fixtures
# --------------------------------------------------

@pytest.fixture
def test_admin():
    admin = Admin(
        username="admin1",
        email="admin1@example.com",
        hashed_password=pwd_context.hash("StrongPass1"),
        role="admin",
    )
    db = TestingSessionLocal()
    db.add(admin)
    db.commit()
    db.refresh(admin)
    yield admin
    with engine.connect() as conn:
        conn.execute(text("DELETE FROM admins"))
        conn.commit()


@pytest.fixture
def test_category():
    category = Category(name="Frontend")
    db = TestingSessionLocal()
    db.add(category)
    db.commit()
    db.refresh(category)
    yield category
    with engine.connect() as conn:
        conn.execute(text("DELETE FROM categories"))
        conn.commit()


@pytest.fixture
def test_component(test_category):
    component = Component(
        title="Button Component",
        use_case="Reusable primary button",
        category_id=test_category.id,
    )
    db = TestingSessionLocal()
    db.add(component)
    db.commit()
    db.refresh(component)
    yield component
    with engine.connect() as conn:
        conn.execute(text("DELETE FROM components"))
        conn.commit()


@pytest.fixture
def test_snippet(test_component):
    snippet = CodeSnippet(
        filename="Button.tsx",
        language="tsx",
        code="export const Button = () => <button />",
        component_id=test_component.id,
    )
    db = TestingSessionLocal()
    db.add(snippet)
    db.commit()
    db.refresh(snippet)
    yield snippet
    with engine.connect() as conn:
        conn.execute(text("DELETE FROM code_snippets"))
        conn.commit()
