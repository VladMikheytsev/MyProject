# server.py

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import json
import uuid
import os
from typing import Optional
import random # For simulating API response
import datetime # For simulating API response

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

app.mount("/static", StaticFiles(directory="static"), name="static")

# --- Глобальная переменная для хранения данных ---
db = {
    "warehouses": [],
    "items": [],
    "itemTypes": [],
    "users": [],
    "scenarios": [],
    "signatures": {},
    "log": [],
    "writeOffLog": [],
    "routeConfig": [],
    "routes": [] # <-- ДОБАВЛЕНО
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
    
class RouteETAPayload(BaseModel):
    origin: str
    destination: str

class AppData(BaseModel):
    warehouses: list
    items: list
    itemTypes: list
    scenarios: list
    signatures: dict
    log: Optional[list] = None
    writeOffLog: Optional[list] = None
    routeConfig: Optional[list] = None
    routes: Optional[list] = None # <-- ДОБАВЛЕНО


def load_data():
    global db
    if os.path.exists(DB_FILE):
        with open(DB_FILE, 'r', encoding='utf-8') as f:
            loaded_db = json.load(f)
            # Убедимся, что все ключи присутствуют
            db["warehouses"] = loaded_db.get("warehouses", [])
            db["items"] = loaded_db.get("items", [])
            db["itemTypes"] = loaded_db.get("itemTypes", [])
            db["users"] = loaded_db.get("users", [])
            db["scenarios"] = loaded_db.get("scenarios", [])
            db["signatures"] = loaded_db.get("signatures", {})
            db["log"] = loaded_db.get("log", [])
            db["writeOffLog"] = loaded_db.get("writeOffLog", [])
            db["routeConfig"] = loaded_db.get("routeConfig", [])
            db["routes"] = loaded_db.get("routes", []) # <-- ДОБАВЛЕНО
        print(f"✅ Данные загружены из {DB_FILE}")
    else:
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

# --- Вспомогательная функция для получения пользователя по ID ---
def get_user_by_id(user_id: str):
    for user in db["users"]:
        if user["id"] == user_id:
            return user
    return None

# --- События запуска и остановки приложения ---
@app.on_event("startup")
async def startup_event():
    load_data()

# --- Эндпоинты (маршруты) API ---

# [НОВЫЙ ЭНДПОИНТ]
@app.post("/calculate-eta")
async def get_route_eta(payload: RouteETAPayload):
    """
    Эмулирует вызов Google Maps API для получения времени в пути.
    В реальном приложении здесь будет HTTP-запрос к API Google
    с использованием библиотеки, такой как 'requests' или 'httpx'.
    """
    # GOOGLE_API_KEY = "ВАШ_КЛЮЧ_Maps_API"
    # url = f"https://maps.googleapis.com/maps/api/directions/json?origin={payload.origin}&destination={payload.destination}&key={GOOGLE_API_KEY}"
    #
    # try:
    #     async with httpx.AsyncClient() as client:
    #         response = await client.get(url)
    #         response.raise_for_status()
    #         data = response.json()
    #         # ... (парсинг ответа)
    # except Exception as e:
    #     raise HTTPException(status_code=500, detail=f"Ошибка при вызове Google API: {e}")

    # Эмуляция: возвращаем случайное время в секундах (от 30 минут до 5 часов)
    duration_in_seconds = random.randint(30 * 60, 5 * 60 * 60)
    
    # Эмуляция: форматированный текст с временем в пути
    duration = datetime.timedelta(seconds=duration_in_seconds)
    hours, remainder = divmod(duration.seconds, 3600)
    minutes, _ = divmod(remainder, 60)
    
    # Формируем человекочитаемую строку
    if hours > 0:
        duration_text = f"Примерно {hours} ч {minutes} мин"
    else:
        duration_text = f"Примерно {minutes} мин"

    return {
        "duration_seconds": duration_in_seconds,
        "duration_text": duration_text
    }


@app.get("/data/for-registration")
async def get_data_for_registration():
    # Этот эндпоинт возвращает только неконфиденциальные данные, необходимые для регистрации
    return {"warehouses": db.get("warehouses", [])}


@app.get("/data/{user_id}")
async def get_app_data(user_id: str):
    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=403, detail="Неверный пользователь")

    data_to_return = {
        "warehouses": db.get("warehouses", []),
        "items": db.get("items", []),
        "itemTypes": db.get("itemTypes", []),
        "scenarios": db.get("scenarios", []),
        "signatures": db.get("signatures", {}),
        "routeConfig": db.get("routeConfig", []),
        "routes": db.get("routes", []) # <-- ДОБАВЛЕНО
    }

    # Возвращаем журналы только если пользователь - администратор
    if user.get("role") == "Администратор":
        data_to_return["log"] = db.get("log", [])
        data_to_return["writeOffLog"] = db.get("writeOffLog", [])
    
    return data_to_return


@app.post("/data/{user_id}")
async def save_app_data(user_id: str, data: AppData):
    global db
    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=403, detail="Неверный пользователь")

    db["warehouses"] = data.warehouses
    db["items"] = data.items
    db["itemTypes"] = data.itemTypes
    db["scenarios"] = data.scenarios
    db["signatures"] = data.signatures
    
    if data.routeConfig is not None:
        db["routeConfig"] = data.routeConfig
        
    if data.routes is not None: # <-- ДОБАВЛЕНО
        db["routes"] = data.routes

    # Только администратор может обновлять журналы
    if user.get("role") == "Администратор":
        if data.log is not None:
            db["log"] = data.log
        if data.writeOffLog is not None:
            db["writeOffLog"] = data.writeOffLog
    
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

@app.delete("/users/{user_id}")
async def delete_user(user_id: str):
    global db
    original_len = len(db["users"])
    db["users"] = [u for u in db["users"] if u["id"] != user_id]
    
    if len(db["users"]) == original_len:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
        
    save_data()
    return {"message": "Пользователь успешно удален"}