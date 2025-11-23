# Municipality Onboarding Guide

Welcome! This guide will help you get your Municipal Data Integration platform up and running quickly.

## Step 1: Initial Setup (15 minutes)

### Option A: Automated Setup (Easiest)
```bash
./setup.sh
```
The script will guide you through the setup process.

### Option B: Manual Setup
1. Copy configuration template:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your information:
   ```bash
   MUNICIPALITY_NAME=Town of Your Municipality
   MUNICIPALITY_WEBSITE=https://your-municipality.gov
   CONTACT_EMAIL=dataservices@your-municipality.gov
   ```

3. Start with Docker:
   ```bash
   docker compose up -d
   ```

## Step 2: Customization (30 minutes)

### Branding
1. **Replace Logo:**
   - File: `main/frontend/public/maryland-flag.svg`
   - Recommended: SVG format, 200x200px
   - Keep filename as `maryland-flag.svg` or update references

2. **Update Colors:**
   - File: `main/frontend/tailwind.config.js`
   - Find the `colors` section and update with your municipality's colors

3. **Update Title:**
   - File: `main/frontend/public/index.html`
   - Change `<title>` tag to your municipality name

### Categories
- File: `main/frontend/src/constants/categories.ts`
- Add, remove, or modify categories to match your needs
- Categories are sorted automatically

## Step 3: Testing (15 minutes)

1. **Access the application:**
   - Frontend: http://localhost:8080 (Docker) or http://localhost:3000 (local)
   - Backend API: http://localhost:8000/docs

2. **Test core functionality:**
   - [ ] Upload a test file
   - [ ] Add metadata to the file
   - [ ] Assign a category
   - [ ] Download the file
   - [ ] Download metadata
   - [ ] Delete a file (if needed)

3. **Verify municipality name:**
   - On first launch, you'll be prompted to enter municipality name
   - This is stored in browser localStorage

## Step 4: Deployment (1-2 hours)

Choose your deployment method:

### Cloud Hosting (Recommended)
- **Backend**: Render.com, Railway, or Heroku
- **Frontend**: Vercel or Netlify
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions

### Self-Hosted
- Use Docker on your own server
- Set up reverse proxy (nginx)
- Configure SSL certificate

### Municipal Server
- Follow Docker deployment
- Configure firewall rules
- Set up domain/subdomain

## Step 5: Website Integration (30 minutes)

Choose integration method:

1. **Direct Link** (Simplest)
   - Add link to your website navigation
   - See [INTEGRATION.md](./INTEGRATION.md) for code examples

2. **iframe Embed**
   - Embed portal in a page on your website
   - Good for seamless integration

3. **Subdomain**
   - Set up `data.your-municipality.gov`
   - Most professional option

## Step 6: Training Staff (1 hour)

### Key Features to Demonstrate:
1. **Uploading Files**
   - Show file upload process
   - Explain file naming conventions (if any)

2. **Adding Metadata**
   - Walk through metadata editor
   - Explain each field using the descriptions
   - Show examples

3. **Category Management**
   - How to assign categories
   - Bulk category assignment

4. **Exporting Data**
   - How to download files
   - How to download metadata
   - When to use each option

### Best Practices:
- Always add complete metadata
- Use consistent category assignments
- Keep file names descriptive
- Review metadata before publishing

## Step 7: Go Live Checklist

- [ ] All customization complete
- [ ] Staff trained
- [ ] Test data uploaded and verified
- [ ] Production deployment complete
- [ ] Website integration complete
- [ ] SSL certificate installed (HTTPS)
- [ ] Backup strategy in place
- [ ] Monitoring set up
- [ ] Documentation shared with staff

## Ongoing Maintenance

### Weekly
- Review new uploads
- Verify metadata quality
- Check for any errors

### Monthly
- Backup data
- Review and update categories if needed
- Check system performance

### Quarterly
- Update dependencies
- Review and improve metadata
- Gather user feedback

## Getting Help

- **Documentation**: Check the guides in this repository
- **API Documentation**: Available at `/docs` endpoint when running
- **Browser Console**: Press F12 for frontend debugging
- **Backend Logs**: Check Docker logs or terminal output

## Next Steps

1. Complete the setup steps above
2. Upload your initial datasets
3. Add comprehensive metadata
4. Share with your community
5. Gather feedback and iterate

## Success Metrics

Track these to measure success:
- Number of datasets published
- Metadata completeness rate
- User downloads/access
- Staff adoption rate
- Community engagement

Good luck with your data portal! 🎉

