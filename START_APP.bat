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
    if errorlevel 1 (
        echo ❌ Failed to create virtual environment
        echo Please make sure Python is installed and in your PATH
        pause
        exit /b 1
    )
)

REM Activate and start backend
call venv\Scripts\activate.bat
if errorlevel 1 (
    echo ❌ Failed to activate virtual environment
    pause
    exit /b 1
)

echo Installing/updating Python packages...
pip install -q -r requirements.txt
if errorlevel 1 (
    echo ❌ Failed to install Python packages
    pause
    exit /b 1
)

echo.
echo Starting backend server on http://127.0.0.1:8000...
echo (Backend will run in a separate window)
echo.

REM Start backend in a new window so we can see errors
start "Backend Server" cmd /k "venv\Scripts\activate.bat && python -m uvicorn main:app --host 127.0.0.1 --port 8000"

echo ✓ Backend starting...
echo.

REM Wait longer for backend to start
echo Waiting for backend to be ready...
timeout /t 5 /nobreak >nul

REM Test if backend is running
curl -s http://127.0.0.1:8000/inventory >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Backend may not be ready yet. Check the backend window for errors.
    echo Continuing anyway...
) else (
    echo ✓ Backend is ready!
)
echo.

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
echo Backend API: http://localhost:8000
echo.
echo ⚠️  IMPORTANT: Keep the backend window open!
echo    Closing it will stop the backend server.
echo.
echo Press Ctrl+C in this window to stop the frontend
echo (Then close the backend window to stop everything)
echo.

REM Start the app (opens in browser)
call npm start

REM Cleanup - try to stop backend when frontend stops
echo.
echo Stopping backend server...
taskkill /FI "WindowTitle eq Backend Server*" /F >nul 2>&1

