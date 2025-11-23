# Quick Reference Guide

## For New Municipalities

### 5-Minute Setup

1. **Run setup script:**
   ```bash
   ./setup.sh
   ```

2. **Edit `.env` file:**
   ```bash
   MUNICIPALITY_NAME=Your Municipality Name
   CONTACT_EMAIL=your-email@municipality.gov
   ```

3. **Start with Docker:**
   ```bash
   docker compose up -d
   ```

4. **Access:** http://localhost:8080

### Customization Checklist

- [ ] Municipality name set in `.env`
- [ ] Logo replaced (`main/frontend/public/maryland-flag.svg`)
- [ ] Colors updated (`main/frontend/tailwind.config.js`)
- [ ] Categories reviewed (`main/frontend/src/constants/categories.ts`)
- [ ] Contact email configured

## Common Tasks

### Upload a Dataset
1. Click "Browse" in upload section
2. Select file
3. Click "Upload File"

### Add Metadata
1. Click "View Metadata" on any file
2. Click "Edit Metadata"
3. Fill in fields (descriptions shown for each)
4. Click "Save Changes"

### Assign Category
1. Select file(s) using checkboxes
2. Click "Assign Category"
3. Choose category from dropdown
4. Click "Save Changes"

### Download Files
- **Download File**: Click "Download File" button
- **Download Metadata**: Click "Download Metadata" button

### Export All Data
- Click "Export to Excel" in header (exports all inventory)

## Deployment Quick Commands

### Docker
```bash
# Start
docker compose up -d

# Stop
docker compose down

# View logs
docker compose logs -f

# Restart
docker compose restart
```

### Local Development
```bash
# Backend
cd main/backend
source venv/bin/activate
uvicorn main:app --reload

# Frontend
cd main/frontend
npm run react-start
```

## Integration Options

1. **Simple Link**: Add link to your website
2. **iframe**: Embed in a page
3. **Subdomain**: Set up `data.your-municipality.gov`

See [INTEGRATION.md](./INTEGRATION.md) for details.

## Troubleshooting

**Can't upload files?**
- Check `uploads` folder permissions
- Verify disk space available

**Metadata export fails?**
- Ensure backend dependencies installed: `pip install -r requirements.txt`
- Check backend logs

**CORS errors?**
- Verify `REACT_APP_API_URL` in frontend `.env`
- Check backend CORS settings in `main.py`

## Support Resources

- **Setup Guide**: [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **Deployment**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Integration**: [INTEGRATION.md](./INTEGRATION.md)
- **API Docs**: http://localhost:8000/docs (when running)

