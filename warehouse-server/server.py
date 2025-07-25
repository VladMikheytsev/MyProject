# server.py

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import uuid
import os

# --- Конфигурация ---
DB_FILE = "warehouse_db.json"

# --- Инициализация FastAPI ---
app = FastAPI()

# --- Настройка CORS ---
# Это позволяет вашему React-приложению (с другого адреса) делать запросы к серверу
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Разрешить все источники (для разработки)
    allow_credentials=True,
    allow_methods=["*"],  # Разрешить все методы (GET, POST, etc.)
    allow_headers=["*"],  # Разрешить все заголовки
)

# --- Глобальная переменная для хранения данных ---
db = {
    "warehouses": [],
    "items": [],
    "itemTypes": [],
    "users": []
}

# --- Модели данных (Pydantic) ---
class UserRegistration(BaseModel):
    username: str
    password: str
    firstName: str
    lastName: str
    position: str
    phone: str
    assignedWarehouseId: str | int

class UserLogin(BaseModel):
    username: str
    password: str

class AppData(BaseModel):
    warehouses: list
    items: list
    itemTypes: list

# --- Функции для работы с БД ---
def load_data():
    global db
    if os.path.exists(DB_FILE):
        with open(DB_FILE, 'r', encoding='utf-8') as f:
            db = json.load(f)
        print(f"✅ Данные загружены из {DB_FILE}")
    else:
        # Создаем суперпользователя, если база данных пуста
        db["users"].append({
            "id": "vladislav-admin",
            "username": "Vladislav",
            "password": "Eh45TbrNMi986V7",
            "role": "Администратор",
            "firstName": "Владислав",
            "lastName": "Модератор",
            "position": "Главный администратор",
            "phone": "000-000-0000",
            "assignedWarehouseId": "office"
        })
        save_data()
        print(f"⚠️ Файл {DB_FILE} не найден. Создан новый с пользователем Vladislav.")

def save_data():
    with open(DB_FILE, 'w', encoding='utf-8') as f:
        json.dump(db, f, ensure_ascii=False, indent=4)
    print(f"💾 Данные сохранены в {DB_FILE}")

# --- События запуска и остановки приложения ---
@app.on_event("startup")
async def startup_event():
    load_data()

# --- Эндпоинты (маршруты) API ---

# Получение всех данных приложения (склады, товары)
@app.get("/data")
async def get_app_data():
    return {
        "warehouses": db.get("warehouses", []),
        "items": db.get("items", []),
        "itemTypes": db.get("itemTypes", [])
    }

# Сохранение всех данных приложения
@app.post("/data")
async def save_app_data(data: AppData):
    global db
    db["warehouses"] = data.warehouses
    db["items"] = data.items
    db["itemTypes"] = data.itemTypes
    save_data()
    return {"message": "Данные успешно сохранены"}

# Получение всех пользователей
@app.get("/users")
async def get_users():
    return db.get("users", [])

# Вход пользователя
@app.post("/login")
async def login_user(credentials: UserLogin):
    for user in db["users"]:
        if user["username"] == credentials.username and user["password"] == credentials.password:
            return user
    raise HTTPException(status_code=401, detail="Неверное имя пользователя или пароль")

# Регистрация нового пользователя
@app.post("/register")
async def register_user(user_data: UserRegistration):
    global db
    if any(user["username"] == user_data.username for user in db["users"]):
        raise HTTPException(status_code=400, detail="Пользователь с таким именем уже существует")

    new_user = {
        "id": str(uuid.uuid4()),
        "username": user_data.username,
        "password": user_data.password,
        "firstName": user_data.firstName,
        "lastName": user_data.lastName,
        "position": user_data.position,
        "phone": user_data.phone,
        "assignedWarehouseId": user_data.assignedWarehouseId,
        "role": "На модерации"
    }
    db["users"].append(new_user)
    save_data()
    return new_user

# Обновление пользователя (для модерации)
@app.put("/users/{user_id}")
async def update_user(user_id: str, updated_data: Request):
    global db
    user_index = -1
    for i, u in enumerate(db["users"]):
        if u["id"] == user_id:
            user_index = i
            break
    
    if user_index == -1:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    data = await updated_data.json()
    db["users"][user_index].update(data)
    save_data()
    return db["users"][user_index]

# Удаление пользователя
@app.delete("/users/{user_id}")
async def delete_user(user_id: str):
    global db
    original_len = len(db["users"])
    db["users"] = [u for u in db["users"] if u["id"] != user_id]
    
    if len(db["users"]) == original_len:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
        
    save_data()
    return {"message": "Пользователь успешно удален"}