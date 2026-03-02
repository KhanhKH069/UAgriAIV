"""
GPS Disease Tagger & GeoJSON Heatmap Builder
TV3: AI/ML #2 — Mapping
Run: uv run python mapping/heatmap_builder.py
"""
import json
from datetime import datetime, timezone
from dataclasses import dataclass, asdict
from pathlib import Path


@dataclass
class GeoDetection:
    lat: float
    lng: float
    alt: float
    timestamp: str
    disease_id: str
    disease_name: str
    confidence: float
    severity: str
    treatment_action: str


SEVERITY_WEIGHT = {"high": 1.0, "medium": 0.6, "low": 0.3, "watch": 0.1, "none": 0.0}


class GPSTagger:
    def tag(self, detection: dict, gps: dict, treatment: dict) -> GeoDetection:
        return GeoDetection(
            lat=gps["lat"],
            lng=gps["lng"],
            alt=gps.get("alt", 0.0),
            timestamp=datetime.now(timezone.utc).isoformat(),
            disease_id=detection["disease_id"],
            disease_name=detection.get("disease_name", ""),
            confidence=detection["confidence"],
            severity=treatment.get("severity", "unknown"),
            treatment_action=treatment.get("action", "monitor"),
        )


class HeatmapBuilder:
    def __init__(self):
        self.points: list[GeoDetection] = []

    def add(self, point: GeoDetection):
        self.points.append(point)

    def to_geojson(self) -> dict:
        features = []
        for p in self.points:
            features.append({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [p.lng, p.lat, p.alt],
                },
                "properties": {
                    "timestamp":    p.timestamp,
                    "disease_id":   p.disease_id,
                    "disease_name": p.disease_name,
                    "confidence":   round(p.confidence, 3),
                    "severity":     p.severity,
                    "action":       p.treatment_action,
                    "weight":       SEVERITY_WEIGHT.get(p.severity, 0.5),
                },
            })
        return {"type": "FeatureCollection", "features": features}

    def save(self, output_path: str):
        Path(output_path).parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(self.to_geojson(), f, ensure_ascii=False, indent=2)
        print(f"✅ Heatmap saved: {output_path}  ({len(self.points)} points)")


if __name__ == "__main__":
    tagger  = GPSTagger()
    builder = HeatmapBuilder()

    samples = [
        ({"disease_id": "rice_blast",  "confidence": 0.92, "disease_name": "Đạo ôn"},
         {"lat": 21.0285, "lng": 105.854, "alt": 15},
         {"severity": "high",   "action": "spray"}),
        ({"disease_id": "brown_spot",  "confidence": 0.74, "disease_name": "Đốm nâu"},
         {"lat": 21.0287, "lng": 105.855, "alt": 15},
         {"severity": "medium", "action": "spray"}),
        ({"disease_id": "healthy",     "confidence": 0.98, "disease_name": "Khỏe"},
         {"lat": 21.0290, "lng": 105.856, "alt": 15},
         {"severity": "none",   "action": "monitor"}),
    ]
    for det, gps, tx in samples:
        builder.add(tagger.tag(det, gps, tx))

    builder.save("mapping/geojson/sample.geojson")
