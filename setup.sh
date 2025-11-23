#!/bin/bash

# Municipal Data Integration - Setup Script
# This script helps you quickly set up the platform for your municipality

set -e

echo "🏛️  Municipal Data Integration - Setup"
echo "======================================"
echo ""

# Check if .env exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists. Skipping creation."
    echo ""
else
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ Created .env file"
    echo ""
    echo "⚠️  Please edit .env file with your municipality information:"
    echo "   - MUNICIPALITY_NAME"
    echo "   - MUNICIPALITY_WEBSITE"
    echo "   - CONTACT_EMAIL"
    echo ""
    read -p "Press Enter to continue after editing .env (or Ctrl+C to exit)..."
fi

# Check for Docker
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    echo "🐳 Docker detected. Would you like to use Docker? (recommended)"
    read -p "Use Docker? [Y/n]: " use_docker
    
    if [[ $use_docker =~ ^[Yy]$ ]] || [[ -z $use_docker ]]; then
        echo ""
        echo "🚀 Starting with Docker..."
        docker compose up -d
        echo ""
        echo "✅ Application is starting!"
        echo ""
        echo "📍 Access points:"
        echo "   - Frontend: http://localhost:8080"
        echo "   - Backend API: http://localhost:8000"
        echo "   - API Docs: http://localhost:8000/docs"
        echo ""
        echo "To stop: docker compose down"
        exit 0
    fi
fi

# Local development setup
echo "🔧 Setting up for local development..."
echo ""

# Backend setup
echo "📦 Setting up backend..."
cd main/backend

if [ ! -d "venv" ]; then
    echo "   Creating Python virtual environment..."
    python3 -m venv venv
fi

echo "   Activating virtual environment..."
source venv/bin/activate

echo "   Installing Python dependencies..."
pip install -r requirements.txt

cd ../..

# Frontend setup
echo ""
echo "📦 Setting up frontend..."
cd main/frontend

if [ ! -d "node_modules" ]; then
    echo "   Installing Node.js dependencies..."
    npm install
fi

# Create .env for frontend if it doesn't exist
if [ ! -f ".env" ]; then
    echo "   Creating frontend .env file..."
    echo "REACT_APP_API_URL=http://localhost:8000" > .env
fi

cd ../..

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start the application:"
echo ""
echo "   Terminal 1 (Backend):"
echo "   cd main/backend"
echo "   source venv/bin/activate"
echo "   uvicorn main:app --reload --host 0.0.0.0 --port 8000"
echo ""
echo "   Terminal 2 (Frontend):"
echo "   cd main/frontend"
echo "   npm run react-start"
echo ""
echo "📍 Then access:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:8000/docs"
echo ""

