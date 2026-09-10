from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/services", tags=["Services & Technicians"])

@router.get("/categories", response_model=List[schemas.ServiceCategoryOut])
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(models.ServiceCategory).filter(models.ServiceCategory.is_active == True).all()
    return categories

@router.get("/items", response_model=List[schemas.ServiceOut])
def get_services(category_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(models.Service).filter(models.Service.is_active == True)
    if category_id:
        query = query.filter(models.Service.category_id == category_id)
    return query.all()

@router.get("/technicians", response_model=List[schemas.TechnicianOut])
def get_technicians(
    category_id: Optional[int] = None,
    service_id: Optional[int] = None,
    service_area: Optional[str] = None,
    search: Optional[str] = None,
    min_rating: Optional[float] = None,
    db: Session = Depends(get_db)
):
    # Only APPROVED technicians appear in public search!
    query = db.query(models.TechnicianProfile).join(models.User).filter(
        models.TechnicianProfile.status == "APPROVED",
        models.User.is_active == True
    )

    if category_id:
        query = query.filter(models.TechnicianProfile.category_id == category_id)

    if service_area:
        query = query.filter(models.TechnicianProfile.service_area.ilike(f"%{service_area}%"))

    if min_rating:
        query = query.filter(models.TechnicianProfile.rating >= min_rating)

    if search:
        query = query.filter(
            or_(
                models.User.full_name.ilike(f"%{search}%"),
                models.TechnicianProfile.bio.ilike(f"%{search}%"),
                models.TechnicianProfile.service_area.ilike(f"%{search}%")
            )
        )

    technicians = query.all()
    results = []
    for tech in technicians:
        results.append({
            "id": tech.id,
            "user_id": tech.user_id,
            "full_name": tech.user.full_name,
            "email": tech.user.email,
            "phone": tech.user.phone,
            "category_name": tech.category.name if tech.category else None,
            "category_id": tech.category_id,
            "experience_years": tech.experience_years,
            "service_area": tech.service_area,
            "address": tech.address,
            "city": tech.city,
            "latitude": tech.latitude,
            "longitude": tech.longitude,
            "bio": tech.bio,
            "status": tech.status,
            "rating": tech.rating,
            "total_reviews": tech.total_reviews,
            "total_jobs": tech.total_jobs,
            "hourly_rate": tech.hourly_rate,
            "avatar_url": tech.avatar_url,
            "services": tech.services,
            "created_at": tech.created_at
        })
    return results

@router.get("/technicians/{technician_id}")
def get_technician_detail(technician_id: int, db: Session = Depends(get_db)):
    tech = db.query(models.TechnicianProfile).filter(
        models.TechnicianProfile.id == technician_id,
        models.TechnicianProfile.status == "APPROVED"
    ).first()

    if not tech:
        raise HTTPException(status_code=404, detail="Technician not found or not approved.")

    reviews = db.query(models.Review).filter(models.Review.technician_id == tech.id).order_by(models.Review.created_at.desc()).limit(10).all()
    review_list = []
    for r in reviews:
        review_list.append({
            "id": r.id,
            "customer_name": r.customer.user.full_name if r.customer and r.customer.user else "Customer",
            "rating": r.rating,
            "comment": r.comment,
            "created_at": r.created_at
        })

    return {
        "id": tech.id,
        "user_id": tech.user_id,
        "full_name": tech.user.full_name,
        "email": tech.user.email,
        "phone": tech.user.phone,
        "category_name": tech.category.name if tech.category else None,
        "category_id": tech.category_id,
        "experience_years": tech.experience_years,
        "service_area": tech.service_area,
        "address": tech.address,
        "city": tech.city,
        "latitude": tech.latitude,
        "longitude": tech.longitude,
        "bio": tech.bio,
        "status": tech.status,
        "rating": tech.rating,
        "total_reviews": tech.total_reviews,
        "total_jobs": tech.total_jobs,
        "hourly_rate": tech.hourly_rate,
        "avatar_url": tech.avatar_url,
        "services": [
            {
                "id": s.id,
                "name": s.name,
                "description": s.description,
                "price_estimate_min": s.price_estimate_min,
                "price_estimate_max": s.price_estimate_max,
                "duration_estimate": s.duration_estimate
            }
            for s in tech.services
        ],
        "reviews": review_list,
        "created_at": tech.created_at
    }
