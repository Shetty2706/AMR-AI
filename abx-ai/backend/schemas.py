from typing import List

from pydantic import BaseModel, Field, model_validator


class PatientInput(BaseModel):
    age: int = Field(..., ge=0, le=120)
    weight: float = Field(..., gt=0, le=400)
    infection_site: str = Field(..., description="UTI, CAP, HAP, SSTI, Sepsis")
    wbc: float = Field(..., ge=0)
    creatinine: float = Field(..., ge=0)
    unit: str = Field(..., description="ICU or Ward")
    prior_antibiotics: bool
    comorbidities: List[str] = Field(default_factory=list)

    @model_validator(mode="after")
    def normalize_values(self) -> "PatientInput":
        self.infection_site = self.infection_site.strip().upper()
        self.unit = self.unit.strip().upper()
        self.comorbidities = [c.strip() for c in self.comorbidities if c.strip()]
        return self


class RecommendationOutput(BaseModel):
    recommended_drug: str
    dose: str
    frequency: str
    duration: str
    esbl_probability: float = Field(..., ge=0, le=1)
    mrsa_probability: float = Field(..., ge=0, le=1)
    explanation: str


class AMSOutput(BaseModel):
    alerts: List[str]
