# Municipal Data Integration Portal

A reusable system for municipalities to manage and publish data inventories with metadata.

## 🚀 Quick Start (One-Step Process)

**Just want to run it?** It's super simple:

### Mac/Linux:
```bash
./START_APP.sh
```
Or just **double-click** `START_APP.sh`

### Windows:
**Double-click** `START_APP.bat`

### What It Does:
1. ✅ Automatically starts the backend server
2. ✅ Opens the application in your browser
3. ✅ Everything runs locally (no internet needed)

**📖 For more details, see [QUICK_START.md](QUICK_START.md)**

## Getting Started

**New to coding?** See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed step-by-step instructions.

## Manual Setup (If Needed)

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

- Upload datasets to inventory
- Edit detailed metadata for each file
- Organize by categories
- Download files and metadata separately
- Export full inventory to Excel
- Bulk delete and category assignment

## API Endpoints

- `GET /inventory` - List all datasets
- `POST /upload` - Upload file
- `POST /metadata` - Update metadata
- `GET /files/{file_name}` - Download file
- `GET /metadata/{file_name}` - Download metadata Excel
- `DELETE /delete/{file_name}` - Delete file
- `GET /export` - Export all inventory to Excel

## Docker Deployment

### Prerequisites
- Docker Desktop installed ([Download](https://www.docker.com/products/docker-desktop/))
- Verify installation: `docker --version` and `docker-compose --version`

### Quick Start

```bash
# Navigate to project root
cd Landover-Hills-Data-Integration

# Build and start containers
docker-compose up --build
```

**Access the application:**
- Frontend: `http://localhost:8080`
- Backend API: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`

### Docker Commands

**Start in background (detached mode):**
```bash
docker-compose up -d --build
```

**Stop containers:**
```bash
docker-compose down
```

**View logs:**
```bash
docker-compose logs
# Or for specific service:
docker-compose logs backend
docker-compose logs frontend
```

**Rebuild after code changes:**
```bash
docker-compose up --build
```

**Stop and remove everything (including volumes):**
```bash
docker-compose down -v
```

### How It Works

- **Backend Container**: Python 3.10 with FastAPI, runs on port 8000
- **Frontend Container**: React app built and served with Nginx, runs on port 8080
- **Volume Mounting**: `uploads/` folder is mounted so files persist on your computer
- **File Storage**: Uploaded files are stored in `main/backend/uploads/` on your host machine

### Troubleshooting

**Port already in use:**
- Change ports in `docker-compose.yml` if needed

**Build fails:**
- Check Docker is running: `docker ps`
- Check logs: `docker-compose logs`

**Frontend can't connect to backend:**
- Ensure both containers are running: `docker-compose ps`
- Check backend logs: `docker-compose logs backend`

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

Apache License 2.0
