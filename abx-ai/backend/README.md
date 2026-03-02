# ABX-AI Backend (FastAPI)

## Run locally

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

API base URL: `http://localhost:8000`

## Endpoints

- `GET /ping` → health check response: `{ "status": "ok" }`
- `POST /predict` → returns antibiotic recommendation and mock resistance probabilities.
- `POST /ams` → returns antimicrobial stewardship alerts.

### Example request body (`/predict` or `/ams`)

```json
{
  "age": 67,
  "weight": 72,
  "infection_site": "CAP",
  "wbc": 16.4,
  "creatinine": 1.8,
  "unit": "ICU",
  "prior_antibiotics": true,
  "comorbidities": ["COPD", "Diabetes"]
}
```

FastAPI auto-docs are available at `http://localhost:8000/docs`.
