import uuid
import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas, auth

router = APIRouter(prefix="/bookings", tags=["Bookings"])

VALID_TRANSITIONS = {
    "PENDING": ["ACCEPTED", "REJECTED", "CANCELLED"],
    "ACCEPTED": ["IN_PROGRESS", "CANCELLED"],
    "IN_PROGRESS": ["COMPLETED"],
    "COMPLETED": [],
    "REJECTED": [],
    "CANCELLED": []
}

def format_booking(b: models.Booking) -> dict:
    return {
        "id": b.id,
        "booking_number": b.booking_number,
        "customer_id": b.customer_id,
        "technician_id": b.technician_id,
        "service_id": b.service_id,
        "customer_name": b.customer.user.full_name if b.customer and b.customer.user else "Unknown",
        "customer_phone": b.customer.user.phone if b.customer and b.customer.user else None,
        "customer_email": b.customer.user.email if b.customer and b.customer.user else None,
        "technician_name": b.technician.user.full_name if b.technician and b.technician.user else "Unknown",
        "technician_phone": b.technician.user.phone if b.technician and b.technician.user else None,
        "service_name": b.service.name if b.service else "General Service",
        "category_name": b.service.category.name if b.service and b.service.category else None,
        "problem_description": b.problem_description,
        "diagnosis_summary": b.diagnosis_summary,
        "address": b.address,
        "city": b.city,
        "latitude": b.latitude,
        "longitude": b.longitude,
        "preferred_date": b.preferred_date,
        "preferred_time": b.preferred_time,
        "status": b.status,
        "estimated_cost": b.estimated_cost,
        "final_amount": b.final_amount,
        "created_at": b.created_at,
        "completed_at": b.completed_at,
        "has_review": True if b.review else False,
        "has_complaint": True if (b.complaints and len(b.complaints) > 0) else False
    }

@router.post("", response_model=schemas.BookingOut)
def create_booking(
    data: schemas.BookingCreate,
    current_user: models.User = Depends(auth.require_role(["CUSTOMER"])),
    db: Session = Depends(get_db)
):
    cust_profile = current_user.customer_profile
    if not cust_profile:
        raise HTTPException(status_code=400, detail="Customer profile missing")

    # Check technician
    tech = db.query(models.TechnicianProfile).filter(models.TechnicianProfile.id == data.technician_id).first()
    if not tech:
        raise HTTPException(status_code=404, detail="Technician not found")
    if tech.status != "APPROVED":
        raise HTTPException(status_code=400, detail="Selected technician is not approved for bookings")
    if not tech.user.is_active:
        raise HTTPException(status_code=400, detail="Selected technician account is currently inactive")

    # Check service
    svc = db.query(models.Service).filter(models.Service.id == data.service_id).first()
    if not svc:
        raise HTTPException(status_code=404, detail="Service not found")

    booking_num = f"FX-{datetime.datetime.utcnow().strftime('%Y%m')}-{uuid.uuid4().hex[:6].upper()}"
    estimated_cost = data.estimated_cost or svc.price_estimate_min

    booking = models.Booking(
        booking_number=booking_num,
        customer_id=cust_profile.id,
        technician_id=tech.id,
        service_id=svc.id,
        problem_description=data.problem_description,
        diagnosis_summary=data.diagnosis_summary,
        address=data.address,
        city=data.city or "Pune",
        latitude=data.latitude or tech.latitude,
        longitude=data.longitude or tech.longitude,
        preferred_date=data.preferred_date,
        preferred_time=data.preferred_time,
        status="PENDING",
        estimated_cost=estimated_cost
    )
    db.add(booking)
    db.flush()

    # Record history
    history = models.BookingStatusHistory(
        booking_id=booking.id,
        previous_status=None,
        new_status="PENDING",
        changed_by_user_id=current_user.id,
        notes="Booking request initiated by customer."
    )
    db.add(history)

    # Notify technician
    tech_notif = models.Notification(
        user_id=tech.user_id,
        title="New Booking Request!",
        message=f"{current_user.full_name} has requested {svc.name} on {data.preferred_date} at {data.preferred_time}.",
        type="BOOKING",
        link_url="/technician/dashboard"
    )
    db.add(tech_notif)

    # Notify customer
    cust_notif = models.Notification(
        user_id=current_user.id,
        title="Booking Submitted",
        message=f"Your booking request {booking_num} for {svc.name} has been placed with {tech.user.full_name}.",
        type="BOOKING",
        link_url="/customer/dashboard"
    )
    db.add(cust_notif)

    db.commit()
    db.refresh(booking)
    return format_booking(booking)

