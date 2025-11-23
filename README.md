# Municipal Data Integration Platform

A sustainable, automated system for municipalities to manage, catalog, and publish their data. This platform provides an easy-to-use interface for uploading datasets, adding metadata, and making municipal data accessible to the public.

## 🚀 Quick Start

### Using Docker (Recommended)
```bash
# 1. Clone the repository
git clone <repository-url>
cd Landover-Hills-Data-Integration

# 2. Configure your municipality
cp .env.example .env
# Edit .env with your municipality information

# 3. Start the application
docker compose up -d

# 4. Access the application
# Frontend: http://localhost:8080
# Backend API: http://localhost:8000/docs
```

### Local Development
See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions.

## 📋 Features

- **File Management**: Upload and organize municipal datasets
- **Metadata Editor**: Comprehensive metadata entry with descriptions and examples
- **Category Management**: Organize datasets by category
- **Bulk Operations**: Select multiple files for category assignment or deletion
- **Export Functionality**: Download files and metadata as Excel spreadsheets
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Easy Integration**: Simple integration with existing municipal websites

## 📚 Documentation

- **[Setup Guide](./SETUP_GUIDE.md)**: Complete setup instructions
- **[Deployment Guide](./DEPLOYMENT.md)**: Production deployment options
- **[Integration Guide](./INTEGRATION.md)**: Website integration methods
- **[API Documentation](http://localhost:8000/docs)**: Interactive API docs (when running)

## 🏛️ For Municipalities

This platform is designed to be:
- **Easy to Deploy**: Docker-based deployment, works on any server
- **Easy to Customize**: Simple configuration files for branding and settings
- **Easy to Integrate**: Multiple integration options for your website
- **Easy to Use**: Intuitive interface for staff to manage data

## 🛠️ Technology Stack

- **Backend**: FastAPI (Python)
- **Frontend**: React + TypeScript + Tailwind CSS
- **Deployment**: Docker Compose
- **Data Format**: Excel/CSV support

## 📖 Getting Started

1. **Review the [Setup Guide](./SETUP_GUIDE.md)** for installation
2. **Configure your municipality** in the `.env` file
3. **Customize branding** (logo, colors, municipality name)
4. **Deploy** using one of the methods in [DEPLOYMENT.md](./DEPLOYMENT.md)
5. **Integrate** with your website using [INTEGRATION.md](./INTEGRATION.md)

## 🤝 Support

For questions or issues:
- Check the documentation files
- Review API documentation at `/docs` endpoint
- Contact your development team

## 📄 License

See [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

Developed as part of the iConsultancy program, creating a replicable "starter kit" for municipalities across Maryland and beyond.
