from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas, auth
from app.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register/customer", response_model=schemas.Token)
def register_customer(data: schemas.CustomerRegister, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == data.email.lower()).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")

    hashed_pw = auth.get_password_hash(data.password)
    user = models.User(
        email=data.email.lower(),
        hashed_password=hashed_pw,
        full_name=data.full_name,
        phone=data.phone,
        role="CUSTOMER",
        is_active=True
    )
    db.add(user)
    db.flush()

    customer_profile = models.CustomerProfile(
        user_id=user.id,
        address=data.address,
        city=data.city or "Pune",
        latitude=18.5204,
        longitude=73.8567
    )
    db.add(customer_profile)

    # Welcome notification
    notif = models.Notification(
        user_id=user.id,
        title="Welcome to Fixora!",
        message="Your account has been successfully created. Diagnose home issues anytime before booking!",
        type="SYSTEM",
        link_url="/customer/dashboard"
    )
    db.add(notif)
    db.commit()
    db.refresh(user)

    token = auth.create_access_token(data={"sub": str(user.id), "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "phone": user.phone,
            "customer_id": customer_profile.id,
            "address": customer_profile.address,
            "city": customer_profile.city
        }
    }

@router.post("/register/technician")
def register_technician(data: schemas.TechnicianRegister, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == data.email.lower()).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")

    cat = db.query(models.ServiceCategory).filter(models.ServiceCategory.id == data.category_id).first()
    if not cat:
        raise HTTPException(status_code=400, detail="Invalid service category selected.")

    hashed_pw = auth.get_password_hash(data.password)
    user = models.User(
        email=data.email.lower(),
        hashed_password=hashed_pw,
        full_name=data.full_name,
        phone=data.phone,
        role="TECHNICIAN",
        is_active=True
    )
    db.add(user)
    db.flush()

    tech_profile = models.TechnicianProfile(
        user_id=user.id,
        category_id=data.category_id,
        experience_years=data.experience_years,
        service_area=data.service_area,
        address=data.address,
        city=data.city or "Pune",
        bio=data.bio,
        hourly_rate=data.hourly_rate or 400.0,
        status="PENDING",
        rating=5.0,
        avatar_url=f"https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80"
    )
    db.add(tech_profile)

    # Attach all services in this category by default
    for svc in cat.services:
        tech_profile.services.append(svc)

    # Notification to Admin
    admin_users = db.query(models.User).filter(models.User.role == "ADMIN").all()
    for admin in admin_users:
        db.add(models.Notification(
            user_id=admin.id,
            title="New Technician Application",
            message=f"{user.full_name} applied for {cat.name} in {data.service_area}. Review profile to approve.",
            type="APPROVAL",
            link_url="/admin/technicians"
        ))

    db.commit()

    return {
        "message": "Registration successful! Your application has been submitted and is currently PENDING admin approval. You will be notified once approved.",
        "status": "PENDING",
        "email": user.email
    }

@router.post("/login", response_model=schemas.Token)
def login(data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == data.email.lower()).first()
    if not user or not auth.verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )

    if not user.is_active:
        raise HTTPException(status_code=400, detail="This account has been deactivated.")

    # If technician, verify approval status
    user_data = {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
        "phone": user.phone
    }

    if user.role == "TECHNICIAN":
        tech = user.technician_profile
        if not tech:
            raise HTTPException(status_code=400, detail="Technician profile not found.")
        if tech.status == "PENDING":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your technician application is currently PENDING approval by Admin. Please check back later."
            )
        elif tech.status == "REJECTED":
            reason = tech.rejection_reason or "Application did not meet requirements."
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Your technician application was REJECTED. Reason: {reason}"
            )
        elif tech.status == "SUSPENDED":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your technician account is SUSPENDED. Please contact Fixora support."
            )
        user_data["technician_id"] = tech.id
        user_data["status"] = tech.status
        user_data["service_area"] = tech.service_area
        user_data["category_name"] = tech.category.name if tech.category else None
        user_data["rating"] = tech.rating

    elif user.role == "CUSTOMER":
        cust = user.customer_profile
        if cust:
            user_data["customer_id"] = cust.id
            user_data["address"] = cust.address
            user_data["city"] = cust.city

    token = auth.create_access_token(data={"sub": str(user.id), "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user_data
    }

@router.get("/me")
def get_current_user_profile(current_user: models.User = Depends(auth.get_current_user)):
    user_data = {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "role": current_user.role,
        "phone": current_user.phone,
        "created_at": current_user.created_at
    }
    if current_user.role == "CUSTOMER" and current_user.customer_profile:
        user_data["customer_id"] = current_user.customer_profile.id
        user_data["address"] = current_user.customer_profile.address
        user_data["city"] = current_user.customer_profile.city
    elif current_user.role == "TECHNICIAN" and current_user.technician_profile:
        tech = current_user.technician_profile
        user_data["technician_id"] = tech.id
        user_data["status"] = tech.status
        user_data["service_area"] = tech.service_area
        user_data["experience_years"] = tech.experience_years
        user_data["category_name"] = tech.category.name if tech.category else None
        user_data["rating"] = tech.rating
        user_data["total_jobs"] = tech.total_jobs
        user_data["bio"] = tech.bio
        user_data["hourly_rate"] = tech.hourly_rate
    return user_data

@router.put("/profile")
def update_profile(data: schemas.UserUpdate, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    if data.full_name is not None:
        current_user.full_name = data.full_name
    if data.phone is not None:
        current_user.phone = data.phone

    if current_user.role == "CUSTOMER" and current_user.customer_profile:
        if data.address is not None:
            current_user.customer_profile.address = data.address
        if data.city is not None:
            current_user.customer_profile.city = data.city

    elif current_user.role == "TECHNICIAN" and current_user.technician_profile:
        tech = current_user.technician_profile
        if data.address is not None:
            tech.address = data.address
        if data.city is not None:
            tech.city = data.city
        if data.bio is not None:
            tech.bio = data.bio
        if data.service_area is not None:
            tech.service_area = data.service_area
        if data.hourly_rate is not None:
            tech.hourly_rate = data.hourly_rate

    db.commit()
    return {"message": "Profile updated successfully"}

@router.post("/change-password")
def change_password(data: schemas.PasswordChange, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    if not auth.verify_password(data.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect current password")

    current_user.hashed_password = auth.get_password_hash(data.new_password)
    db.commit()
    return {"message": "Password changed successfully"}

@router.post("/forgot-password")
def forgot_password(data: schemas.ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == data.email.lower()).first()
    # Return generic success message for security
    return {
        "message": "If an account with this email exists, password reset instructions have been dispatched."
    }
