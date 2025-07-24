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

# 📥 Загрузка из файла
def load_db():
    try:
        with open(DB_FILE, "r", encoding="utf-8") as f:
            print("✅ Загрузка данных из warehouse_db.json")
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        print("⚠️ Файл не найден или повреждён, возвращаю дефолтные данные")
        return DEFAULT_DATA

# 💾 Сохранение в файл
def save_db(data: Dict):
    with open(DB_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    print(f"💾 Сохранено: {len(data.get('warehouses', []))} складов, "
          f"{len(data.get('items', []))} товаров")

# 🚀 При старте — создать файл, если его нет
@app.on_event("startup")
def initialize_db():
    if not os.path.exists(DB_FILE):
        print("📂 warehouse_db.json не найден. Создаю файл.")
        save_db(DEFAULT_DATA)

# 📤 Получение данных
@app.get("/api/data")
async def get_all_data():
    return load_db()

# 📥 Обновление данных
@app.post("/api/data")
async def update_all_data(data: Dict[str, Any], request: Request):
    print("📥 POST /api/data — данные получены:")
    print(json.dumps(data, indent=2, ensure_ascii=False))

    if data == DEFAULT_DATA:
        print("⛔️ Получены дефолтные данные — не сохраняю.")
        return {"status": "skipped"}
    save_db(data)
    return {"status": "success"}

# 🔧 Preflight-запрос OPTIONS (по желанию)
@app.options("/api/data")
async def options_handler():
    return JSONResponse(status_code=200, content={"ok": True})
