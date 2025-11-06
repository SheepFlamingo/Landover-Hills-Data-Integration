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
    dataset_title: str = Form(""),
    description: str = Form(""),
    category: str = Form(""),
    tags: str = Form(""),
    row_labels: str = Form(""),
    update_frequency: str = Form(""),
    data_provided_by: str = Form(""),
    contact_email: str = Form(""),
    licensing: str = Form(""),
    data_dictionary: str = Form(""),
    resource_name: str = Form(""),
    last_updated_date: str = Form("")
):
    for item in inventory:
        if item["file_name"] == file_name:
            item.update({
                "dataset_title": dataset_title,
                "description": description,
                "category": category,
                "tags": tags,
                "row_labels": row_labels,
                "update_frequency": update_frequency,
                "data_provided_by": data_provided_by,
                "contact_email": contact_email,
                "licensing": licensing,
                "data_dictionary": data_dictionary,
                "resource_name": resource_name,
                "last_updated_date": last_updated_date
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