@router.get("/my", response_model=List[schemas.BookingOut])
def get_my_bookings(
    status_filter: Optional[str] = None,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role == "CUSTOMER":
        cust = current_user.customer_profile
        if not cust:
            return []
        query = db.query(models.Booking).filter(models.Booking.customer_id == cust.id)
    elif current_user.role == "TECHNICIAN":
        tech = current_user.technician_profile
        if not tech:
            return []
        query = db.query(models.Booking).filter(models.Booking.technician_id == tech.id)
    elif current_user.role == "ADMIN":
        query = db.query(models.Booking)
    else:
        return []

    if status_filter:
        query = query.filter(models.Booking.status == status_filter.upper())

    bookings = query.order_by(models.Booking.created_at.desc()).all()
    return [format_booking(b) for b in bookings]

@router.get("/{booking_id}")
def get_booking_detail(
    booking_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    # Authorization
    if current_user.role == "CUSTOMER" and booking.customer.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access forbidden")
    elif current_user.role == "TECHNICIAN" and booking.technician.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access forbidden")

    history = [
        {
            "previous_status": h.previous_status,
            "new_status": h.new_status,
            "notes": h.notes,
            "created_at": h.created_at
        }
        for h in booking.history
    ]

    res = format_booking(booking)
    res["status_history"] = history
    return res

@router.patch("/{booking_id}/status")
def update_booking_status(
    booking_id: int,
    data: schemas.BookingStatusUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    new_status = data.status.upper()
    current_status = booking.status

    # Role permissions
    if current_user.role == "CUSTOMER":
        # Customer can only CANCEL a pending booking
        if new_status != "CANCELLED" or current_status != "PENDING":
            raise HTTPException(status_code=403, detail="Customers can only cancel PENDING bookings.")
    elif current_user.role == "TECHNICIAN":
        if booking.technician.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Cannot update another technician's booking.")
        # Technician must follow strict state machine!
        allowed = VALID_TRANSITIONS.get(current_status, [])
        if new_status not in allowed:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid status transition: Cannot move booking directly from {current_status} to {new_status}. Allowed: {allowed}"
            )
    elif current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Unauthorized")

    booking.status = new_status
    if new_status == "COMPLETED":
        booking.completed_at = datetime.datetime.utcnow()
        if data.final_amount:
            booking.final_amount = data.final_amount
        else:
            booking.final_amount = booking.estimated_cost
        # Increment technician total_jobs
        booking.technician.total_jobs = (booking.technician.total_jobs or 0) + 1

    # Record history
    hist = models.BookingStatusHistory(
        booking_id=booking.id,
        previous_status=current_status,
        new_status=new_status,
        changed_by_user_id=current_user.id,
        notes=data.notes or f"Status transitioned to {new_status}"
    )
    db.add(hist)

    # Trigger Automated Notifications
    if new_status == "ACCEPTED":
        db.add(models.Notification(
            user_id=booking.customer.user_id,
            title="Booking Accepted!",
            message=f"Technician {booking.technician.user.full_name} has accepted your booking {booking.booking_number}.",
            type="STATUS_CHANGE",
            link_url="/customer/dashboard"
        ))
    elif new_status == "IN_PROGRESS":
        db.add(models.Notification(
            user_id=booking.customer.user_id,
            title="Service In Progress",
            message=f"Technician {booking.technician.user.full_name} has arrived and commenced service for {booking.booking_number}.",
            type="STATUS_CHANGE",
            link_url="/customer/dashboard"
        ))
    elif new_status == "COMPLETED":
        db.add(models.Notification(
            user_id=booking.customer.user_id,
            title="Service Completed!",
            message=f"Your service {booking.booking_number} is completed. Please rate your technician to help maintain high quality!",
            type="REVIEW",
            link_url="/customer/dashboard"
        ))
    elif new_status == "REJECTED":
        db.add(models.Notification(
            user_id=booking.customer.user_id,
            title="Booking Declined",
            message=f"The technician was unable to accept booking {booking.booking_number}. Please choose another certified professional.",
            type="STATUS_CHANGE",
            link_url="/services"
        ))

    db.commit()
    return {"message": f"Booking status updated to {new_status}", "booking": format_booking(booking)}
