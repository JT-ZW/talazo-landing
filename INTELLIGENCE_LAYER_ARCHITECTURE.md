# Talazo Intelligence Layer Architecture

## 📁 PROJECT STRUCTURE

```
talazo/
├── frontend/                    # Existing Next.js application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ... (existing files)
│
├── backend/                     # New Python Intelligence Service
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py             # FastAPI application
│   │   ├── config.py           # Configuration settings
│   │   ├── database.py         # Database connections
│   │   ├── models/             # Data models
│   │   │   ├── __init__.py
│   │   │   ├── farmer.py
│   │   │   ├── report.py
│   │   │   └── analysis.py
│   │   ├── services/           # Business logic
│   │   │   ├── __init__.py
│   │   │   ├── image_processor.py
│   │   │   ├── vegetation_analysis.py
│   │   │   ├── report_generator.py
│   │   │   ├── storage_service.py
│   │   │   └── email_service.py
│   │   ├── api/                # API endpoints
│   │   │   ├── __init__.py
│   │   │   ├── dependencies.py
│   │   │   └── v1/
│   │   │       ├── __init__.py
│   │   │       ├── reports.py
│   │   │       ├── analysis.py
│   │   │       └── farmers.py
│   │   ├── core/               # Core utilities
│   │   │   ├── __init__.py
│   │   │   ├── security.py
│   │   │   ├── logging.py
│   │   │   └── exceptions.py
│   │   └── utils/              # Helper functions
│   │       ├── __init__.py
│   │       ├── file_utils.py
│   │       ├── geo_utils.py
│   │       └── validation.py
│   ├── tests/                  # Test suite
│   │   ├── __init__.py
│   │   ├── test_analysis.py
│   │   ├── test_reports.py
│   │   └── test_api.py
│   ├── requirements.txt        # Python dependencies
│   ├── Dockerfile             # Container configuration
│   ├── docker-compose.yml     # Local development
│   └── README.md              # Backend documentation
│
├── shared/                     # Shared configuration
│   ├── docker-compose.full.yml
│   ├── .env.shared
│   └── deployment/
│       ├── kubernetes/
│       └── docker/
│
└── docs/                       # Documentation
    ├── API_INTEGRATION.md
    ├── DEPLOYMENT_GUIDE.md
    └── SAMPLE_WORKFLOW.md
```

## 🔧 TECHNOLOGY STACK

### Backend (Python Intelligence Service)

- **Framework**: FastAPI (high performance, auto-documentation)
- **Image Processing**:
  - OpenDroneMap (ODM) for orthomosaic generation
  - Rasterio + NumPy for raster operations
  - GDAL for geospatial data handling
  - Pillow for image manipulation
- **Analysis Libraries**:
  - Scikit-image for advanced image processing
  - OpenCV for computer vision tasks
  - Matplotlib/Plotly for visualization
- **Database**: Supabase PostgreSQL (shared with frontend)
- **Storage**: Supabase Storage or AWS S3
- **Email**: Resend (existing) or SendGrid
- **PDF Generation**: ReportLab or WeasyPrint
- **Authentication**: JWT tokens (compatible with Supabase)

### Frontend Integration

- **API Client**: Axios or native fetch
- **Map Rendering**: Leaflet.js or Mapbox GL JS
- **File Upload**: React Dropzone
- **Dashboard**: New admin pages integrated with existing layout

## 🗄️ DATABASE SCHEMA EXTENSION

