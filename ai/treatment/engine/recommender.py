from pydantic import BaseModel
from typing import Dict, List, Optional


class Pesticide(BaseModel):
    name: str
    dosage: str
    frequency: str
    cost_per_ha: int


class TreatmentPlan(BaseModel):
    pest_type: str
    severity: str
    recommended_pesticides: List[Pesticide]
    application_method: str
    target_zones: List[str]
    estimated_effectiveness: float
    notes: Optional[str] = None


# ── Internal Database for Rice and Tomato ──

CROP_DATABASE: Dict[str, Dict[str, TreatmentPlan]] = {
    # ── RICE (LÚA) ──
    "lua": {
        "Rầy nâu": TreatmentPlan(
            pest_type="Rầy nâu",
            severity="Tùy thuộc ngưỡng",
            recommended_pesticides=[
                Pesticide(
                    name="Thiamethoxam 25%WG",
                    dosage="0.5g/L nước",
                    frequency="2 lần/tuần",
                    cost_per_ha=450000,
                ),
                Pesticide(
                    name="Buprofezin 25%SC",
                    dosage="1.5ml/L nước",
                    frequency="1 lần/tuần",
                    cost_per_ha=320000,
                ),
            ],
            application_method="UAV Spraying (Tầm thấp)",
            target_zones=[],
            estimated_effectiveness=0.92,
            notes="Phun trực tiếp vào gốc lúa, giữ mực nước ruộng 3-5cm để tăng hiệu quả.",
        ),
        "Sâu đục thân": TreatmentPlan(
            pest_type="Sâu đục thân",
            severity="Tùy thuộc ngưỡng",
            recommended_pesticides=[
                Pesticide(
                    name="Fipronil 5%SC",
                    dosage="1ml/L nước",
                    frequency="1 lần/tuần",
                    cost_per_ha=280000,
                ),
                Pesticide(
                    name="Chlorantraniliprole 5%SC",
                    dosage="0.8ml/L nước",
                    frequency="1 lần/tuần",
                    cost_per_ha=350000,
                ),
            ],
            application_method="UAV Spraying (Tầm trung)",
            target_zones=[],
            estimated_effectiveness=0.88,
            notes="Phun khi bướm rộ 5-7 ngày, tập trung vùng có dảnh héo.",
        ),
        "Đạo ôn": TreatmentPlan(
            pest_type="Đạo ôn",
            severity="Tùy thuộc ngưỡng",
            recommended_pesticides=[
                Pesticide(
                    name="Tricyclazole 75%WP",
                    dosage="1g/L nước",
                    frequency="2 lần/tuần",
                    cost_per_ha=400000,
                ),
                Pesticide(
                    name="Isoprothiolane 40%EC",
                    dosage="1.5ml/L nước",
                    frequency="1 lần/tuần",
                    cost_per_ha=300000,
                ),
            ],
            application_method="UAV Spraying (Phủ rải đều)",
            target_zones=[],
            estimated_effectiveness=0.90,
            notes="Kết hợp ngừng bón phân đạm, giữ nước mặt ruộng ẩm.",
        ),
        "Sâu cuốn lá": TreatmentPlan(
            pest_type="Sâu cuốn lá",
            severity="Tùy thuộc ngưỡng",
            recommended_pesticides=[
                Pesticide(
                    name="Chlorpyrifos 40%EC",
                    dosage="1.5ml/L nước",
                    frequency="1 lần/tuần",
                    cost_per_ha=160000,
                ),
                Pesticide(
                    name="Emamectin Benzoate 5WG",
                    dosage="0.5g/L nước",
                    frequency="1 lần/tuần",
                    cost_per_ha=250000,
                ),
            ],
            application_method="UAV Spraying",
            target_zones=[],
            estimated_effectiveness=0.85,
            notes="Phun thuốc khi sâu non tuổi 1-2, mật độ > 20 con/m2.",
        ),
    },
    # ── TOMATO (CÀ CHUA) ──
    "ca_chua": {
        "Sương mai": TreatmentPlan(
            pest_type="Sương mai",
            severity="Tùy thuộc ngưỡng",
            recommended_pesticides=[
                Pesticide(
                    name="Mancozeb 80%WP",
                    dosage="2.5g/L nước",
                    frequency="2 lần/tuần",
                    cost_per_ha=380000,
                ),
                Pesticide(
                    name="Metalaxyl 25%WP",
                    dosage="1.5g/L nước",
                    frequency="1 lần/tuần",
                    cost_per_ha=420000,
                ),
            ],
            application_method="Manual Spraying / UAV Spraying (Tầm cao)",
            target_zones=[],
            estimated_effectiveness=0.89,
            notes="Bệnh phát triển mạnh ở độ ẩm > 85%, nhiệt độ 18-22°C. Tránh tưới nước vào chiều muộn.",
        ),
        "Héo xanh": TreatmentPlan(
            pest_type="Héo xanh",
            severity="Tùy thuộc ngưỡng",
            recommended_pesticides=[
                # Héo xanh vi khuẩn khó trị bằng thuốc hóa học, ưu tiên phòng trừ
                Pesticide(
                    name="Kasugamycin 2L",
                    dosage="2ml/L nước",
                    frequency="2 lần/tuần",
                    cost_per_ha=500000,
                ),
                Pesticide(
                    name="Copper Hydroxide",
                    dosage="2g/L nước",
                    frequency="1 lần/tuần",
                    cost_per_ha=300000,
                ),
            ],
            application_method="Tưới rễ / Full coverage",
            target_zones=[],
            estimated_effectiveness=0.60,
            notes="Bệnh do vi khuẩn, lây qua đất và nước. Cần nhổ bỏ cây bệnh, xử lý đất bằng vôi bột.",
        ),
        "Sâu xám": TreatmentPlan(
            pest_type="Sâu xám",
            severity="Tùy thuộc ngưỡng",
            recommended_pesticides=[
                Pesticide(
                    name="Cypermethrin 10EC",
                    dosage="1.5ml/L nước",
                    frequency="1 lần/tuần",
                    cost_per_ha=220000,
                ),
            ],
            application_method="Phun đất / Gốc cây (Tối/Chiều mát)",
            target_zones=[],
            estimated_effectiveness=0.85,
            notes="Sâu cắn rễ non/gốc cây con vào ban đêm. Phun thuốc vào chiều mát.",
        ),
        "Khảm lá": TreatmentPlan(
            pest_type="Khảm lá",
            severity="Tùy thuộc ngưỡng",
            recommended_pesticides=[
                # Bệnh do virus bọ phấn trắng truyền
                Pesticide(
                    name="Dinotefuran 20%WP",
                    dosage="1g/L nước",
                    frequency="2 lần/tuần",
                    cost_per_ha=480000,
                ),  # Trị bọ phấn
            ],
            application_method="UAV Spraying",
            target_zones=[],
            estimated_effectiveness=0.75,
            notes="Bệnh do Virus truyền qua côn trùng chích hút (bọ phấn trắng). Trị lây truyền là chính.",
        ),
    },
}


def get_treatment(
    crop: str, disease: str, severity: str = "medium"
) -> Optional[TreatmentPlan]:
    """Retrieves treatment plan for a specific crop and disease from the internal DB"""
    crop_data = CROP_DATABASE.get(crop)
    if not crop_data:
        return None

    plan = crop_data.get(disease)
    if not plan:
        return None

    # Return a copy with adjusted severity
    plan_copy = plan.copy(deep=True)
    plan_copy.severity = severity
    return plan_copy
