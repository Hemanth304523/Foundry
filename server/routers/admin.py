from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status
from database import SessionLocal, get_db
from model import Admin, Component, Category, CodeSnippet, CategoryType
import schemas
from routers.auth import get_current_admin

router = APIRouter(
    prefix="/api/admin",
    tags=["admin"]
)

db_dependency = Annotated[Session, Depends(get_db)]
admin_dependency = Annotated[Admin, Depends(get_current_admin)]


# Initialize default categories
def init_categories(db: Session):
    """Initialize default categories if they don't exist"""
    for category_type in CategoryType:
        existing = db.query(Category).filter(Category.name == category_type).first()
        if not existing:
            new_category = Category(name=category_type)
            db.add(new_category)
    db.commit()


# Components endpoints
@router.post("/components", response_model=schemas.ComponentResponse, status_code=status.HTTP_201_CREATED)
async def create_component(
    component_data: schemas.ComponentCreate,
    db: db_dependency,
    current_admin: admin_dependency
):
    """Create a new component (admin only)"""
    
    init_categories(db)
    
    # Map category string to CategoryType
    category_mapping = {
        "frontend": CategoryType.frontend,
        "backend": CategoryType.backend,
        "database": CategoryType.database,
        "devops": CategoryType.devops
    }
    
    category_enum = category_mapping.get(component_data.category)
    if not category_enum:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid category"
        )
    
    category = db.query(Category).filter(Category.name == category_enum).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category not found"
        )
    
    new_component = Component(
        title=component_data.title,
        use_case=component_data.use_case,
        category_id=category.id
    )
    
    db.add(new_component)
    db.commit()
    db.refresh(new_component)
    
    return {
        "id": new_component.id,
        "title": new_component.title,
        "use_case": new_component.use_case,
        "category": category.name.value,
        "created_at": new_component.created_at,
        "updated_at": new_component.updated_at
    }


@router.get("/components", response_model=List[schemas.ComponentResponse])
async def list_admin_components(
    db: db_dependency,
    current_admin: admin_dependency,
    skip: int = 0,
    limit: int = 100
):
    """List all components (admin only)"""
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


@router.get("/components/{component_id}", response_model=schemas.ComponentWithSnippetsResponse)
async def get_admin_component(
    component_id: int,
    db: db_dependency,
    current_admin: admin_dependency
):
    """Get component with snippets (admin only)"""
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


@router.put("/components/{component_id}", response_model=schemas.ComponentResponse)
async def update_component(
    component_id: int,
    component_data: schemas.ComponentUpdate,
    db: db_dependency,
    current_admin: admin_dependency
):
    """Update component (admin only)"""
    component = db.query(Component).filter(Component.id == component_id).first()
    
    if not component:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Component not found"
        )
    
    if component_data.title:
        component.title = component_data.title
    if component_data.use_case:
        component.use_case = component_data.use_case
    if component_data.category:
        category_mapping = {
            "frontend": CategoryType.frontend,
            "backend": CategoryType.backend,
            "database": CategoryType.database,
            "devops": CategoryType.devops
        }
        category_enum = category_mapping.get(component_data.category)
        if category_enum:
            category = db.query(Category).filter(Category.name == category_enum).first()
            if category:
                component.category_id = category.id
    
    db.commit()
    db.refresh(component)
    
    return {
        "id": component.id,
        "title": component.title,
        "use_case": component.use_case,
        "category": component.category.name.value,
        "created_at": component.created_at,
        "updated_at": component.updated_at
    }


@router.delete("/components/{component_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_component(
    component_id: int,
    db: db_dependency,
    current_admin: admin_dependency
):
    """Delete component (admin only)"""
    component = db.query(Component).filter(Component.id == component_id).first()
    
    if not component:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Component not found"
        )
    
    db.delete(component)
    db.commit()


# Code snippets endpoints
@router.post("/components/{component_id}/snippets", response_model=schemas.CodeSnippetResponse, status_code=status.HTTP_201_CREATED)
async def create_snippet(
    component_id: int,
    snippet_data: schemas.CodeSnippetCreate,
    db: db_dependency,
    current_admin: admin_dependency
):
    """Add code snippet to component (admin only)"""
    component = db.query(Component).filter(Component.id == component_id).first()
    
    if not component:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Component not found"
        )
    
    new_snippet = CodeSnippet(
        filename=snippet_data.filename,
        language=snippet_data.language,
        code=snippet_data.code,
        component_id=component_id
    )
    
    db.add(new_snippet)
    db.commit()
    db.refresh(new_snippet)
    
    return {
        "id": new_snippet.id,
        "filename": new_snippet.filename,
        "language": new_snippet.language,
        "code": new_snippet.code,
        "created_at": new_snippet.created_at
    }


@router.put("/snippets/{snippet_id}", response_model=schemas.CodeSnippetResponse)
async def update_snippet(
    snippet_id: int,
    snippet_data: schemas.CodeSnippetUpdate,
    db: db_dependency,
    current_admin: admin_dependency
):
    """Update code snippet (admin only)"""
    snippet = db.query(CodeSnippet).filter(CodeSnippet.id == snippet_id).first()
    
    if not snippet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Snippet not found"
        )
    
    if snippet_data.filename:
        snippet.filename = snippet_data.filename
    if snippet_data.language:
        snippet.language = snippet_data.language
    if snippet_data.code:
        snippet.code = snippet_data.code
    
    db.commit()
    db.refresh(snippet)
    
    return {
        "id": snippet.id,
        "filename": snippet.filename,
        "language": snippet.language,
        "code": snippet.code,
        "created_at": snippet.created_at
    }


@router.delete("/snippets/{snippet_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_snippet(
    snippet_id: int,
    db: db_dependency,
    current_admin: admin_dependency
):
    """Delete code snippet (admin only)"""
    snippet = db.query(CodeSnippet).filter(CodeSnippet.id == snippet_id).first()
    
    if not snippet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Snippet not found"
        )
    
    db.delete(snippet)
    db.commit()