```sql
-- Reports table (main intelligence data)
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Report metadata
    report_name VARCHAR(255) NOT NULL,
    report_date DATE NOT NULL,
    field_area_hectares DECIMAL(10,2),

    -- Analysis results
    ndvi_score DECIMAL(5,4), -- -1 to 1
    ndwi_score DECIMAL(5,4), -- -1 to 1
    healthy_vegetation_percent DECIMAL(5,2),
    stressed_vegetation_percent DECIMAL(5,2),
    water_stress_percent DECIMAL(5,2),

    -- File storage URLs
    original_images_url TEXT[],
    orthomosaic_url TEXT,
    ndvi_map_url TEXT,
    ndwi_map_url TEXT,
    pdf_report_url TEXT,

    -- Processing status
    status VARCHAR(50) DEFAULT 'processing', -- processing, completed, failed
    processing_error TEXT,

    -- Additional metadata
    image_count INTEGER,
    processing_duration_seconds INTEGER,
    recommendations TEXT[]
);

-- Image uploads table (track individual drone images)
CREATE TABLE image_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Image metadata
    filename VARCHAR(255) NOT NULL,
    file_size_bytes BIGINT,
    file_type VARCHAR(50),
    upload_url TEXT NOT NULL,

    -- Geospatial data
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    altitude_meters DECIMAL(8,2),
    camera_settings JSONB,

    -- Processing flags
    is_processed BOOLEAN DEFAULT FALSE,
    processing_order INTEGER
);

-- Analysis insights table (detailed findings)
CREATE TABLE analysis_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Insight data
    insight_type VARCHAR(100) NOT NULL, -- health_assessment, water_stress, disease_detection
    severity_level VARCHAR(50), -- low, medium, high, critical
    affected_area_percent DECIMAL(5,2),

    -- Location data
    polygon_coordinates JSONB, -- GeoJSON polygon of affected area
    center_latitude DECIMAL(10,8),
    center_longitude DECIMAL(11,8),

    -- Recommendations
    recommended_action TEXT,
    priority_score INTEGER, -- 1-10
    estimated_yield_impact DECIMAL(5,2)
);

-- Processing jobs table (track background tasks)
CREATE TABLE processing_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,

    -- Job details
    job_type VARCHAR(100) NOT NULL, -- image_upload, orthomosaic, analysis, report_generation
    status VARCHAR(50) DEFAULT 'queued', -- queued, running, completed, failed
    progress_percent INTEGER DEFAULT 0,

    -- Error handling
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,

    -- Performance metrics
    cpu_usage_percent DECIMAL(5,2),
    memory_usage_mb INTEGER,
    processing_time_seconds INTEGER
);

-- Create indexes for performance
CREATE INDEX idx_reports_farmer_id ON reports(farmer_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_date ON reports(report_date DESC);
CREATE INDEX idx_image_uploads_report_id ON image_uploads(report_id);
CREATE INDEX idx_analysis_insights_report_id ON analysis_insights(report_id);
CREATE INDEX idx_processing_jobs_status ON processing_jobs(status);
CREATE INDEX idx_processing_jobs_report_id ON processing_jobs(report_id);
```

## 🚀 DEVELOPMENT PHASES

### Phase 1: Backend Foundation (Days 1-3)

1. Set up FastAPI application structure
2. Configure database connections and models
3. Implement basic file upload endpoints
4. Set up Docker development environment

### Phase 2: Image Processing Core (Days 4-7)

1. Integrate OpenDroneMap for orthomosaic generation
2. Implement NDVI/NDWI calculation algorithms
3. Generate heatmap visualizations
4. Create cloud storage integration

### Phase 3: Analysis & Reporting (Days 8-10)

1. Build vegetation analysis algorithms
2. Implement PDF report generation
3. Create insight extraction logic
4. Set up automated email delivery

### Phase 4: Frontend Integration (Days 11-13)

1. Create admin dashboard pages
2. Implement map visualization components
3. Build report upload interface
4. Add farmer notification system

### Phase 5: Testing & Deployment (Days 14-15)

1. Comprehensive testing suite
2. Performance optimization
3. Production deployment setup
4. Documentation completion

## 🔌 API ENDPOINTS OVERVIEW

```
POST /api/v1/reports/upload          # Upload drone images
GET  /api/v1/reports/{farmer_id}     # Get farmer's reports
GET  /api/v1/reports/{report_id}     # Get specific report
POST /api/v1/analysis/start          # Start processing job
GET  /api/v1/analysis/status/{job_id} # Check processing status
GET  /api/v1/maps/{report_id}/ndvi   # Get NDVI visualization
GET  /api/v1/maps/{report_id}/ndwi   # Get NDWI visualization
POST /api/v1/reports/{report_id}/email # Send report to farmer
```

## 🎯 INTEGRATION POINTS

1. **Existing Farmer Registration**: Reports link to existing farmers table
2. **Email System**: Extends current Resend implementation
3. **Admin Dashboard**: New pages in existing admin structure
4. **Database**: Adds tables to current Supabase instance
5. **Authentication**: Uses existing authentication system

This architecture ensures your intelligence layer scales independently while seamlessly integrating with your existing Next.js frontend!
