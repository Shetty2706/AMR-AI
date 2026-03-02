# ABX-AI: Antibiotic Clinical Decision Support (POC)

Offline-first full-stack proof-of-concept for antimicrobial decision support.

## Repository Structure

```text
abx-ai/
├── backend/
├── frontend/
└── shared/
```

## Backend run instructions

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## Frontend run instructions

```bash
cd frontend
npm install
npm run dev
```

Backend URL: `http://localhost:8000`  
Frontend URL: `http://localhost:5173`

## Notes
- Uses deterministic logic for mock AI behavior.
- Includes AMS safety/optimization alerts.
- Designed to run locally without internet once dependencies are installed.
