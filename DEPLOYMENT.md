# Deployment Guide

This guide covers deploying the Municipal Data Integration system for production use.

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Municipality name and branding updated
- [ ] SSL certificate obtained (for HTTPS)
- [ ] Domain/subdomain configured
- [ ] Backup strategy in place
- [ ] Staff trained on system usage

## Deployment Platforms

### Backend Deployment

#### Render.com (Recommended for Beginners)

1. **Create a new Web Service**
2. **Connect your GitHub repository**
3. **Configure:**
   - **Build Command**: `cd main/backend && pip install -r requirements.txt`
   - **Start Command**: `cd main/backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Environment Variables**: Add all variables from `.env.example`
4. **Deploy**

#### Railway

1. **Create new project**
2. **Deploy from GitHub**
3. **Set root directory**: `main/backend`
4. **Add environment variables**
5. **Deploy**

#### Heroku

```bash
cd main/backend
heroku create your-municipality-data-api
heroku config:set MUNICIPALITY_NAME="Town of Your Municipality"
git push heroku main
```

### Frontend Deployment

#### Vercel (Recommended)

1. **Import project from GitHub**
2. **Configure:**
   - **Root Directory**: `main/frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Environment Variables**: `REACT_APP_API_URL=https://your-api-url.com`
3. **Deploy**

#### Netlify

1. **Connect GitHub repository**
2. **Build settings:**
   - Base directory: `main/frontend`
   - Build command: `npm run build`
   - Publish directory: `main/frontend/build`
3. **Environment variables**: Add `REACT_APP_API_URL`
4. **Deploy**

## Docker Deployment

### Single Server Deployment

```bash
# Clone repository
git clone <your-repo-url>
cd Landover-Hills-Data-Integration

# Configure
cp .env.example .env
# Edit .env with your settings

# Build and start
docker compose up -d

# Check status
docker compose ps
```

### With Reverse Proxy (nginx)

1. **Install nginx**
2. **Configure nginx** (`/etc/nginx/sites-available/data-portal`):
```nginx
server {
    listen 80;
    server_name data.your-municipality.gov;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

3. **Enable SSL with Let's Encrypt**:
```bash
sudo certbot --nginx -d data.your-municipality.gov
```

## Environment-Specific Configuration

### Development
```bash
REACT_APP_API_URL=http://localhost:8000
```

### Staging
```bash
REACT_APP_API_URL=https://staging-api.your-municipality.gov
```

### Production
```bash
REACT_APP_API_URL=https://api.your-municipality.gov
```

## Post-Deployment

1. **Test all functionality:**
   - File upload
   - Metadata editing
   - File download
   - Metadata export
   - Category assignment

2. **Set up monitoring:**
   - Uptime monitoring (UptimeRobot, Pingdom)
   - Error tracking (Sentry, LogRocket)

3. **Configure backups:**
   - Automated daily backups of `uploads` folder
   - Database backups (if using database)

4. **Documentation:**
   - Create user guide for staff
   - Document API endpoints for developers

## Troubleshooting

### Common Issues

**CORS Errors:**
- Ensure backend CORS settings allow your frontend domain
- Check `allow_origins` in `main.py`

**File Upload Fails:**
- Check file size limits
- Verify `uploads` folder permissions
- Check disk space

**Metadata Export Fails:**
- Verify `openpyxl` or `xlsxwriter` is installed
- Check backend logs for errors

## Scaling Considerations

For high-traffic municipalities:
- Use a database (PostgreSQL) instead of in-memory storage
- Implement caching (Redis)
- Use CDN for static assets
- Consider load balancing for backend

## Security Best Practices

1. **Use HTTPS** (SSL/TLS certificates)
2. **Set secure CORS origins** (not `*` in production)
3. **Implement rate limiting** for API endpoints
4. **Regular security updates** for dependencies
5. **Backup encryption** for sensitive data
6. **Access controls** (if needed for future versions)

