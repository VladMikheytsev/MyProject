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
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Глобальная переменная для хранения данных ---
db = {
    "warehouses": [],
    "items": [],
    "itemTypes": [],
    "users": [],
    "scenarios": []
}

# --- Модели данных (Pydantic) ---
# [УЛУЧШЕНИЕ] Создана полная модель пользователя для валидации
class User(BaseModel):
    id: str
    username: str
    password: str
    firstName: str
    lastName: str
    position: str
    phone: str
    role: str
    assignedWarehouseId: str | int

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
    scenarios: list

def load_data():
    global db
    if os.path.exists(DB_FILE):
        with open(DB_FILE, 'r', encoding='utf-8') as f:
            try:
                loaded_db = json.load(f)
                for key in db.keys():
                    db[key] = loaded_db.get(key, [])
                print(f"✅ Данные загружены из {DB_FILE}")
            except json.JSONDecodeError:
                print(f"❌ Ошибка чтения {DB_FILE}. Файл может быть поврежден. Используется пустая база.")
                save_data() # Сохраняем пустую структуру, чтобы избежать ошибок при работе
    else:
        # Создаем пользователей по умолчанию, если база данных пуста
        db["users"] = [
            {
                "id": "vladislav-admin", "username": "Vladislav", "password": "Eh45TbrNMi986V7",
                "role": "Администратор", "firstName": "Владислав", "lastName": "Модератор",
                "position": "Главный администратор", "phone": "000-000-0000", "assignedWarehouseId": "office"
            },
            {
                "id": "moderator-admin", "username": "Moderator", "password": "Eh45TbrNMi986V71!",
                "role": "Администратор", "firstName": "Старший", "lastName": "Модератор",
                "position": "Модератор", "phone": "111-111-1111", "assignedWarehouseId": "office"
            }
        ]
        save_data()
        print(f"⚠️ Файл {DB_FILE} не найден. Создан новый с пользователями по умолчанию.")

def save_data():
    with open(DB_FILE, 'w', encoding='utf-8') as f:
        json.dump(db, f, ensure_ascii=False, indent=4)
    print(f"💾 Данные сохранены в {DB_FILE}")

# --- События запуска и остановки приложения ---
@app.on_event("startup")
async def startup_event():
    load_data()

# --- Эндпоинты (маршруты) API ---

@app.get("/data")
async def get_app_data():
    return {
        "warehouses": db.get("warehouses", []),
        "items": db.get("items", []),
        "itemTypes": db.get("itemTypes", []),
        "scenarios": db.get("scenarios", [])
    }

@app.post("/data")
async def save_app_data(data: AppData):
    global db
    db["warehouses"] = data.warehouses
    db["items"] = data.items
    db["itemTypes"] = data.itemTypes
    db["scenarios"] = data.scenarios
    save_data()
    return {"message": "Данные успешно сохранены"}

@app.get("/users")
async def get_users():
    return db.get("users", [])

@app.post("/login")
async def login_user(credentials: UserLogin):
    for user in db["users"]:
        if user["username"] == credentials.username and user["password"] == credentials.password:
            return user
    raise HTTPException(status_code=401, detail="Неверное имя пользователя или пароль")

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

# [УЛУЧШЕНИЕ] Эндпоинт теперь использует модель User для валидации данных
@app.put("/users/{user_id}")
async def update_user(user_id: str, updated_data: User):
    global db
    user_index = -1
    for i, u in enumerate(db["users"]):
        if u["id"] == user_id:
            user_index = i
            break
    
    if user_index == -1:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    # Преобразуем Pydantic модель в словарь и обновляем данные в "базе"
    db["users"][user_index] = updated_data.model_dump()
    save_data()
    return db["users"][user_index]

@app.delete("/users/{user_id}")
async def delete_user(user_id: str):
    global db
    original_len = len(db["users"])
    db["users"] = [u for u in db["users"] if u["id"] != user_id]
    
    if len(db["users"]) == original_len:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
        
    save_data()
    return {"message": "Пользователь успешно удален"}