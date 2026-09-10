import uuid
import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas, auth

router = APIRouter(prefix="/complaints", tags=["Complaints"])

def format_complaint(c: models.Complaint) -> dict:
    return {
        "id": c.id,
        "complaint_number": c.complaint_number,
        "booking_id": c.booking_id,
        "customer_id": c.customer_id,
        "customer_name": c.customer.user.full_name if c.customer and c.customer.user else "Customer",
        "technician_id": c.technician_id,
        "technician_name": c.technician.user.full_name if c.technician and c.technician.user else "Technician",
        "subject": c.subject,
        "description": c.description,
        "status": c.status,
        "admin_response": c.admin_response,
        "resolved_at": c.resolved_at,
        "created_at": c.created_at
    }

@router.post("", response_model=schemas.ComplaintOut)
def create_complaint(
    data: schemas.ComplaintCreate,
    current_user: models.User = Depends(auth.require_role(["CUSTOMER"])),
    db: Session = Depends(get_db)
):
    cust = current_user.customer_profile
    if not cust:
        raise HTTPException(status_code=400, detail="Customer profile missing")

    booking = db.query(models.Booking).filter(models.Booking.id == data.booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    if booking.customer_id != cust.id:
        raise HTTPException(status_code=403, detail="You can only file complaints for your own bookings")

    cmp_num = f"CMP-{datetime.datetime.utcnow().strftime('%Y%m')}-{uuid.uuid4().hex[:5].upper()}"
    complaint = models.Complaint(
        complaint_number=cmp_num,
        booking_id=booking.id,
        customer_id=cust.id,
        technician_id=booking.technician_id,
        subject=data.subject,
        description=data.description,
        status="OPEN"
    )
    db.add(complaint)

    # Notify admins
    admins = db.query(models.User).filter(models.User.role == "ADMIN").all()
    for admin in admins:
        db.add(models.Notification(
            user_id=admin.id,
            title="New Customer Complaint",
            message=f"Complaint {cmp_num} opened regarding booking {booking.booking_number}: '{data.subject}'",
            type="COMPLAINT",
            link_url="/admin/complaints"
        ))

    db.commit()
    db.refresh(complaint)
    return format_complaint(complaint)

@router.get("/my", response_model=List[schemas.ComplaintOut])
def get_my_complaints(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role == "CUSTOMER":
        cust = current_user.customer_profile
        if not cust:
            return []
        complaints = db.query(models.Complaint).filter(models.Complaint.customer_id == cust.id).order_by(models.Complaint.created_at.desc()).all()
    elif current_user.role == "TECHNICIAN":
        tech = current_user.technician_profile
        if not tech:
            return []
        complaints = db.query(models.Complaint).filter(models.Complaint.technician_id == tech.id).order_by(models.Complaint.created_at.desc()).all()
    elif current_user.role == "ADMIN":
        complaints = db.query(models.Complaint).order_by(models.Complaint.created_at.desc()).all()
    else:
        return []

    return [format_complaint(c) for c in complaints]
