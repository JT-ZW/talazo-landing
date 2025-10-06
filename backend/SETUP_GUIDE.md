# Talazo Intelligence Backend - Complete Setup Guide

🌱 **Production-ready FastAPI backend for drone imagery analysis and vegetation intelligence**

## 🎯 Overview

This intelligence layer backend integrates with your existing Next.js frontend to provide:

- **Advanced drone image processing** with OpenDroneMap
- **Vegetation health analysis** (NDVI, NDWI, EVI calculations)
- **Automated PDF report generation** with maps and recommendations
- **Weather data integration** for enhanced analysis context
- **Email notifications** for report delivery and alerts
- **Seamless database integration** with your existing Supabase setup

## 🚀 Complete Deployment Guide

### Step 1: Prerequisites Check

Ensure you have:

- ✅ **Docker & Docker Compose** (recommended path)
- ✅ **Python 3.11+** (for local development)
- ✅ **Existing Supabase project** with farmer data
- ✅ **Domain/hosting** for production deployment

### Step 2: Environment Configuration

1. **Copy environment template**:

   ```bash
   cp .env.example .env
   ```

2. **Configure your settings** in `.env`:

   ```env
   # Use the SAME Supabase credentials as your frontend
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_anon_key_from_frontend
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # Use the SAME JWT secret as your frontend
   JWT_SECRET_KEY=your_frontend_jwt_secret
   JWT_ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30

   # Email configuration
   RESEND_API_KEY=your_resend_api_key
   FROM_EMAIL=noreply@yourdomain.com
   ADMIN_EMAIL=admin@yourdomain.com

   # Weather API (optional but recommended)
   OPENWEATHER_API_KEY=your_openweather_api_key
   ```

### Step 3: Database Setup

1. **Open your Supabase dashboard** → SQL Editor
2. **Copy and execute** the entire contents of `database_schema.sql`
3. **Verify tables created**:
   - `reports` ✅
   - `image_uploads` ✅
   - `analysis_insights` ✅
   - `processing_jobs` ✅

### Step 4: Deploy the Backend

#### Option A: Docker Deployment (Recommended)

```bash
# Start all services
docker-compose up -d

# Check logs
docker-compose logs -f backend

# Verify health
curl http://localhost:8000/health
```

#### Option B: Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Step 5: Test the Integration

1. **Check API documentation**: http://localhost:8000/docs
2. **Test health endpoint**: http://localhost:8000/health
3. **Verify database connection** in the logs

## 🔌 Frontend Integration

### API Client Setup

Update your Next.js frontend to include backend endpoints:

```typescript
// lib/api-client.ts
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export const apiClient = {
  // Create new report
  async createReport(data: ReportData, token: string) {
    const response = await fetch(`${BACKEND_URL}/api/v1/reports`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Upload drone images
  async uploadImages(reportId: string, files: File[], token: string) {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const response = await fetch(
      `${BACKEND_URL}/api/v1/reports/${reportId}/images`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );
    return response.json();
  },

  // Start vegetation analysis
  async analyzeVegetation(reportId: string, token: string) {
    const response = await fetch(
      `${BACKEND_URL}/api/v1/reports/${reportId}/analyze`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.json();
  },

  // Get report PDF
  async getReportPDF(reportId: string, token: string) {
    const response = await fetch(
      `${BACKEND_URL}/api/v1/reports/${reportId}/pdf`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.blob();
  },
};
```

### Frontend Pages to Create

Create these new pages in your Next.js app:

1. **Admin Dashboard** (`/admin/dashboard`)
   - Overview of all reports
   - Processing status
   - System health metrics

2. **Report Management** (`/admin/reports`)
   - List all reports
   - Filter and search
   - Bulk actions

3. **Report Upload** (`/admin/reports/new`)
   - Create new report
   - Upload drone images
   - Set analysis parameters

4. **Report Viewer** (`/admin/reports/[id]`)
   - View analysis results
   - Download PDF report
   - Send to farmer

5. **Farmer Reports** (`/farmer/reports`)
   - Farmer's own reports
   - Download PDFs
   - View recommendations

## 📊 Key API Endpoints

### Report Management

```http
POST   /api/v1/reports                    # Create new report
GET    /api/v1/reports                    # List reports (with filters)
GET    /api/v1/reports/{report_id}        # Get report details
PATCH  /api/v1/reports/{report_id}        # Update report
DELETE /api/v1/reports/{report_id}        # Delete report

POST   /api/v1/reports/{report_id}/images # Upload drone images
POST   /api/v1/reports/{report_id}/analyze # Start vegetation analysis
GET    /api/v1/reports/{report_id}/pdf    # Generate PDF report
```

### Analysis

```http
POST   /api/v1/analysis/vegetation        # Run vegetation analysis
GET    /api/v1/analysis/{analysis_id}     # Get analysis results
GET    /api/v1/analysis/statistics        # Get analysis statistics
```

### Farmer Integration

```http
GET    /api/v1/farmers                    # List farmers
GET    /api/v1/farmers/{farmer_id}        # Get farmer details
GET    /api/v1/farmers/{farmer_id}/reports # Get farmer's reports
```

## 🔧 Production Deployment

### Environment Variables for Production

