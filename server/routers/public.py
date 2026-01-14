from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status
from database import SessionLocal
from model import Component, Category, CodeSnippet
import schemas

router = APIRouter(
    prefix="/api",
    tags=["public"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]


@router.get("/categories", response_model=List[schemas.CategoryResponse])
async def get_categories(db: db_dependency):
    """Get all categories"""
    categories = db.query(Category).all()
    return [
        {
            "id": c.id,
            "name": c.name.value
        }
        for c in categories
    ]


@router.get("/components", response_model=List[schemas.ComponentResponse])
async def list_components(
    db: db_dependency,
    skip: int = 0,
    limit: int = 100
):
    """Get all components"""
    components = db.query(Component).offset(skip).limit(limit).all()
    
    result = []
    for component in components:
        result.append({
            "id": component.id,
            "title": component.title,
            "use_case": component.use_case,
            "category": component.category.name.value,
            "created_at": component.created_at,
            "updated_at": component.updated_at
        })
    
    return result


@router.get("/categories/{category_name}/components", response_model=List[schemas.ComponentResponse])
async def get_components_by_category(
    category_name: str,
    db: db_dependency
):
    """Get components by category name"""
    from model import CategoryType
    
    # Map category name to enum
    category_mapping = {
        "frontend": CategoryType.frontend,
        "backend": CategoryType.backend,
        "database": CategoryType.database,
        "devops": CategoryType.devops
    }
    
    category_enum = category_mapping.get(category_name.lower())
    if not category_enum:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid category name"
        )
    
    category = db.query(Category).filter(Category.name == category_enum).first()
    
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    
    components = db.query(Component).filter(Component.category_id == category.id).all()
    
    result = []
    for component in components:
        result.append({
            "id": component.id,
            "title": component.title,
            "use_case": component.use_case,
            "category": component.category.name.value,
            "created_at": component.created_at,
            "updated_at": component.updated_at
        })
    
    return result


@router.get("/components/{component_id}", response_model=schemas.ComponentWithSnippetsResponse)
async def get_component_detail(
    component_id: int,
    db: db_dependency
):
    """Get component with all code snippets"""
    component = db.query(Component).filter(Component.id == component_id).first()
    
    if not component:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Component not found"
        )
    
    snippets = [
        {
            "id": s.id,
            "filename": s.filename,
            "language": s.language,
            "code": s.code,
            "created_at": s.created_at
        }
        for s in component.snippets
    ]
    
    return {
        "id": component.id,
        "title": component.title,
        "use_case": component.use_case,
        "category": component.category.name.value,
        "snippets": snippets,
        "created_at": component.created_at,
        "updated_at": component.updated_at
    }
