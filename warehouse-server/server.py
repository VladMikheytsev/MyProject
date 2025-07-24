import json
import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Dict, Any

app = FastAPI()

# ✅ Разрешённые источники CORS
origins = [
    "http://localhost:3000",                          # локальный React
    "https://my-project-navy-theta.vercel.app",       # Vercel-деплой
    "https://warehouse-vlad.ngrok.io",                # постоянный ngrok-домен
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # ← конкретные разрешённые домены
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 📁 Путь до JSON-файла
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(BASE_DIR, "warehouse_db.json")

# 📦 Дефолтные данные
DEFAULT_DATA = {
    "warehouses": [],
    "items": [],
    "itemTypes": [
        {"id": 1, "name": "Гель", "color": "#3b82f6"},
        {"id": 2, "name": "Расходники", "color": "#16a34a"},
        {"id": 3, "name": "Коробки", "color": "#f97316"}
    ]
}

def load_db():
    try:
        with open(DB_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return DEFAULT_DATA

def save_db(data: Dict):
    with open(DB_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

# --- Модели данных Pydantic ---
class UserRegistration(BaseModel):
    user_id: int
    role: str

# --- API эндпоинты ---
@app.on_event("startup")
def initialize_db():
    if not os.path.exists(DB_FILE):
        print("warehouse_db.json не найден. Создаю с начальными данными.")
        save_db(DEFAULT_DATA)

@app.get("/api/data")
async def get_all_data():
    return load_db()

@app.post("/api/data")
async def update_all_data(data: Dict[str, Any]):
    db = load_db()
    # Обновляем только те части, которые пришли, сохраняя пользователей
    db["warehouses"] = data.get("warehouses", db["warehouses"])
    db["items"] = data.get("items", db["items"])
    db["itemTypes"] = data.get("itemTypes", db["itemTypes"])
    save_db(db)
    return {"status": "success"}

@app.get("/api/user/{user_id}")
async def get_user_role(user_id: int):
    """Проверяет роль пользователя по его Telegram ID."""
    db = load_db()
    user_data = db.get("users", {}).get(str(user_id))
    if user_data:
        return {"role": user_data.get("role", "Неизвестно")}
    return {"role": "unregistered"}

@app.post("/api/register")
async def register_user(registration_data: UserRegistration):
    """Регистрирует нового пользователя."""
    db = load_db()
    users = db.get("users", {})
    users[str(registration_data.user_id)] = {"role": registration_data.role}
    db["users"] = users
    save_db(db)
    return {"status": "success", "role": registration_data.role}
