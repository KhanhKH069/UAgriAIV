from sqlalchemy import Column, String, DateTime, Float, Text
from sqlalchemy.dialects.postgresql import UUID
from app.db.database import Base
import uuid

class Flight(Base):
    __tablename__ = "flights"
    id         = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    drone_id   = Column(String(50), nullable=False)
    pilot      = Column(String(100))
    location   = Column(String(255))
    status     = Column(String(20), default="active")
    started_at = Column(DateTime)
    ended_at   = Column(DateTime)
    area_m2    = Column(Float)
    notes      = Column(Text)
