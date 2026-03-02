from fastapi import APIRouter, HTTPException
from pathlib import Path
import json

router = APIRouter()
DB_PATH = Path(__file__).parent.parent.parent.parent.parent / "ai/treatment/database/diseases.json"


@router.get("/")
async def list_treatments():
    with open(DB_PATH, encoding="utf-8") as f:
        db = json.load(f)
    return {"treatments": list(db.keys()), "total": len(db)}


@router.get("/{disease_id}")
async def get_treatment(disease_id: str):
    with open(DB_PATH, encoding="utf-8") as f:
        db = json.load(f)
    if disease_id not in db:
        raise HTTPException(404, f"Không tìm thấy bệnh: {disease_id}")
    return db[disease_id]
