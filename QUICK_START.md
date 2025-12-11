# 🚀 Quick Start Guide

## One-Step Process

### For Mac/Linux Users:
1. **Double-click** `START_APP.sh`
   - OR open Terminal and run: `./START_APP.sh`

### For Windows Users:
1. **Double-click** `START_APP.bat`

That's it! The app will:
- ✅ Automatically start the backend server
- ✅ Open the application in your browser
- ✅ Everything runs on your computer (no internet needed after first setup)

## What Happens

When you run the launcher:
1. It checks if Python dependencies are installed (installs if needed)
2. Starts the backend server on `http://localhost:8000`
3. Checks if Node.js dependencies are installed (installs if needed)
4. Opens the app in your default browser at `http://localhost:3000`

## First Time Setup

The first time you run it, it may take a few minutes to:
- Create a Python virtual environment
- Install Python packages
- Install Node.js packages

After that, it starts in seconds!

## Troubleshooting

**"Permission denied" (Mac/Linux):**
```bash
chmod +x START_APP.sh
./START_APP.sh
```

**"Python not found":**
- Install Python 3.10+ from [python.org](https://www.python.org/downloads/)

**"Node not found":**
- Install Node.js 18+ from [nodejs.org](https://nodejs.org/)

**Port already in use:**
- Close any other applications using port 8000 or 3000
- Or restart your computer

## Stopping the App

Press `Ctrl+C` in the terminal window, or close the terminal window.

