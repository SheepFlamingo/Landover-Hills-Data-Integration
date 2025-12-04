# Frontend - Municipal Data Integration Portal

React frontend for the Municipal Data Integration Portal.

## Setup

```bash
npm install
echo "REACT_APP_API_URL=http://localhost:8000" > .env
npm start
```

## Configuration

### API URL

The frontend connects to the backend via the `REACT_APP_API_URL` environment variable.

**Local Development:**
```
REACT_APP_API_URL=http://localhost:8000
```

**Production:**
Set to your deployed backend URL, or use the default production URL.

### Files Using API Configuration

- `src/App.tsx` - Main inventory page
- `src/MetadataDetails.tsx` - Metadata editor page

Both use:
```typescript
const API = process.env.REACT_APP_API_URL || "https://landover-hills-data-integration-api.onrender.com";
```

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Project Structure

- `src/App.tsx` - Main inventory dashboard with file upload, filtering, and bulk operations
- `src/MetadataDetails.tsx` - Detailed metadata editor for individual files
- `src/constants/categories.ts` - Shared category definitions
- `.env` - Environment configuration (create this file)
