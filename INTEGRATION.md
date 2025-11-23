# Website Integration Guide

This guide explains how to integrate the Municipal Data Integration portal with your existing municipal website.

## Integration Methods

### Method 1: Direct Link (Simplest)

Add a prominent link on your municipal website's navigation or homepage:

```html
<a href="https://data.your-municipality.gov" 
   target="_blank" 
   class="data-portal-link">
  📊 Open Data Portal
</a>
```

**CSS Styling Example:**
```css
.data-portal-link {
  display: inline-block;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: transform 0.2s;
}

.data-portal-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
```

### Method 2: Embedded iframe

Embed the portal directly in a page on your website:

```html
<div class="data-portal-container">
  <h2>Municipal Data Portal</h2>
  <iframe 
    src="https://data.your-municipality.gov" 
    width="100%" 
    height="900px"
    frameborder="0"
    style="border: 1px solid #e0e0e0; border-radius: 8px;"
    title="Municipal Data Integration Portal">
  </iframe>
</div>
```

**Responsive iframe (mobile-friendly):**
```html
<div class="data-portal-wrapper" style="position: relative; padding-bottom: 100%; height: 0; overflow: hidden;">
  <iframe 
    src="https://data.your-municipality.gov" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
    title="Municipal Data Integration Portal">
  </iframe>
</div>
```

### Method 3: Subdomain Integration

Set up a subdomain that matches your main website:

1. **DNS Configuration:**
   - Add CNAME record: `data.your-municipality.gov` → your hosting provider
   
2. **SSL Certificate:**
   - Use Let's Encrypt for free SSL
   - Ensures secure HTTPS connection

3. **Styling Consistency:**
   - Match colors and fonts with main website
   - Use same navigation structure

### Method 4: API Integration

If you want to display data on your website using the API:

```javascript
// Fetch inventory data
fetch('https://api.your-municipality.gov/inventory')
  .then(response => response.json())
  .then(data => {
    // Display data on your website
    displayDatasets(data);
  });

function displayDatasets(datasets) {
  const container = document.getElementById('datasets-list');
  datasets.forEach(dataset => {
    const item = document.createElement('div');
    item.innerHTML = `
      <h3>${dataset.dataset_title || dataset.file_name}</h3>
      <p>${dataset.description || 'No description available'}</p>
      <a href="https://data.your-municipality.gov/details/${encodeURIComponent(dataset.file_name)}">
        View Details
      </a>
    `;
    container.appendChild(item);
  });
}
```

## WordPress Integration

### Using a Custom HTML Block

1. Go to your WordPress page editor
2. Add a "Custom HTML" block
3. Paste the iframe code from Method 2
4. Publish

### Using a Plugin

Install an iframe plugin like "Advanced iFrame" for better control:
- Responsive sizing
- Security options
- Loading indicators

## Drupal Integration

### Using a Block

1. Structure → Blocks → Add custom block
2. Choose "Custom HTML" format
3. Add iframe code
4. Place in desired region

## Squarespace/Wix/Other Platforms

Most website builders support:
- HTML/CSS blocks
- Embed blocks
- Custom code sections

Use Method 1 (direct link) or Method 2 (iframe) depending on your platform's capabilities.

## Branding Consistency

### Matching Your Website's Design

1. **Update Colors:**
   Edit `main/frontend/tailwind.config.js`:
   ```javascript
   theme: {
     extend: {
       colors: {
         primary: '#YOUR_COLOR',
         secondary: '#YOUR_COLOR',
       }
     }
   }
   ```

2. **Update Logo:**
   - Replace `main/frontend/public/maryland-flag.svg`
   - Recommended size: 200x200px
   - Format: SVG or PNG with transparent background

3. **Update Title:**
   Edit `main/frontend/public/index.html`:
   ```html
   <title>Your Municipality - Data Portal</title>
   ```

## SEO Considerations

### Add Meta Tags

In your main website's page that links to the portal:

```html
<meta name="description" content="Access open data from Your Municipality including budgets, public safety data, and more.">
<meta property="og:title" content="Your Municipality - Open Data Portal">
<meta property="og:description" content="Explore municipal datasets and information">
<meta property="og:image" content="https://your-municipality.gov/images/data-portal-preview.jpg">
```

### Sitemap

Add the data portal URL to your website's sitemap:
```xml
<url>
  <loc>https://data.your-municipality.gov</loc>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>
```

## Analytics Integration

### Google Analytics

Add to your data portal's `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## Accessibility

Ensure your integration is accessible:
- Use descriptive link text (not just "Click here")
- Provide alt text for images
- Ensure keyboard navigation works
- Test with screen readers

## Example Integration Code

### Complete HTML Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Municipality - Data Portal</title>
  <style>
    .data-portal-section {
      padding: 40px 20px;
      background: #f5f5f5;
      text-align: center;
    }
    .data-portal-link {
      display: inline-block;
      margin-top: 20px;
      padding: 15px 30px;
      background: #4a90e2;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      font-size: 18px;
    }
  </style>
</head>
<body>
  <section class="data-portal-section">
    <h2>Municipal Open Data Portal</h2>
    <p>Explore datasets, budgets, and public information from Your Municipality.</p>
    <a href="https://data.your-municipality.gov" 
       class="data-portal-link"
       target="_blank">
      Visit Data Portal →
    </a>
  </section>
</body>
</html>
```

## Support

For integration assistance, contact your development team or refer to the main documentation.

