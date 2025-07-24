import json
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any

app = FastAPI()

origins = [
    "http://localhost:3000",
    "https://my-project-sable-iota.vercel.app"
    "https://e11116600382.ngrok-free.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(BASE_DIR, "warehouse_db.json")

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
            print("Загрузка данных из warehouse_db.json")
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        print("Файл не найден, возвращаю дефолтные данные")
        return DEFAULT_DATA

def save_db(data: Dict):
    with open(DB_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    print(f"✅ Данные сохранены: {len(data.get('warehouses', []))} складов, "
          f"{len(data.get('items', []))} товаров")

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
    if data == DEFAULT_DATA:
        print("⛔️ Сохранение отменено: получены дефолтные данные.")
        return {"status": "skipped"}
    save_db(data)
    return {"status": "success"}
