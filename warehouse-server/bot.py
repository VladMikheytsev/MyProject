import json
import logging
import aiohttp
from aiogram import Bot, Dispatcher, F
from aiogram.types import Message, WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton, Update
from aiogram.enums import ParseMode
from aiogram.types.web_app_data import WebAppData
from aiogram.utils.keyboard import ReplyKeyboardMarkup, KeyboardButton
from aiogram.utils.token import TokenValidationError
from aiogram.utils import executor
from aiogram.types import ReplyKeyboardRemove

from aiogram.client.session.aiohttp import AiohttpSession
from fastapi import FastAPI
import uvicorn

BOT_TOKEN = "7863369427:AAE1hC7Xm0Ru9Mjyox7yVZFcuQ48r4eFsBQ"
API_URL = "https://warehouse-vlad.ngrok.io";

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()


# --- Меню клавиатуры ---
def main_menu():
    return ReplyKeyboardMarkup(keyboard=[
        [KeyboardButton(text="Регистрация", web_app=WebAppInfo(url=f"{API_URL}/register"))],
        [KeyboardButton(text="Все пользователи")]
    ], resize_keyboard=True)


# --- Обработка команды /start ---
@dp.message(F.text == "/start")
async def start_handler(message: Message):
    await message.answer("Добро пожаловать! Выберите действие:", reply_markup=main_menu())


# --- Обработка кнопки "Все пользователи" ---
@dp.message(F.text == "Все пользователи")
async def show_users(message: Message):
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{API_URL}/api/users") as resp:
                if resp.status == 200:
                    users = await resp.json()
                    text = ""
                    for user in users:
                        text += f"👤 {user['first_name']} {user['last_name']} | {user['phone']} | Роль: {user['role']}\n"
                    if not text:
                        text = "Нет зарегистрированных пользователей."
                    await message.answer(text)
                else:
                    await message.answer("Ошибка при получении списка пользователей.")
    except Exception as e:
        await message.answer(f"Ошибка: {e}")


# --- Обработка WebAppData после регистрации ---
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

        # --- Отправка на сервер ---
        async with aiohttp.ClientSession() as session:
            async with session.post(f"{API_URL}/api/register_user", json=user_data) as resp:
                if resp.status == 200:
                    await message.answer("✅ Регистрация успешно завершена!", reply_markup=ReplyKeyboardRemove())
                else:
                    await message.answer("❌ Ошибка при регистрации. Попробуйте позже.")
                    return

        # --- Получение всех администраторов и отправка уведомления ---
        async with session.get(f"{API_URL}/api/users") as resp:
            if resp.status == 200:
                users = await resp.json()
                for u in users:
                    if u.get("role") == "Администратор":
                        try:
                            await bot.send_message(u["telegram_id"],
                                f"🔔 Новая регистрация:\n{user_data['first_name']} {user_data['last_name']}\n📞 {user_data['phone']}")
                        except Exception as e:
                            print(f"Ошибка отправки админу: {e}")

    except Exception as e:
        await message.answer(f"Ошибка обработки данных: {e}")


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    from aiogram import executor
    executor.start_polling(dp, skip_updates=True)
