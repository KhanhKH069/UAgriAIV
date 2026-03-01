"""
Unit tests — Treatment Recommendation Engine
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__) + "/..")
import unittest
from ai.treatment.engine.recommender import TreatmentEngine, DetectionResult

class TestTreatmentEngine(unittest.TestCase):
    def setUp(self):
        self.engine = TreatmentEngine()

    def test_high_severity_spray(self):
        det  = DetectionResult("rice_blast", confidence=0.93, bbox=[])
        plan = self.engine.recommend(det)
        self.assertEqual(plan.action, "spray")
        self.assertIsNotNone(plan.medicine)

    def test_low_confidence_monitor(self):
        det  = DetectionResult("rice_blast", confidence=0.55, bbox=[])
        plan = self.engine.recommend(det)
        self.assertEqual(plan.severity, "low")
        self.assertEqual(plan.action, "monitor")

    def test_healthy_no_treatment(self):
        det  = DetectionResult("healthy", confidence=0.98, bbox=[])
        plan = self.engine.recommend(det)
        self.assertIsNone(plan.medicine)
        self.assertEqual(plan.action, "monitor")

    def test_cassava_mosaic_remove(self):
        det  = DetectionResult("cassava_mosaic", confidence=0.91, bbox=[])
        plan = self.engine.recommend(det)
        self.assertEqual(plan.action, "remove")

if __name__ == "__main__":
    unittest.main(verbosity=2)
