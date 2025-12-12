# Troubleshooting Guide

## Network Error on Windows

If you're seeing "Network Error" or "AxiosError: Network Error" when the app tries to load:

### Quick Fixes:

1. **Check if backend is running:**
   - Look for a window titled "Backend Server"
   - It should show "Uvicorn running on http://127.0.0.1:8000"
   - If you don't see this window, the backend didn't start

2. **Test backend manually:**
   - Open a new terminal/command prompt
   - Run: `curl http://localhost:8000/inventory`
   - Or visit: http://localhost:8000/inventory in your browser
   - You should see JSON data, not an error

3. **Check if port 8000 is in use:**
   ```cmd
   netstat -ano | findstr :8000
   ```
   - If something else is using port 8000, stop it first

4. **Check if .env file exists:**
   - Make sure `main/frontend/.env` exists
   - It should contain: `REACT_APP_API_URL=http://localhost:8000`
   - If it doesn't exist, create it manually

5. **Restart everything:**
   - Close all terminal windows
   - Stop any Python processes: `taskkill /F /IM python.exe`
   - Run `START_APP.bat` again

### Common Issues:

**"Python not found":**
- Install Python 3.10+ from python.org
- Make sure "Add Python to PATH" is checked during installation
- Restart your computer after installing

**"Backend window closes immediately":**
- Check the error message in the backend window
- Common causes:
  - Missing Python packages: Run `pip install -r requirements.txt` manually
  - Port 8000 already in use: Close other applications
  - Python version too old: Need Python 3.10+

**"Frontend can't connect to backend":**
- Make sure backend window is still open
- Check backend URL in `main/frontend/.env` is `http://localhost:8000`
- Try accessing http://localhost:8000/inventory directly in browser
- Check Windows Firewall isn't blocking port 8000

**"Module not found" errors:**
- Backend: `cd main\backend && venv\Scripts\activate && pip install -r requirements.txt`
- Frontend: `cd main\frontend && npm install`

### Manual Backend Start (for debugging):

```cmd
cd main\backend
venv\Scripts\activate
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

If you see errors, fix them before starting the frontend.

