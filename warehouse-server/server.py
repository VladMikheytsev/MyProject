import json
import os
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Dict, Any
from contextlib import asynccontextmanager
from pydantic import BaseModel
import uuid # Для генерации уникальных ID


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
    ],
    "users": []
}

# 📥 Загрузка из файла
def load_db() -> Dict[str, Any]:
    try:
        with open(DB_FILE, "r", encoding="utf-8") as f:
            print("✅ Загрузка данных из warehouse_db.json")
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        print("⚠️ Файл не найден или повреждён, возвращаю дефолтные данные")
        return DEFAULT_DATA.copy()

# 💾 Сохранение в файл
def save_db(data: Dict[str, Any]):
    with open(DB_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    print(f"💾 Сохранено: {len(data.get('warehouses', []))} складов, "
          f"{len(data.get('items', []))} товаров, {len(data.get('users', []))} пользователей")

# 🔄 Lifespan-инициализация
@asynccontextmanager
async def lifespan(app: FastAPI):
    if not os.path.exists(DB_FILE):
        print("📂 warehouse_db.json не найден. Создаю файл.")
        save_db(DEFAULT_DATA)
    else:
        data = load_db()
        if "users" not in data:
            data["users"] = []
            save_db(data)
    yield

# 🚀 Приложение
app = FastAPI(lifespan=lifespan)

# ✅ Разрешённые источники CORS
origins = [
    "http://localhost:3000",
    "https://my-project-navy-theta.vercel.app",
    "https://warehouse-vlad.ngrok.io",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 📤 Получение всех данных
@app.get("/api/data")
async def get_all_data():
    return load_db()

# 📥 Сохранение всех данных
@app.post("/api/data")
async def update_all_data(data: Dict[str, Any], request: Request):
    print("📥 POST /api/data — данные получены:")
    print(json.dumps(data, indent=2, ensure_ascii=False))

    if data == DEFAULT_DATA:
        print("⛔️ Получены дефолтные данные — не сохраняю.")
        return {"status": "skipped"}
    save_db(data)
    return {"status": "success"}

# 🔧 Preflight-запрос
@app.options("/api/data")
async def options_handler():
    return JSONResponse(status_code=200, content={"ok": True})

# 🆕 Регистрация пользователя
@app.post("/api/register_user")
async def register_user(request: Request):
    new_user = await request.json()
    db = load_db()

    # Проверка на дубликат по telegram_id
    if any(user.get("telegram_id") == new_user.get("telegram_id") for user in db.get("users", [])):
        return {"status": "exists"}

    new_user["role"] = "не подтвержден"
    db.setdefault("users", []).append(new_user)
    save_db(db)
    print(f"🆕 Зарегистрирован новый пользователь: {new_user['first_name']} {new_user['last_name']}")
    return {"status": "ok"}

# 📋 Получение всех пользователей
@app.get("/api/users")
async def get_users():
    db = load_db()
    return db.get("users", [])


# Модель для данных, приходящих от клиента при регистрации
class UserRegistration(BaseModel):
    username: str
    password: str
    firstName: str
    lastName: str
    position: str
    phone: str
    assignedWarehouseId: str | int

# Эндпоинт для регистрации
@app.post("/register")
async def register_user(user_data: UserRegistration):
    global db
    
    # Проверяем, не занят ли username
    for user in db["users"]:
        if user["username"] == user_data.username:
            raise HTTPException(status_code=400, detail="Пользователь с таким именем уже существует")

    # Создаем нового пользователя
    new_user = {
        "id": str(uuid.uuid4()), # Генерируем уникальный ID
        "username": user_data.username,
        "password": user_data.password, # В реальном приложении пароль нужно хешировать!
        "firstName": user_data.firstName,
        "lastName": user_data.lastName,
        "position": user_data.position,
        "phone": user_data.phone,
        "assignedWarehouseId": user_data.assignedWarehouseId,
        "role": "На модерации" # Роль по умолчанию
    }
    
    db["users"].append(new_user)
    save_data() # Сохраняем обновленные данные в JSON
    
    return new_user # Возвращаем созданного пользователя клиенту