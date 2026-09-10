import uuid
import json
from typing import Dict, Any, Optional, List
from app.ai.rules import PROBLEMS_DATA
from app import models
from sqlalchemy.orm import Session

class TroubleshootingEngine:
    """
    Fixora AI Troubleshooting Engine:
    Structured Decision-Tree & Safe Diagnostic Layer with future LLM-ready hook.
    Core USP: 'Diagnose First. Book Only When Needed.'
    """

    @classmethod
    def get_available_problems(cls) -> List[Dict[str, Any]]:
        results = []
        for key, prob in PROBLEMS_DATA.items():
            results.append({
                "problem_key": prob["problem_key"],
                "title": prob["title"],
                "category_slug": prob["category_slug"],
                "description": prob["description"],
                "icon": prob["icon"]
            })
        return results

    @classmethod
    def start_session(cls, problem_key: str, user_id: Optional[int], db: Session) -> Dict[str, Any]:
        if problem_key not in PROBLEMS_DATA:
            raise ValueError(f"Unknown problem key: {problem_key}")

        problem = PROBLEMS_DATA[problem_key]
        first_q_id = problem["first_question"]
        first_q = problem["questions"][first_q_id]

        token = str(uuid.uuid4())
        session = models.TroubleshootingSession(
            session_token=token,
            user_id=user_id,
            problem_key=problem_key,
            history_json=json.dumps([]),
            final_outcome="IN_PROGRESS"
        )
        db.add(session)
        db.commit()
        db.refresh(session)

        return {
            "session_token": token,
            "problem_key": problem_key,
            "problem_title": problem["title"],
            "current_question": first_q,
            "is_completed": False,
            "outcome": None
        }

    @classmethod
    def process_answer(cls, session_token: str, question_id: str, selected_option_id: str, db: Session) -> Dict[str, Any]:
        session = db.query(models.TroubleshootingSession).filter(
            models.TroubleshootingSession.session_token == session_token
        ).first()

        if not session:
            raise ValueError("Session not found")

        problem = PROBLEMS_DATA.get(session.problem_key)
        if not problem:
            raise ValueError("Problem configuration not found")

        # Check question exists
        question = problem["questions"].get(question_id)
        if not question:
            raise ValueError(f"Question {question_id} not found for problem {session.problem_key}")

        # Find option
        chosen_opt = next((opt for opt in question["options"] if opt["id"] == selected_option_id), None)
        if not chosen_opt:
            raise ValueError(f"Invalid option: {selected_option_id}")

        # Record history
        history = json.loads(session.history_json or "[]")
        history.append({
            "question_id": question_id,
            "question_text": question["text"],
            "selected_option_id": selected_option_id,
            "selected_option_text": chosen_opt["text"]
        })
        session.history_json = json.dumps(history)

        next_target = chosen_opt["next"]

        # Check if next_target is an outcome
        if next_target in problem.get("outcomes", {}):
            outcome_data = problem["outcomes"][next_target]
            session.final_outcome = outcome_data["type"]
            session.diagnosis_notes = outcome_data["guidance"]

            # Look up recommended service
            rec_service_slug = outcome_data.get("recommended_service_slug")
            rec_service = None
            if rec_service_slug:
                category = db.query(models.ServiceCategory).filter(
                    models.ServiceCategory.slug == rec_service_slug
                ).first()
                if category and category.services:
                    svc = category.services[0]
                    session.recommended_service_id = svc.id
                    rec_service = {
                        "id": svc.id,
                        "name": svc.name,
                        "category_name": category.name,
                        "price_estimate_min": svc.price_estimate_min,
                        "price_estimate_max": svc.price_estimate_max,
                        "icon": svc.icon
                    }

            db.commit()

            return {
                "session_token": session_token,
                "problem_key": session.problem_key,
                "problem_title": problem["title"],
                "is_completed": True,
                "outcome": outcome_data["type"],  # SAFE_RESOLVED or TECHNICIAN_REQUIRED
                "outcome_title": outcome_data["title"],
                "guidance": outcome_data["guidance"],
                "steps": outcome_data.get("steps", []),
                "price_estimate": outcome_data.get("price_estimate"),
                "recommended_service": rec_service,
                "history": history
            }

        # Otherwise next_target is another question
        elif next_target in problem["questions"]:
            next_q = problem["questions"][next_target]
            db.commit()
            return {
                "session_token": session_token,
                "problem_key": session.problem_key,
                "problem_title": problem["title"],
                "current_question": next_q,
                "is_completed": False,
                "outcome": None,
                "history": history
            }
        else:
            raise ValueError(f"Invalid state transition target: {next_target}")
