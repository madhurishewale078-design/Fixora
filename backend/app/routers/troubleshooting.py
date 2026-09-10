from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.ai.engine import TroubleshootingEngine
from app import schemas, auth, models

router = APIRouter(prefix="/troubleshooting", tags=["AI Troubleshooting Assistant"])

@router.get("/problems")
def list_problems():
    """List all supported diagnostic problems."""
    return TroubleshootingEngine.get_available_problems()

@router.post("/start")
def start_troubleshooting(
    data: schemas.TroubleshootingStartRequest,
    db: Session = Depends(get_db)
):
    """Initialize an interactive diagnosis session."""
    try:
        session_data = TroubleshootingEngine.start_session(
            problem_key=data.problem_key,
            user_id=None,
            db=db
        )
        return session_data
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/answer")
def submit_answer(
    data: schemas.TroubleshootingAnswer,
    db: Session = Depends(get_db)
):
    """Submit answer to current question, get next question or safe guidance/technician recommendation."""
    try:
        result = TroubleshootingEngine.process_answer(
            session_token=data.session_token,
            question_id=data.question_id,
            selected_option_id=data.selected_option_id,
            db=db
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
