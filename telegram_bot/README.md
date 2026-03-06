# Telegram Bot (Yordam)

## 1) Bot yaratish
Telegramda @BotFather:
- /newbot
- bot nomi va username bering
- TOKEN olasiz

## 2) Ishga tushirish (Windows)
```powershell
cd telegram_bot
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
set TELEGRAM_BOT_TOKEN=YOUR_TOKEN_HERE
python bot.py
```

## 3) Saytdagi Yordam linki
Frontenddagi Help sahifada `https://t.me/your_help_bot` turibdi.
Uni o‘zingizning bot username’ga almashtiring.


## Adminga avtomatik ulash (tavsiya)
Bot foydalanuvchi savoliga javob topolmasa, xabarni admin’ga yuborishi uchun `TELEGRAM_ADMIN_CHAT_ID` kerak bo‘ladi.

Windows:
```powershell
set TELEGRAM_ADMIN_CHAT_ID=YOUR_CHAT_ID
```

Admin username: @akbarovich_offical
