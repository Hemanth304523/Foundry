from sqlalchemy import Column, Integer, String, Text, ForeignKey, Enum, DateTime
from sqlalchemy.orm import relationship, declarative_base
import enum
from datetime import datetime

Base = declarative_base()


class CategoryType(enum.Enum):
    frontend = "Frontend"
    backend = "Backend"
    database = "Database"
    devops = "DevOps & Cloud"


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(Enum(CategoryType), unique=True, nullable=False)

    components = relationship("Component", back_populates="category")


class Component(Base):
    __tablename__ = "components"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    use_case = Column(Text, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    category = relationship("Category", back_populates="components")
    snippets = relationship("CodeSnippet", back_populates="component", cascade="all, delete-orphan")


class CodeSnippet(Base):
    __tablename__ = "code_snippets"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    language = Column(String(50), nullable=False)
    code = Column(Text, nullable=False)
    component_id = Column(Integer, ForeignKey("components.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    component = relationship("Component", back_populates="snippets")


class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="admin", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)