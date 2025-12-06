# Deployment Guide - Recipe Rescue Pro

Guide for deploying Recipe Rescue Pro to production.

## Deployment Options

### Frontend Deployment

#### Option 1: Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

**Steps:**
1. Push your code to GitHub
2. Go to https://vercel.com
3. Click "New Project"
4. Import your GitHub repository
5. Configure:
   - Framework Preset: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. Add environment variables (if needed)
7. Click "Deploy"

**Environment Variables:**
```env
NEXT_PUBLIC_API_URL=https://your-backend-api.com
```

#### Option 2: Netlify

```bash
cd frontend
npm run build

# Deploy
npx netlify-cli deploy --prod
```

#### Option 3: Docker

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t recipe-rescue-frontend .
docker run -p 3000:3000 recipe-rescue-frontend
```

### Backend Deployment

#### Option 1: Railway (Recommended for Python)

**Steps:**
1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Configure:
   - Root Directory: `backend`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables:
   ```env
   DEBUG=False
   ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```
6. Deploy

#### Option 2: Render

**render.yaml:**
```yaml
services:
  - type: web
    name: recipe-rescue-api
    env: python
    region: oregon
    buildCommand: "pip install -r requirements.txt"
    startCommand: "uvicorn app.main:app --host 0.0.0.0 --port $PORT"
    envVars:
      - key: DEBUG
        value: False
      - key: ALLOWED_ORIGINS
        value: https://your-frontend.vercel.app
```

#### Option 3: Docker

```dockerfile
# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:
```bash
docker build -t recipe-rescue-backend .
docker run -p 8000:8000 recipe-rescue-backend
```

#### Option 4: DigitalOcean App Platform

**app.yaml:**
```yaml
name: recipe-rescue-pro
services:
  - name: backend
    github:
      repo: rajeet-04/Recipie-Rescue-Pro
      branch: main
      deploy_on_push: true
    source_dir: /backend
    run_command: uvicorn app.main:app --host 0.0.0.0 --port 8080
    envs:
      - key: DEBUG
        value: "False"
      - key: ALLOWED_ORIGINS
        value: ${frontend.PUBLIC_URL}
    http_port: 8080
    
  - name: frontend
    github:
      repo: rajeet-04/Recipie-Rescue-Pro
      branch: main
      deploy_on_push: true
    source_dir: /frontend
    build_command: npm run build
    run_command: npm start
    envs:
      - key: NEXT_PUBLIC_API_URL
        value: ${backend.PUBLIC_URL}
    http_port: 3000
```

### Full Stack Deployment with Docker Compose

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DEBUG=False
      - ALLOWED_ORIGINS=http://localhost:3000
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
    depends_on:
      - backend
    restart: unless-stopped
```

Run:
```bash
docker-compose up -d
```

## Production Checklist

### Frontend

- [ ] Build completes without errors
- [ ] Environment variables configured
- [ ] CORS settings match backend URL
- [ ] Images optimized
- [ ] Meta tags and SEO configured
- [ ] Analytics added (optional)
- [ ] Error tracking (Sentry) configured
- [ ] Performance tested (Lighthouse)

### Backend

- [ ] DEBUG=False in production
- [ ] ALLOWED_ORIGINS set correctly
- [ ] All dependencies in requirements.txt
- [ ] Health check endpoint working
- [ ] API documentation accessible
- [ ] Error logging configured
- [ ] Rate limiting enabled (future)
- [ ] SSL/HTTPS configured

## Environment Variables Reference

### Frontend Production
```env
NEXT_PUBLIC_API_URL=https://api.reciperescue.com
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

### Backend Production
```env
HOST=0.0.0.0
PORT=8000
DEBUG=False
ALLOWED_ORIGINS=https://reciperescue.com,https://www.reciperescue.com

# Future additions
GEMINI_API_KEY=your_key
SUPABASE_URL=your_url
SUPABASE_KEY=your_key
DATABASE_URL=postgresql://...
```

## Monitoring & Maintenance

### Health Checks

**Backend:**
```bash
curl https://api.yourdomain.com/health
```

**Frontend:**
Check if homepage loads successfully

### Logging

**Backend Logging:**
```python
# Add to app/main.py
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
```

**Error Tracking:**
- Use Sentry for both frontend and backend
- Track API errors and performance

### Performance Monitoring

**Frontend:**
- Vercel Analytics (automatic with Vercel)
- Google Lighthouse
- Web Vitals

**Backend:**
- API response times
- Request rate
- Error rate

### Backups

If using database (future):
- Daily automated backups
- Point-in-time recovery
- Test restoration process

## Scaling Considerations

### Current Setup (MVP)
- Frontend: Static hosting (Vercel/Netlify)
- Backend: Single instance (Railway/Render)
- No database yet

### Future Scaling
1. **Add Database** (PostgreSQL via Supabase)
2. **Enable Caching** (Redis for recipe searches)
3. **CDN** (Cloudflare for static assets)
4. **Load Balancing** (Multiple backend instances)
5. **Background Jobs** (Celery for AI processing)

## Security Best Practices

- [ ] HTTPS enabled (SSL certificates)
- [ ] API keys stored in environment variables
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] Security headers configured
- [ ] Dependencies regularly updated
- [ ] Secrets never committed to Git

## CI/CD Pipeline

### GitHub Actions Example

**.github/workflows/deploy.yml:**
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        run: |
          # Railway CLI deployment
          
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## Rollback Strategy

### Frontend
- Vercel: Use deployments page to rollback
- Keep previous 10 deployments

### Backend
- Railway/Render: Rollback from dashboard
- Keep Docker images tagged by version

## Domain & DNS

### Custom Domain Setup

1. **Purchase domain** (e.g., reciperescue.com)
2. **Configure DNS:**
   ```
   A     @     → Frontend IP
   CNAME api   → Backend URL
   ```
3. **SSL Certificates:**
   - Vercel/Netlify handle automatically
   - Railway provides HTTPS

## Cost Estimation

### Free Tier (MVP)
- Frontend: Vercel Free ($0)
- Backend: Railway Free ($0-5)
- Total: **~$0-5/month**

### Paid Tier (Production)
- Frontend: Vercel Pro ($20/month)
- Backend: Railway Pro ($20/month)
- Database: Supabase Pro ($25/month)
- CDN: Cloudflare Pro ($20/month)
- Total: **~$85/month**

### Scale (1000+ users)
- Frontend: Vercel Pro ($20)
- Backend: Multiple instances ($100)
- Database: Supabase Pro ($25-100)
- Cache: Redis ($15)
- CDN: Cloudflare ($20)
- Total: **~$180-255/month**

## Support & Monitoring

- Set up status page (e.g., status.reciperescue.com)
- Configure uptime monitoring (UptimeRobot)
- Set up alerts for downtime
- Monitor error rates
- Track performance metrics

## Post-Deployment

1. Test all features in production
2. Monitor error logs
3. Check performance metrics
4. Collect user feedback
5. Plan next iteration

---

**Ready for Production! 🚀**
