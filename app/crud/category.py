from sqlalchemy.orm import Session
from app.models.category import Category
from app.schemas.category import CategoryCreate


def get_all_categories(db: Session, domain: str = None, search: str = None):
    query = db.query(Category)
    
    if domain:
        query = query.filter(Category.domain.ilike(f"%{domain}%"))
    
    if search:
        query = query.filter(
            (Category.name.ilike(f"%{search}%")) |
            (Category.description.ilike(f"%{search}%"))
        )
    
    return query.order_by(Category.name).all()

def create_category(db: Session, category_data: CategoryCreate):
    category = Category(
        name=category_data.name,
        description=category_data.description,
        domain=category_data.domain if category_data.domain else None
    )
    db.add(category)
    db.commit()
    db.refresh(category)
    return category

def update_category(db: Session, category_id: int, category_data: CategoryCreate):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        return None
    
    if category_data.name:
        category.name = category_data.name
    if category_data.description:
        category.description = category_data.description
    if category_data.domain:
        category.domain = category_data.domain
    
    db.commit()
    db.refresh(category)
    return category