"""
Rule-based Treatment Recommendation Engine
TV3: AI/ML #2 — Treatment & Mapping
Run: uv run python engine/recommender.py
"""
import json
from pathlib import Path
from dataclasses import dataclass
from typing import Optional

DB_PATH = Path(__file__).parent.parent / "database" / "diseases.json"


@dataclass
class DetectionResult:
    disease_id: str
    confidence: float
    bbox: list
    severity: Optional[str] = None


@dataclass
class TreatmentPlan:
    disease_id: str
    disease_name: str
    severity: str
    action: str           # "spray" | "monitor" | "remove"
    medicine: Optional[str]
    dose: Optional[str]
    timing: Optional[str]
    note: str


class TreatmentEngine:
    def __init__(self, db_path: str = DB_PATH):
        with open(db_path, encoding="utf-8") as f:
            self.db = json.load(f)

    def get_severity(self, disease_id: str, confidence: float) -> str:
        thresholds = self.db.get(disease_id, {}).get(
            "severity_thresholds", {"low": 0.5, "medium": 0.7, "high": 0.85}
        )
        if confidence >= thresholds["high"]:
            return "high"
        elif confidence >= thresholds["medium"]:
            return "medium"
        elif confidence >= thresholds["low"]:
            return "low"
        return "watch"

    def recommend(self, detection: DetectionResult) -> TreatmentPlan:
        disease = self.db.get(detection.disease_id)

        if not disease or detection.disease_id == "healthy":
            return TreatmentPlan(
                disease_id="healthy",
                disease_name="Cây khỏe mạnh",
                severity="none",
                action="monitor",
                medicine=None,
                dose=None,
                timing=None,
                note="Tiếp tục theo dõi, không cần can thiệp",
            )

        severity = self.get_severity(detection.disease_id, detection.confidence)
        tx = disease.get("treatment") or {}

        # Quyết định hành động
        if severity in ("high", "medium"):
            action = "spray"
        else:
            action = "monitor"

        # Bệnh virus → nhổ bỏ nếu nặng
        if detection.disease_id == "cassava_mosaic" and severity == "high":
            action = "remove"

        return TreatmentPlan(
            disease_id=detection.disease_id,
            disease_name=disease["name_vi"],
            severity=severity,
            action=action,
            medicine=tx.get("medicine") if action == "spray" else None,
            dose=tx.get("dose_per_ha") if action == "spray" else None,
            timing=tx.get("timing") if action == "spray" else None,
            note=tx.get("note", disease.get("prevention", "")),
        )

    def batch_recommend(self, detections: list[DetectionResult]) -> list[TreatmentPlan]:
        return [self.recommend(d) for d in detections]


if __name__ == "__main__":
    engine = TreatmentEngine()
    tests = [
        DetectionResult("rice_blast",      confidence=0.91, bbox=[]),
        DetectionResult("cassava_mosaic",  confidence=0.90, bbox=[]),
        DetectionResult("healthy",         confidence=0.98, bbox=[]),
    ]
    for det in tests:
        plan = engine.recommend(det)
        print(f"{plan.disease_name:30s} | {plan.severity:6s} | {plan.action:7s} | {plan.medicine or '—'}")
