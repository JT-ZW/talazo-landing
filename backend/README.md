# Talazo Intelligence Backend

FastAPI-based backend service for drone imagery processing, vegetation analysis, and automated reporting.

## Features

- **Image Processing**: OpenDroneMap integration for orthomosaic generation
- **Vegetation Analysis**: NDVI/NDWI calculations with heatmap generation
- **Report Generation**: Automated PDF reports with insights and recommendations
- **Cloud Integration**: Supabase database and storage integration
- **Email Delivery**: Automated report delivery to farmers
- **Scalable Architecture**: Modular design for easy scaling and maintenance

## Quick Start

1. **Install Dependencies**:

```bash
pip install -r requirements.txt
```

2. **Set Environment Variables**:

```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Run Development Server**:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

4. **Access API Documentation**:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

- `POST /api/v1/reports/upload` - Upload drone images for processing
- `GET /api/v1/reports/{farmer_id}` - Get farmer's report history
- `GET /api/v1/reports/{report_id}` - Get specific report details
- `POST /api/v1/analysis/start` - Start image processing job
- `GET /api/v1/analysis/status/{job_id}` - Check processing status
- `GET /api/v1/maps/{report_id}/ndvi` - Get NDVI visualization
- `GET /api/v1/maps/{report_id}/ndwi` - Get NDWI visualization

## Architecture

The backend is organized into several key modules:

- **API Layer** (`app/api/`): FastAPI routes and request handling
- **Services** (`app/services/`): Business logic and processing
- **Models** (`app/models/`): Data models and schemas
- **Core** (`app/core/`): Configuration, security, and utilities
- **Utils** (`app/utils/`): Helper functions and utilities

## Development

- **Testing**: `pytest tests/`
- **Linting**: `flake8 app/`
- **Type Checking**: `mypy app/`
- **Documentation**: Auto-generated from code annotations

## Deployment

- **Docker**: `docker build -t talazo-backend .`
- **Docker Compose**: `docker-compose up -d`
- **Production**: See deployment guide in `/docs`
