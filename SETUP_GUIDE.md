# Municipal Data Integration - Setup Guide

This guide will help you set up the Municipal Data Integration system for your municipality.

## Quick Start

### Option 1: Docker (Recommended for Production)

1. **Clone or download this repository**

2. **Configure your municipality settings:**
   ```bash
   cp .env.example .env
   # Edit .env with your municipality details
   ```

3. **Start the application:**
   ```bash
   docker compose up -d
   ```

4. **Access the application:**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Option 2: Local Development

1. **Backend Setup:**
   ```bash
   cd main/backend
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Frontend Setup:**
   ```bash
   cd main/frontend
   npm install
   # Create .env file with: REACT_APP_API_URL=http://localhost:8000
   npm run react-start
   ```

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
# Municipality Information
MUNICIPALITY_NAME=Town of Your Municipality
MUNICIPALITY_WEBSITE=https://your-municipality.gov
CONTACT_EMAIL=dataservices@your-municipality.gov

# API Configuration
BACKEND_PORT=8000
FRONTEND_PORT=3000

# Production Settings (for deployment)
API_URL=https://your-api-domain.com
FRONTEND_URL=https://your-frontend-domain.com
```

### Customization Points

1. **Municipality Name**: Set in `.env` file or via the UI on first launch
2. **Categories**: Edit `main/frontend/src/constants/categories.ts`
3. **Branding**: 
   - Logo: Replace `main/frontend/public/maryland-flag.svg`
   - Colors: Edit `main/frontend/tailwind.config.js`
   - Title: Edit `main/frontend/public/index.html`

## Deployment Options

### Option 1: Cloud Hosting (Recommended)

**Backend (FastAPI):**
- **Render.com**: Free tier available, easy deployment
- **Heroku**: Simple deployment with git push
- **Railway**: Modern platform with good free tier
- **AWS/GCP/Azure**: For enterprise needs

**Frontend (React):**
- **Vercel**: Excellent for React apps, free tier
- **Netlify**: Easy deployment, free tier
- **GitHub Pages**: Free static hosting
- **AWS S3 + CloudFront**: Scalable option

### Option 2: Self-Hosted Server

1. **Set up a VPS** (DigitalOcean, Linode, AWS EC2, etc.)
2. **Install Docker and Docker Compose**
3. **Clone repository and configure**
4. **Run**: `docker compose up -d`
5. **Set up reverse proxy** (nginx) for domain and SSL

### Option 3: Municipal Server

If your municipality has its own server:
1. Follow the Docker setup
2. Configure firewall rules
3. Set up domain DNS
4. Install SSL certificate (Let's Encrypt)

## Integration with Municipal Website

### Option 1: Embed as iframe

Add to your municipal website:
```html
<iframe 
  src="https://your-data-portal.com" 
  width="100%" 
  height="800px"
  frameborder="0">
</iframe>
```

### Option 2: Link from Website

Add a prominent link on your municipal website:
```html
<a href="https://your-data-portal.com" target="_blank">
  View Our Open Data Portal
</a>
```

### Option 3: Subdomain Integration

Set up a subdomain (e.g., `data.your-municipality.gov`):
1. Configure DNS to point subdomain to your hosting
2. Set up SSL certificate
3. Update environment variables with new URL

## Customization Checklist

- [ ] Update municipality name in `.env`
- [ ] Replace logo/branding assets
- [ ] Customize color scheme (tailwind.config.js)
- [ ] Review and adjust categories list
- [ ] Set up contact email
- [ ] Configure domain/subdomain
- [ ] Set up SSL certificate
- [ ] Test file upload functionality
- [ ] Test metadata export
- [ ] Train staff on using the system

## Maintenance

### Regular Tasks

1. **Backup data**: The `uploads` folder contains all uploaded files
2. **Update dependencies**: Run `npm update` and `pip install --upgrade -r requirements.txt`
3. **Monitor logs**: Check for errors in backend/frontend logs
4. **Review metadata**: Ensure metadata quality and completeness

### Backup Strategy

```bash
# Backup uploads folder
tar -czf backup-$(date +%Y%m%d).tar.gz main/backend/uploads/

# Backup can be automated with cron job
```

## Support

For issues or questions:
- Check the API documentation at `/docs` endpoint
- Review error logs in browser console (F12) and backend logs
- Contact: [Your support email]

## Next Steps

1. Complete the setup checklist above
2. Upload initial datasets
3. Add metadata for each dataset
4. Share the portal with your community
5. Gather feedback and iterate

