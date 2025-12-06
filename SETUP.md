# Recipe Rescue Pro - Setup Guide

Complete setup instructions for getting Recipe Rescue Pro running locally.

## Prerequisites

Make sure you have the following installed:

- **Node.js** 18+ and npm
- **Python** 3.10+
- **Git**

## Quick Start (5 minutes)

### Option 1: Run Both Frontend & Backend Together

```bash
# Clone the repository
git clone https://github.com/rajeet-04/Recipie-Rescue-Pro.git
cd Recipie-Rescue-Pro

# Terminal 1: Start Backend
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python run.py

# Terminal 2: Start Frontend
cd frontend
npm install
npm run dev
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Option 2: Run Frontend Only (Using Supercook Directly)

The frontend can work standalone without the backend by calling Supercook API directly:

```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:3000

## Detailed Setup

### 1. Frontend Setup (Next.js)

```bash
cd frontend

# Install dependencies
npm install

# Development mode (with hot reload)
npm run dev

# Production build
npm run build
npm start

# Linting
npm run lint
```

**Frontend Configuration:**
- No environment variables required for basic setup
- CORS already configured for localhost:8000
- See `frontend/README.md` for details

### 2. Backend Setup (Python FastAPI)

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Edit .env if needed (optional)
nano .env

# Run the server
python run.py

# Or with uvicorn directly
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Backend Configuration (.env):**
```env
HOST=0.0.0.0
PORT=8000
DEBUG=True
ALLOWED_ORIGINS=http://localhost:3000
```

### 3. Verify Installation

**Test Backend:**
```bash
curl http://localhost:8000/health
# Should return: {"status":"healthy","service":"recipe-rescue-api"}

curl http://localhost:8000/api/ingredients/categories
# Should return ingredient categories
```

**Test Frontend:**
- Navigate to http://localhost:3000
- Should see the Recipe Rescue Pro landing page
- Try adding ingredients in "My Pantry"
- Search for recipes

## Development Workflow

### Working on Frontend

```bash
cd frontend
npm run dev
```

Changes will hot-reload automatically.

### Working on Backend

```bash
cd backend
source venv/bin/activate  # Activate venv
python run.py
```

FastAPI will auto-reload on file changes.

### Running Both

Use two terminal windows/tabs:
- Terminal 1: Backend (port 8000)
- Terminal 2: Frontend (port 3000)

## Common Issues & Solutions

### Issue: "Command not found: npm"
**Solution:** Install Node.js from https://nodejs.org/

### Issue: "Command not found: python"
**Solution:** Install Python from https://python.org/
On some systems, use `python3` instead of `python`

### Issue: Backend port 8000 already in use
**Solution:** 
```bash
# Find and kill the process
# On Linux/Mac:
lsof -ti:8000 | xargs kill -9
# On Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Issue: Frontend port 3000 already in use
**Solution:** Next.js will automatically use port 3001

### Issue: CORS errors in browser
**Solution:** Make sure backend is running and ALLOWED_ORIGINS in .env includes your frontend URL

### Issue: Module not found errors (Python)
**Solution:** Make sure virtual environment is activated and dependencies are installed:
```bash
source venv/bin/activate
pip install -r requirements.txt
```

### Issue: Module not found errors (Node)
**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## Testing

### Frontend Tests
```bash
cd frontend
npm test
```

### Backend Tests
```bash
cd backend
pytest
```

## Building for Production

### Frontend Production Build

```bash
cd frontend
npm run build
npm start
```

Or deploy to Vercel:
```bash
npm install -g vercel
vercel
```

### Backend Production

For production, use a proper ASGI server setup:

```bash
# Install production dependencies
pip install gunicorn

# Run with gunicorn
gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

Or deploy to:
- Railway
- Render
- DigitalOcean App Platform
- AWS/GCP/Azure

## Environment Variables

### Frontend (.env.local)
```env
# Optional: If using separate API
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (.env)
```env
HOST=0.0.0.0
PORT=8000
DEBUG=False  # Set to False in production
ALLOWED_ORIGINS=https://your-frontend-domain.com

# Future features (not needed yet)
# GEMINI_API_KEY=
# SUPABASE_URL=
# SUPABASE_KEY=
```

## Architecture Overview

```
Recipe Rescue Pro
├── Frontend (Next.js 14)
│   ├── Port: 3000
│   ├── Framework: React 18
│   ├── Styling: Tailwind CSS
│   └── Features: Pantry, Recipe Search
│
└── Backend (FastAPI)
    ├── Port: 8000
    ├── Framework: Python FastAPI
    ├── Features: Recipe API, Ingredients
    └── Integration: Supercook API
```

## Next Steps

After setup:

1. ✅ Explore the landing page
2. ✅ Add ingredients to your pantry
3. ✅ Search for recipes
4. ✅ Check out the API docs at http://localhost:8000/docs
5. 📖 Read the architecture docs
6. 🚀 Start building new features!

## Getting Help

- **Issues**: https://github.com/rajeet-04/Recipie-Rescue-Pro/issues
- **Docs**: Check README.md files in frontend/ and backend/
- **API Docs**: http://localhost:8000/docs (when backend is running)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

See [Architecture Documentation](recipe-rescue-architecture.md) for technical details.

---

**Happy Coding! 🥗**
