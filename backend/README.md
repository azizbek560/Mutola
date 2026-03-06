# Backend (Django + DRF) — Library API (Token Auth)

## Run (Windows)
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt

python manage.py makemigrations
python manage.py migrate

python manage.py createsuperuser
python manage.py runserver
```

Optional demo data:
```bash
python manage.py shell < seed.py
```

## Swagger / Redoc
- Swagger: http://127.0.0.1:8000/api/docs/
- Redoc:   http://127.0.0.1:8000/api/redoc/

## Token Auth
- POST /api/auth/register/
- POST /api/auth/login/
- GET  /api/auth/me/
- POST /api/subscribe/  (demo premium)
