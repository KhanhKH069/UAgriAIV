"""
Unit tests — Treatment Engine
Run: uv run pytest tests/test_treatment_engine.py -v
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__) + "/..")

import pytest
from ai.treatment.engine.recommender import TreatmentEngine, DetectionResult


@pytest.fixture
def engine():
    return TreatmentEngine()


def test_high_confidence_spray(engine):
    det  = DetectionResult("rice_blast", confidence=0.93, bbox=[])
    plan = engine.recommend(det)
    assert plan.action == "spray"
    assert plan.medicine is not None
    assert plan.severity == "high"


def test_low_confidence_monitor(engine):
    det  = DetectionResult("rice_blast", confidence=0.55, bbox=[])
    plan = engine.recommend(det)
    assert plan.severity == "low"
    assert plan.action   == "monitor"


def test_healthy_no_treatment(engine):
    det  = DetectionResult("healthy", confidence=0.98, bbox=[])
    plan = engine.recommend(det)
    assert plan.medicine is None
    assert plan.action   == "monitor"


def test_cassava_mosaic_remove_when_high(engine):
    det  = DetectionResult("cassava_mosaic", confidence=0.92, bbox=[])
    plan = engine.recommend(det)
    assert plan.action == "remove"


def test_unknown_disease_returns_monitor(engine):
    det  = DetectionResult("unknown_xyz", confidence=0.80, bbox=[])
    plan = engine.recommend(det)
    assert plan.action in ("monitor", "spray")
