from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app import models, schemas, auth

router = APIRouter(prefix="/reviews", tags=["Reviews & Ratings"])

@router.post("", response_model=schemas.ReviewOut)
def create_review(
    data: schemas.ReviewCreate,
    current_user: models.User = Depends(auth.require_role(["CUSTOMER"])),
    db: Session = Depends(get_db)
):
    cust_profile = current_user.customer_profile
    if not cust_profile:
        raise HTTPException(status_code=400, detail="Customer profile required")

    # Check booking
    booking = db.query(models.Booking).filter(models.Booking.id == data.booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    if booking.customer_id != cust_profile.id:
        raise HTTPException(status_code=403, detail="You can only review your own bookings")

    if booking.status != "COMPLETED":
        raise HTTPException(status_code=400, detail="Reviews can only be submitted for COMPLETED bookings")

    # Prevent duplicates
    existing = db.query(models.Review).filter(models.Review.booking_id == data.booking_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="You have already reviewed this booking")

    if data.rating < 1 or data.rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5 stars")

    review = models.Review(
        booking_id=booking.id,
        customer_id=cust_profile.id,
        technician_id=booking.technician_id,
        rating=data.rating,
        comment=data.comment
    )
    db.add(review)
    db.flush()

    # Recalculate technician rating
    tech = booking.technician
    all_ratings = db.query(models.Review.rating).filter(models.Review.technician_id == tech.id).all()
    if all_ratings:
        total = sum(r[0] for r in all_ratings)
        count = len(all_ratings)
        tech.rating = round(total / count, 2)
        tech.total_reviews = count

    # Notify technician of new review
    db.add(models.Notification(
        user_id=tech.user_id,
        title="New Review Received!",
        message=f"{current_user.full_name} gave you {data.rating} stars for booking {booking.booking_number}.",
        type="REVIEW",
        link_url="/technician/dashboard"
    ))

    db.commit()
    db.refresh(review)

    return {
        "id": review.id,
        "booking_id": review.booking_id,
        "customer_name": current_user.full_name,
        "technician_name": tech.user.full_name,
        "rating": review.rating,
        "comment": review.comment,
        "created_at": review.created_at
    }

@router.get("/technician/{technician_id}", response_model=List[schemas.ReviewOut])
def get_technician_reviews(technician_id: int, db: Session = Depends(get_db)):
    reviews = db.query(models.Review).filter(
        models.Review.technician_id == technician_id
    ).order_by(models.Review.created_at.desc()).all()

    result = []
    for r in reviews:
        result.append({
            "id": r.id,
            "booking_id": r.booking_id,
            "customer_name": r.customer.user.full_name if r.customer and r.customer.user else "Customer",
            "technician_name": r.technician.user.full_name if r.technician and r.technician.user else "Technician",
            "rating": r.rating,
            "comment": r.comment,
            "created_at": r.created_at
        })
    return result
