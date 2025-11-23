from fastapi import FastAPI, UploadFile, Form, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
import pandas as pd
import os
import io
import zipfile
import urllib.parse
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

@app.get("/files/{file_name}")
def download_file(file_name: str):
    filepath = os.path.join(UPLOAD_DIR, file_name)
    if not os.path.exists(filepath):
        return {"error": "File not found"}
    return FileResponse(filepath, filename=file_name)

def _build_metadata_workbook(records: list[dict]):
    """Build a formatted Excel workbook with metadata in a readable format"""
    engines = ["openpyxl", "xlsxwriter"]
    buffer = io.BytesIO()
    
    for engine in engines:
        try:
            with pd.ExcelWriter(buffer, engine=engine) as writer:
                for record in records:
                    # Create a formatted metadata table
                    metadata_fields = [
                        ("File Name", record.get("file_name", "")),
                        ("Dataset Title", record.get("dataset_title", "")),
                        ("Description", record.get("description", "")),
                        ("Category", record.get("category", "")),
                        ("Tags / Keywords", record.get("tags", "")),
                        ("Row Labels", record.get("row_labels", "")),
                        ("Update Frequency", record.get("update_frequency", "")),
                        ("Data Provided By", record.get("data_provided_by", "")),
                        ("Contact Email", record.get("contact_email", "")),
                        ("Licensing & Attribution", record.get("licensing", "")),
                        ("Data Dictionary / Attachments", record.get("data_dictionary", "")),
                        ("Resource Name", record.get("resource_name", "")),
                        ("Last Updated Date", record.get("last_updated_date", "")),
                        ("File Type", record.get("file_type", "")),
                        ("File Size (KB)", record.get("file_size_kb", "")),
                        ("Uploaded", record.get("uploaded", "")),
                    ]
                    
                    # Create DataFrame with Field and Value columns
                    df = pd.DataFrame(metadata_fields, columns=["Field", "Value"])
                    
                    # Use file name as sheet name (truncate if too long)
                    sheet_name = record.get("file_name", "Metadata")[:31]  # Excel sheet name limit
                    df.to_excel(writer, sheet_name=sheet_name, index=False)
                    
                    # Try to format the sheet if using openpyxl
                    if engine == "openpyxl":
                        try:
                            from openpyxl.utils import get_column_letter
                            worksheet = writer.sheets[sheet_name]
                            # Auto-adjust column widths
                            for idx, col in enumerate(df.columns):
                                max_length = max(
                                    df[col].astype(str).map(len).max(),
                                    len(str(col))
                                )
                                col_letter = get_column_letter(idx + 1)
                                worksheet.column_dimensions[col_letter].width = min(max_length + 2, 50)
                        except:
                            pass  # If formatting fails, just continue
            
            buffer.seek(0)
            return buffer
        except ModuleNotFoundError:
            buffer.seek(0)
            buffer.truncate(0)
            continue
        except Exception as e:
            # If there's an error with one engine, try the next
            buffer.seek(0)
            buffer.truncate(0)
            continue
    
    raise HTTPException(
        status_code=500,
        detail="Excel export requires either 'openpyxl' or 'xlsxwriter'. Run 'pip install openpyxl xlsxwriter' inside the backend environment.",
    )


@app.get("/metadata/{file_name:path}")
def export_file_metadata(file_name: str):
    """Export metadata for a single file as Excel with all metadata editor fields"""
    file_name_decoded = urllib.parse.unquote(file_name)
    item = next((i for i in inventory if i["file_name"] == file_name_decoded), None)
    
    if not item:
        raise HTTPException(status_code=404, detail="File not found in inventory")
    
    try:
        metadata_buffer = _build_metadata_workbook([item])
        safe_filename = file_name_decoded.replace(" ", "_").replace("/", "_").replace("\\", "_").replace(",", "_")
        buffer_content = metadata_buffer.read()
        return StreamingResponse(
            io.BytesIO(buffer_content),
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={
                "Content-Disposition": f'attachment; filename="{safe_filename}_metadata.xlsx"'
            },
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create Excel file: {str(e)}")

@app.delete("/delete/{file_name}")
def delete_file(file_name: str):
    # Remove from inventory
    global inventory
    file_found = False
    for i, item in enumerate(inventory):
        if item["file_name"] == file_name:
            inventory.pop(i)
            file_found = True
            break
    
    # Delete the physical file
    filepath = os.path.join(UPLOAD_DIR, file_name)
    if os.path.exists(filepath):
        os.remove(filepath)
        return {"message": f"File '{file_name}' deleted successfully"}
    elif file_found:
        # File was in inventory but not on disk
        return {"message": f"File '{file_name}' removed from inventory"}
    else:
        return {"error": "File not found"}