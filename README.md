# Municipal Data Integration Portal

A reusable system for municipalities to manage and publish data inventories with metadata.

## Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+

### Backend

```bash
cd main/backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Backend runs at `http://localhost:8000`

### Frontend

```bash
cd main/frontend
npm install
echo "REACT_APP_API_URL=http://localhost:8000" > .env
npm start
```

Frontend runs at `http://localhost:3000`

## Configuration

### API URL Pattern

Both `App.tsx` and `MetadataDetails.tsx` use:

```typescript
const API = process.env.REACT_APP_API_URL || "https://landover-hills-data-integration-api.onrender.com";
```

**How it works:**
- Checks for `REACT_APP_API_URL` in `.env` file
- Falls back to production URL if not set
- Allows same codebase for local dev and production

**Local Development:**
Create `main/frontend/.env`:
```
REACT_APP_API_URL=http://localhost:8000
```

**Production:**
Set environment variable or use default production URL.

## Project Structure

```
main/
├── backend/
│   ├── main.py          # FastAPI endpoints
│   ├── uploads/         # File storage
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── App.tsx              # Main inventory page
    │   └── MetadataDetails.tsx  # Metadata editor
    └── .env                     # API configuration
```

## Features

- 📤 Upload datasets to inventory
- 📝 Edit detailed metadata for each file
- 🏷️ Organize by categories
- 📥 Download files and metadata separately
- 📊 Export full inventory to Excel
- 🗑️ Bulk delete and category assignment

## API Endpoints

- `GET /inventory` - List all datasets
- `POST /upload` - Upload file
- `POST /metadata` - Update metadata
- `GET /files/{file_name}` - Download file
- `GET /metadata/{file_name}` - Download metadata Excel
- `DELETE /delete/{file_name}` - Delete file
- `GET /export` - Export all inventory to Excel

## Docker Deployment

```bash
docker-compose up --build
```

- Backend: `http://localhost:8000`
- Frontend: `http://localhost:8080`

## For Other Municipalities

1. Clone repository
2. Set `REACT_APP_API_URL` to your backend URL
3. Update municipality name (or use first-run modal)
4. Deploy backend and frontend

## Troubleshooting

**Frontend can't connect:**
- Verify backend is running on port 8000
- Check `.env` file exists with correct URL
- Check browser console for CORS errors

**Export fails:**
- Ensure `openpyxl` is installed: `pip install openpyxl`

**Port already in use:**
- Change port: `uvicorn main:app --reload --port 8001`
- Update `.env` accordingly

**Module not found errors:**
- Ensure virtual environment is activated
- Reinstall: `pip install -r requirements.txt`

## License

MIT
