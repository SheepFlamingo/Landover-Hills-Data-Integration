from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import pandas as pd
import os
import io

app = FastAPI(title="Landover Hills Data Inventory")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
inventory = []

@app.post("/upload")
async def upload_file(file: UploadFile):
    # Save any file type
    filepath = os.path.join(UPLOAD_DIR, file.filename)
    with open(filepath, "wb") as f:
        f.write(await file.read())

    # Basic file info
    record = {
        "file_name": file.filename,
        "file_type": file.content_type or "unknown",
        "file_size_kb": round(os.path.getsize(filepath) / 1024, 2)
    }
    inventory.append(record)
    return {"message": "File uploaded", "file_name": file.filename}

@app.post("/metadata")
def add_metadata(
    file_name: str = Form(...),
    dataset_name: str = Form(...),
    description: str = Form(...),
    department: str = Form(...),
    format: str = Form(...),
    update_frequency: str = Form(...),
    public: str = Form(...),
    metadata_status: str = Form(...),
    notes: str = Form("")
):
    for item in inventory:
        if item["file_name"] == file_name:
            item.update({
                "dataset_name": dataset_name,
                "description": description,
                "department": department,
                "format": format,
                "update_frequency": update_frequency,
                "public": public,
                "metadata_status": metadata_status,
                "notes": notes
            })
    return {"message": "Metadata saved"}

@app.get("/inventory")
def get_inventory():
    return inventory

@app.get("/export")
def export_inventory():
    if not inventory:
        return {"error": "No data"}
    df = pd.DataFrame(inventory)
    filepath = "Municipal_Data_Inventory.xlsx"
    df.to_excel(filepath, index=False)
    return FileResponse(filepath, filename=filepath)