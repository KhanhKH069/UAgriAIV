from sqlalchemy import Column, String, Float, DateTime, JSON
from sqlalchemy.dialects.postgresql import UUID
from app.db.database import Base
import uuid


class Detection(Base):
    __tablename__ = "detections"

    id           = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    flight_id    = Column(String(100))
    drone_id     = Column(String(50),  nullable=False)
    timestamp    = Column(DateTime)
    lat          = Column(Float, nullable=False)
    lng          = Column(Float, nullable=False)
    alt          = Column(Float)
    disease_id   = Column(String(100), nullable=False)
    disease_name = Column(String(200))
    confidence   = Column(Float)
    severity     = Column(String(20))
    raw_payload  = Column(JSON)