```env
# Production settings
ENVIRONMENT=production
DEBUG=false
LOG_LEVEL=info

# Security
ALLOWED_HOSTS=yourdomain.com,api.yourdomain.com
CORS_ORIGINS=https://yourdomain.com

# Database (use connection pooling in production)
DATABASE_POOL_SIZE=20
DATABASE_MAX_OVERFLOW=30

# File storage
MAX_UPLOAD_SIZE_MB=500
PROCESSING_TIMEOUT_SECONDS=1800

# Background processing
CELERY_BROKER_URL=redis://redis:6379/0
CELERY_RESULT_BACKEND=redis://redis:6379/0

# Monitoring
SENTRY_DSN=your_sentry_dsn
```

### Docker Production Setup

```yaml
# docker-compose.prod.yml
version: "3.8"
services:
  backend:
    build: .
    environment:
      - ENVIRONMENT=production
    ports:
      - "8000:8000"
    volumes:
      - ./uploads:/app/uploads
    depends_on:
      - redis
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    restart: unless-stopped

  celery-worker:
    build: .
    command: celery -A app.celery_app worker --loglevel=info
    environment:
      - ENVIRONMENT=production
    depends_on:
      - redis
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - backend
    restart: unless-stopped
```

### Health Monitoring

Monitor these endpoints:

- **Health Check**: `GET /health`
- **Detailed Status**: `GET /health/detailed`
- **Metrics**: `GET /metrics` (if enabled)

## 📋 Workflow Example

### Complete Analysis Workflow

1. **Admin creates report**:

   ```typescript
   const report = await apiClient.createReport(
     {
       farmer_id: farmerId,
       report_name: "Field Analysis Q4 2024",
       field_area_hectares: 25.5,
     },
     token
   );
   ```

2. **Upload drone images**:

   ```typescript
   const files = [
     /* selected files */
   ];
   await apiClient.uploadImages(report.id, files, token);
   ```

3. **Start analysis**:

   ```typescript
   const analysis = await apiClient.analyzeVegetation(report.id, token);
   ```

4. **Backend processes images automatically**:
   - Validates image quality
   - Generates orthomosaic
   - Calculates vegetation indices
   - Analyzes zones
   - Generates PDF report
   - Sends email to farmer

5. **Frontend shows results**:
   ```typescript
   const reportData = await apiClient.getReport(report.id, token);
   // Display NDVI maps, recommendations, statistics
   ```

## 🎨 Frontend Components to Add

### 1. Report Upload Component

```typescript
// components/ReportUpload.tsx
export const ReportUpload = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    setUploading(true);
    try {
      const report = await apiClient.createReport(reportData, token);
      await apiClient.uploadImages(report.id, files, token);
      await apiClient.analyzeVegetation(report.id, token);
      // Show success message
    } catch (error) {
      // Handle error
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <FileDropzone onFiles={setFiles} />
      <Button onClick={handleUpload} loading={uploading}>
        Upload and Analyze
      </Button>
    </div>
  );
};
```

### 2. Analysis Results Component

```typescript
// components/AnalysisResults.tsx
export const AnalysisResults = ({ reportId }: { reportId: string }) => {
  const { data: report } = useQuery(['report', reportId], () =>
    apiClient.getReport(reportId, token)
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <NDVIMap data={report?.ndvi_data} />
      <VegetationStats stats={report?.vegetation_stats} />
      <RecommendationsList recommendations={report?.recommendations} />
      <WeatherContext weather={report?.weather_data} />
    </div>
  );
};
```

## 🔒 Security Considerations

- **Authentication**: Uses same JWT tokens as frontend
- **Authorization**: Role-based access (farmer/admin/analyst)
- **File Upload**: Validates file types and sizes
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: All endpoints validate input data

## 📈 Monitoring & Maintenance

### Key Metrics to Monitor

- **Processing Times**: Image analysis duration
- **Success Rates**: Analysis completion rates
- **Storage Usage**: Uploaded files and generated reports
- **API Performance**: Response times and error rates
- **Background Jobs**: Queue length and worker health

### Regular Maintenance

- **Clean up old reports** (retention policy)
- **Monitor disk usage** (image files can be large)
- **Update dependencies** regularly
- **Backup database** and files
- **Review logs** for errors and performance

## 🆘 Troubleshooting

### Common Issues

**"Authentication failed"**:

- Verify JWT_SECRET_KEY matches frontend
- Check token expiration
- Ensure proper Authorization header

**"Image processing failed"**:

- Check GDAL installation in container
- Verify image file formats (TIFF, JPEG supported)
- Check processing timeout settings

**"Database connection error"**:

- Verify Supabase credentials
- Check network connectivity
- Review database permissions

**"Email delivery failed"**:

- Verify Resend API key
- Check FROM_EMAIL domain verification
- Review email template rendering

## 📞 Support

For issues or questions:

1. **Check the logs**: `docker-compose logs -f backend`
2. **Review health status**: Visit `/health` endpoint
3. **Test API endpoints**: Use `/docs` interactive documentation
4. **Verify environment**: Double-check `.env` configuration

---

**🎉 You're now ready to process drone imagery and provide intelligent agricultural insights to farmers!**

The backend will automatically:

- ✅ Process uploaded drone images
- ✅ Calculate vegetation health indices
- ✅ Generate comprehensive PDF reports
- ✅ Send email notifications to farmers
- ✅ Provide weather context for analysis
- ✅ Store all data in your existing database

This intelligence layer seamlessly extends your existing farmer booking system with powerful agricultural analytics capabilities.
