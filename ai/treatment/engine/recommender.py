"""
Rule-based Treatment Recommendation Engine
TV3: AI/ML #2 — Treatment & Mapping
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
    action: str          # "spray" | "monitor" | "remove"
    medicine: Optional[str]
    dose: Optional[str]
    timing: Optional[str]
    note: str

class TreatmentEngine:
    def __init__(self, db_path: str = DB_PATH):
        with open(db_path, encoding="utf-8") as f:
            self.db = json.load(f)

    def get_severity(self, disease_id: str, confidence: float) -> str:
        """Phân loại mức độ nghiêm trọng dựa trên confidence score"""
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
        """Tạo phác đồ điều trị từ kết quả detection"""
        disease = self.db.get(detection.disease_id)
        if not disease or detection.disease_id == "healthy":
            return TreatmentPlan(
                disease_id   = detection.disease_id,
                disease_name = "Cây khỏe mạnh",
                severity     = "none",
                action       = "monitor",
                medicine     = None,
                dose         = None,
                timing       = None,
                note         = "Tiếp tục theo dõi, không cần can thiệp",
            )

        severity = self.get_severity(detection.disease_id, detection.confidence)
        tx = disease.get("treatment", {})

        # Quyết định hành động
        if severity == "high":
            action = "spray"
        elif severity == "medium":
            action = "spray"
        elif severity == "low":
            action = "monitor"
        else:
            action = "monitor"

        # Bệnh virus (khảm lá): nhổ bỏ nếu nặng
        if detection.disease_id in ("cassava_mosaic",) and severity == "high":
            action = "remove"

        return TreatmentPlan(
            disease_id   = detection.disease_id,
            disease_name = disease["name_vi"],
            severity     = severity,
            action       = action,
            medicine     = tx.get("medicine") if action == "spray" else None,
            dose         = tx.get("dose_per_ha") if action == "spray" else None,
            timing       = tx.get("timing") if action == "spray" else None,
            note         = tx.get("note", disease.get("prevention", "")),
        )

    def batch_recommend(self, detections: list[DetectionResult]) -> list[TreatmentPlan]:
        return [self.recommend(d) for d in detections]


if __name__ == "__main__":
    engine = TreatmentEngine()
    test = DetectionResult("rice_blast", confidence=0.91, bbox=[100, 80, 300, 200])
    plan = engine.recommend(test)
    print(f"Bệnh     : {plan.disease_name}")
    print(f"Mức độ   : {plan.severity}")
    print(f"Hành động: {plan.action}")
    print(f"Thuốc    : {plan.medicine}")
    print(f"Liều     : {plan.dose}")
    print(f"Thời điểm: {plan.timing}")
    print(f"Ghi chú  : {plan.note}")
