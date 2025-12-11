@echo off
REM One-step launcher for Windows - starts backend and opens the app

echo 🚀 Starting Landover Hills Data Integration...
echo.

cd /d "%~dp0"

REM Start backend
echo 📡 Starting backend server...
cd main\backend

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate and start backend
call venv\Scripts\activate.bat
pip install -q -r requirements.txt >nul 2>&1

REM Start backend in background
start /B python -m uvicorn main:app --host 127.0.0.1 --port 8000 >nul 2>&1

echo ✓ Backend started
echo.

REM Wait a moment
timeout /t 2 /nobreak >nul

REM Go to frontend
cd ..\frontend

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    call npm install
)

REM Check if .env exists
if not exist ".env" (
    echo REACT_APP_API_URL=http://localhost:8000 > .env
)

echo 🖥️  Opening application in browser...
echo.
echo The app will open at: http://localhost:3000
echo Press Ctrl+C to stop the application
echo.

REM Start the app (opens in browser)
call npm start

