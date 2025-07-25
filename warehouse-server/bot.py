import json
import aiohttp
import logging
import asyncio
import os

from aiogram import Bot, Dispatcher, F, types
from aiogram.types import Message, WebAppInfo
from aiogram.enums import ParseMode
from aiogram.client.default import DefaultBotProperties
from aiogram.utils.keyboard import ReplyKeyboardBuilder  # ✅ ВОТ ЭТО


# ✅ Токен и API адрес
BOT_TOKEN = os.getenv("BOT_TOKEN", "7863369427:AAE1hC7Xm0Ru9Mjyox7yVZFcuQ48r4eFsBQ")
API_URL = "https://warehouse-vlad.ngrok.io"

bot = Bot(
    token=BOT_TOKEN,
    default=DefaultBotProperties(parse_mode=ParseMode.HTML)
)
dp = Dispatcher()


# --- /start ---
@dp.message(F.text == "/start")
async def start_handler(message: Message):
    kb = ReplyKeyboardBuilder()
    kb.button(
        text="Регистрация",
        web_app=WebAppInfo(url=f"{API_URL}/register")
    )
    kb.button(text="Все пользователи")
    await message.answer("Добро пожаловать! Выберите действие:", reply_markup=kb.as_markup(resize_keyboard=True))


# --- WebAppData (регистрация) ---
@dp.message(F.web_app_data)
async def handle_webapp_data(message: Message):
    try:
        data = json.loads(message.web_app_data.data)
        user_data = {
            "telegram_id": message.from_user.id,
            "first_name": data.get("first_name", ""),
            "last_name": data.get("last_name", ""),
            "phone": data.get("phone", ""),
            "role": "не подтвержден"
        }

        # Отправка на сервер
        async with aiohttp.ClientSession() as session:
            async with session.post(f"{API_URL}/api/register_user", json=user_data) as resp:
                if resp.status == 200:
                    await message.answer("✅ Вы успешно зарегистрированы.")
                else:
                    await message.answer("❌ Ошибка при регистрации.")

            # Уведомление администраторам
            async with session.get(f"{API_URL}/api/users") as resp:
                if resp.status == 200:
                    all_users = await resp.json()
                    for u in all_users:
                        if u.get("role") == "Администратор":
                            try:
                                await bot.send_message(
                                    u["telegram_id"],
                                    f"🔔 Новая регистрация:\n<b>{user_data['first_name']} {user_data['last_name']}</b>\n📞 {user_data['phone']}"
                                )
                            except Exception as e:
                                logging.warning(f"Ошибка уведомления админа {u.get('telegram_id')}: {e}")

    except Exception as e:
        await message.answer(f"⚠️ Ошибка обработки данных: {e}")


# --- Список пользователей ---
@dp.message(F.text == "Все пользователи")
async def all_users_handler(message: Message):
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{API_URL}/api/users") as resp:
                if resp.status != 200:
                    return await message.answer("❌ Не удалось загрузить пользователей.")
                users = await resp.json()

        if not users:
            return await message.answer("Список пользователей пуст.")

        response = "📋 <b>Зарегистрированные пользователи:</b>\n\n"
        for user in users:
            response += f"👤 <b>{user['first_name']} {user['last_name']}</b>\n"
            response += f"📞 {user['phone']}\n"
            response += f"🧩 Роль: <i>{user['role']}</i>\n\n"

        await message.answer(response)

    except Exception as e:
        await message.answer(f"⚠️ Ошибка получения списка: {e}")


# --- Запуск бота ---
async def main():
    logging.basicConfig(level=logging.INFO)
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())