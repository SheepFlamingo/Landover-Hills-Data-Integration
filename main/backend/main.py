from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import pandas as pd
import os
from datetime import datetime

app = FastAPI(title="Landover Hills Data Inventory")

# Allow the React app (localhost:3000) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # you can restrict this later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# --- Load existing files from uploads directory on startup ---
def load_existing_files():
    files = []
    for fname in os.listdir(UPLOAD_DIR):
        fpath = os.path.join(UPLOAD_DIR, fname)
        if os.path.isfile(fpath):
            size_kb = round(os.path.getsize(fpath) / 1024, 2)
            # Get file modification time as upload date
            mod_time = os.path.getmtime(fpath)
            uploaded_date = datetime.fromtimestamp(mod_time).strftime("%Y-%m-%d %H:%M:%S")
            files.append({
                "file_name": fname,
                "file_type": fname.split(".")[-1],
                "file_size_kb": size_kb,
                "uploaded": uploaded_date
            })
    return files

inventory = load_existing_files()
print(f"✅ Loaded {len(inventory)} existing file(s) from uploads folder.")

@app.post("/upload")
async def upload_file(file: UploadFile):
    filepath = os.path.join(UPLOAD_DIR, file.filename)

    # Prevent duplicate records if a file with same name already exists
    if any(i["file_name"] == file.filename for i in inventory):
        return {"message": f"File '{file.filename}' already exists."}

    with open(filepath, "wb") as f:
        f.write(await file.read())

    uploaded_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    record = {
        "file_name": file.filename,
        "file_type": file.content_type or "unknown",
        "file_size_kb": round(os.path.getsize(filepath) / 1024, 2),
        "uploaded": uploaded_date
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
            break
    return {"message": "Metadata saved"}

def sync_inventory_with_filesystem():
    """Remove entries from inventory if files no longer exist on disk"""
    global inventory
    existing_files = {f["file_name"] for f in inventory}
    actual_files = set(os.listdir(UPLOAD_DIR)) if os.path.exists(UPLOAD_DIR) else set()
    
    # Remove entries for files that no longer exist
    inventory = [item for item in inventory if item["file_name"] in actual_files]
    
    # Add any new files that exist on disk but not in inventory
    for fname in actual_files:
        if fname not in existing_files:
            fpath = os.path.join(UPLOAD_DIR, fname)
            if os.path.isfile(fpath):
                size_kb = round(os.path.getsize(fpath) / 1024, 2)
                mod_time = os.path.getmtime(fpath)
                uploaded_date = datetime.fromtimestamp(mod_time).strftime("%Y-%m-%d %H:%M:%S")
                inventory.append({
                    "file_name": fname,
                    "file_type": fname.split(".")[-1],
                    "file_size_kb": size_kb,
                    "uploaded": uploaded_date
                })

@app.get("/inventory")
def get_inventory():
    sync_inventory_with_filesystem()
    return inventory

@app.get("/export")
def export_inventory():
    if not inventory:
        return {"error": "No data"}
    df = pd.DataFrame(inventory)
    filepath = "Municipal_Data_Inventory.xlsx"
    df.to_excel(filepath, index=False)
    return FileResponse(filepath, filename=filepath)

@app.delete("/files/{file_name}")
def delete_file(file_name: str):
    filepath = os.path.join(UPLOAD_DIR, file_name)
    if not os.path.exists(filepath):
        return {"error": "File not found"}
    
    try:
        os.remove(filepath)
        # Remove from inventory
        global inventory
        inventory = [item for item in inventory if item["file_name"] != file_name]
        return {"message": f"File '{file_name}' deleted successfully"}
    except Exception as e:
        return {"error": f"Failed to delete file: {str(e)}"}

@app.get("/files/{file_name}")
def download_file(file_name: str):
    filepath = os.path.join(UPLOAD_DIR, file_name)
    if not os.path.exists(filepath):
        return {"error": "File not found"}
    return FileResponse(filepath, filename=file_name)