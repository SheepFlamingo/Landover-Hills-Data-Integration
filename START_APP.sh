#!/bin/bash
# One-step launcher - starts backend and opens the app

echo "🚀 Starting Landover Hills Data Integration..."
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Start backend in background
echo "📡 Starting backend server..."
cd main/backend

# Check if virtual environment exists, if not create it
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment and start backend
source venv/bin/activate
pip install -q -r requirements.txt 2>/dev/null

# Start backend in background
python3 -m uvicorn main:app --host 127.0.0.1 --port 8000 > /dev/null 2>&1 &
BACKEND_PID=$!

echo "✓ Backend started (PID: $BACKEND_PID)"
echo ""

# Wait a moment for backend to start
sleep 2

# Go back to frontend and start Electron
cd ../frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "REACT_APP_API_URL=http://localhost:8000" > .env
fi

echo "🖥️  Opening application in browser..."
echo ""
echo "The app will open at: http://localhost:3000"
echo "Press Ctrl+C to stop the application"
echo ""

# Start the app (opens in browser)
npm start

# Cleanup: kill backend when script exits
trap "kill $BACKEND_PID 2>/dev/null" EXIT

