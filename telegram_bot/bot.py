from dotenv import load_dotenv
load_dotenv()  
import os
import re
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, ContextTypes, filters

TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

ADMIN_CHAT_ID = os.getenv("TELEGRAM_ADMIN_CHAT_ID")
ADMIN_USERNAME = "@akbarovich_offical"

START_TEXT = (
    "Salom! 👋\n"
    "Men MutolaaClone yordam botiman.\n\n"
    "✅ Muammoingizni yozing (masalan: login, donate, premium, audiobook, comment, migrate, runserver).\n"
    "Agar men javob topa olmasam, sizni xodimimizga ulayman."
)


FAQ = [
    (r"migrate|makemigrations|no such table|OperationalError",
     "🛠️ Migratsiya muammosi:\n"
     "1) python manage.py makemigrations\n"
     "2) python manage.py migrate\n"
     "3) python manage.py runserver\n"
     "Agar baribir bo'lmasa: eski db.sqlite3 ni o'chirib, migrate qaytadan qiling."),
    (r"static|TemplateSyntaxError|load static",
     "📦 Static muammo:\n"
     "HTML template'da {% load static %} borligini tekshiring.\n"
     "STATIC_URL va (kerak bo'lsa) STATICFILES_DIRS to'g'ri ekanini tekshiring."),
    (r"login|kirish|token|auth",
     "🔐 Kirish muammosi:\n"
     "1) Username/parol to'g'ri ekanini tekshiring\n"
     "2) Register qilib ko'ring\n"
     "3) Ctrl+F5 bilan qayta yuklab ko'ring."),
    (r"logout|chiqish|405",
     "🚪 Logout muammosi:\n"
     "Logout odatda POST bilan bo'ladi. Frontend logout tugmasi to'g'ri endpointga so'rov yuborayotganini tekshiring."),
    (r"donat|donate|click|payme",
     "💳 Donate/Click/Payme:\n"
     "Ism va summa kiritilgandan keyin Click/Payme bosiladi.\n"
     "Demo: qaytishda #donate?success=1 bo'lsa Premium aktiv bo'ladi."),
    (r"premium|obuna",
     "⭐ Premium:\n"
     "Premium sahifasida Premium vs Bepul solishtirish bor.\n"
     "Donate muvaffaqiyatli bo'lsa (demo) premium aktiv bo'ladi."),
    (r"audiobook|audiokitob|audio",
     "🎧 Audiokitob:\n"
     "Audiokitob faqat Premium foydalanuvchilarga ochiladi.\n"
     "Premium bo'lmasangiz, Donate sahifasi orqali obuna bo'ling."),
    (r"comment|izoh|reyting|yulduz",
     "💬 Izoh/Reyting:\n"
     "Kitob sahifasida yulduzcha (1-5) va izoh qoldirish mumkin.\n"
     "Izohlar hammaga ko'rinadi."),
    (r"npm|node|package\.json|npm install",
     "🟩 Node/NPM:\n"
     "1) node -v\n"
     "2) cd frontend\n"
     "3) npm install\n"
     "4) npm run dev"),
    (r"runserver|127\.0\.0\.1|404",
     "🌐 Run/404:\n"
     "Backend API bo'lishi mumkin, frontend alohida ishlaydi.\n"
     "Backend: python manage.py runserver (8000)\n"
     "Frontend: npm run dev (5173)."),
]

def find_faq_answer(text: str):
    t = text.lower()
    for pattern, answer in FAQ:
        if re.search(pattern, t):
            return answer
    return None

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(START_TEXT)

async def help_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "Yordam uchun muammoingizni bitta gapda yozing.\n"
        "Masalan: 'migrate xato', 'login ishlamayapti', 'click sahifaga o'tkazmayapti'."
    )

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = (update.message.text or "").strip()
    if not text:
        return

    answer = find_faq_answer(text)
    if answer:
        await update.message.reply_text(answer)
        await update.message.reply_text("Agar muammo hal bo'lmasa, yana yozing — sizni xodimga ulayman.")
        return

    await update.message.reply_text(
        "🤝 Men aniq javob topolmadim. Sizni xodimimizga ulayman.\n"
        f"Admin: {ADMIN_USERNAME}"
    )

    if ADMIN_CHAT_ID:
        try:
            user = update.effective_user
            header = f"🆘 Yordam so'rovi\nUser: @{user.username} ({user.id})\n"
            await context.bot.send_message(chat_id=int(ADMIN_CHAT_ID), text=header + "Savol: " + text)
            await update.message.reply_text("✅ Xabaringiz admin'ga yuborildi. Tez orada javob beramiz.")
        except Exception:
            await update.message.reply_text(
                "⚠️ Admin'ga avtomatik yuborishda muammo bo'ldi. Iltimos, admin'ga o'zingiz yozing."
            )

def main():
    if not TOKEN:
        raise SystemExit(
            "TELEGRAM_BOT_TOKEN env o'rnatilmagan.\n"
            "Windows: set TELEGRAM_BOT_TOKEN=xxxx\n"
            "Linux/Mac: export TELEGRAM_BOT_TOKEN=xxxx"
        )

    app = Application.builder().token(TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("help", help_cmd))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    print("Bot ishlayapti... Ctrl+C bilan to'xtating.")
    app.run_polling()

if __name__ == "__main__":
    main()
