"""Deterministic mock decision logic for antibiotic recommendation and AMS checks."""

from __future__ import annotations

from typing import Dict, List

from schemas import PatientInput


def _estimated_crcl(age: int, weight: float, creatinine: float) -> float:
    """Simplified Cockcroft-Gault style estimate (male default) for POC logic."""
    if creatinine <= 0:
        return 0.0
    return max(((140 - age) * weight) / (72 * creatinine), 0.0)


def predict_antibiotic(data: PatientInput) -> Dict[str, object]:
    """Generate deterministic recommendation from basic clinical features."""
    crcl = _estimated_crcl(data.age, data.weight, data.creatinine)

    base_map = {
        "UTI": ("ceftriaxone", "1 g", "IV q24h", "5 days"),
        "CAP": ("ceftriaxone + azithromycin", "1 g + 500 mg", "IV q24h", "5 days"),
        "HAP": ("piperacillin-tazobactam", "4.5 g", "IV q6h", "7 days"),
        "SSTI": ("cefazolin", "2 g", "IV q8h", "5 days"),
        "SEPSIS": ("piperacillin-tazobactam + vancomycin", "4.5 g + 15 mg/kg", "IV q6h + q12h", "7 days"),
    }
    drug, dose, frequency, duration = base_map.get(
        data.infection_site, ("ceftriaxone", "1 g", "IV q24h", "5 days")
    )

    # Escalate when patient appears more severe.
    if data.unit == "ICU" and data.wbc >= 15:
        drug = "meropenem + vancomycin"
        dose = "1 g + 15 mg/kg"
        frequency = "IV q8h + q12h"
        duration = "7 days"

    # Renal-tailored swaps for low CrCl.
    if crcl < 30 and "vancomycin" not in drug.lower():
        frequency = "IV q24h"
        dose = f"Renal-adjusted {dose}"

    # UTI specific refinement requested by spec.
    if data.infection_site == "UTI" and data.creatinine > 2:
        drug = "ertapenem"
        dose = "1 g"
        frequency = "IV q24h"
        duration = "7 days"

    esbl_probability = 0.18
    mrsa_probability = 0.14

    if data.prior_antibiotics:
        esbl_probability += 0.25
    if data.unit == "ICU":
        esbl_probability += 0.2
        mrsa_probability += 0.2
    if data.wbc >= 15:
        esbl_probability += 0.1
        mrsa_probability += 0.08
    if data.infection_site in {"HAP", "SEPSIS"}:
        mrsa_probability += 0.2
    if "diabetes" in [c.lower() for c in data.comorbidities]:
        mrsa_probability += 0.05

    esbl_probability = min(round(esbl_probability, 2), 0.99)
    mrsa_probability = min(round(mrsa_probability, 2), 0.99)

    explanation = (
        f"Selected regimen for {data.infection_site} using severity markers (WBC {data.wbc}), "
        f"care setting ({data.unit}), and renal function estimate (CrCl {crcl:.1f} mL/min)."
    )

    return {
        "recommended_drug": drug,
        "dose": dose,
        "frequency": frequency,
        "duration": duration,
        "esbl_probability": esbl_probability,
        "mrsa_probability": mrsa_probability,
        "explanation": explanation,
    }


def generate_ams_alerts(data: PatientInput, prediction: Dict[str, object]) -> List[str]:
    """Generate antimicrobial stewardship alerts from patient factors + recommendation."""
    alerts: List[str] = []
    regimen = str(prediction.get("recommended_drug", "")).lower()

    if "+" in regimen:
        alerts.append("Potential duplicate coverage: verify spectrum overlap in combination regimen.")

    if data.creatinine > 2:
        alerts.append("Renal dose adjustment needed.")

    if data.prior_antibiotics:
        alerts.append("Consider ESBL risk due to prior antibiotic exposure.")

    duration_text = str(prediction.get("duration", ""))
    try:
        planned_days = int(duration_text.split()[0])
        if planned_days > 7:
            alerts.append("Planned duration exceeds common guideline targets; reassess stop date.")
    except (ValueError, IndexError):
        pass

    if data.unit == "WARD" and data.wbc < 12 and data.infection_site in {"CAP", "UTI", "SSTI"}:
        alerts.append("Evaluate IV-to-oral switch within 24 hours if clinically stable.")

    if not alerts:
        alerts.append("Perform 48-72 hour antibiotic timeout to confirm need and spectrum.")

    return alerts
