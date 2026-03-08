import sys
import os
from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import List

# Path hack to allow importing from ai module
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../..")))
from ai.treatment.engine.recommender import get_treatment, TreatmentPlan

router = APIRouter()


class IrrigationResponse(BaseModel):
    status: str
    zones_activated: List[str]
    duration_minutes: int
    message: str


@router.get("/treatments/plan", response_model=TreatmentPlan)
def get_treatment_plan(
    crop: str = Query(default="lua", description="lua or ca_chua"),
    pest: str = Query(default="Rầy nâu"),
    severity: str = Query(default="critical"),
):
    plan = get_treatment(crop, pest, severity)
    if plan:
        # Mock target zones based on severity
        zones = ["Khu A", "Khu B"] if severity == "critical" else ["Khu C"]
        plan.target_zones = zones
        return plan

    # Fallback
    return TreatmentPlan(
        pest_type="Bệnh không xác định",
        severity=severity,
        recommended_pesticides=[],
        application_method="Manual Inspection",
        target_zones=[],
        estimated_effectiveness=0.0,
    )


@router.post("/irrigation/trigger", response_model=IrrigationResponse)
def trigger_irrigation():
    return IrrigationResponse(
        status="success",
        zones_activated=["Khu A", "Khu B", "Khu C", "Khu D"],
        duration_minutes=45,
        message="Hệ thống tưới tự động đã được kích hoạt thành công cho toàn bộ khu vực",
    )
