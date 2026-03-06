## Backend
```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

Demo data:
```powershell
python manage.py shell < seed.py
```

Swagger: http://127.0.0.1:8000/api/docs/  
Redoc:   http://127.0.0.1:8000/api/redoc/

## Frontend
```powershell
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173


## Telegram bot
Bot kodi `telegram_bot/` ichida.
