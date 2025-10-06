-- Talazo Intelligence Backend Database Schema
-- This extends the existing frontend database with intelligence layer tables

-- Note: This assumes the existing farmers table and other frontend tables are already present
-- Run this script to add the intelligence layer tables

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- INTELLIGENCE LAYER TABLES
-- ==========================================

-- Reports table (main intelligence data)
CREATE TABLE IF NOT EXISTS reports (
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
CREATE TABLE IF NOT EXISTS image_uploads (
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
CREATE TABLE IF NOT EXISTS analysis_insights (
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
CREATE TABLE IF NOT EXISTS processing_jobs (
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

-- ==========================================
-- INDEXES FOR PERFORMANCE
-- ==========================================

-- Reports indexes
CREATE INDEX IF NOT EXISTS idx_reports_farmer_id ON reports(farmer_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_date ON reports(report_date DESC);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);

-- Image uploads indexes
CREATE INDEX IF NOT EXISTS idx_image_uploads_report_id ON image_uploads(report_id);
CREATE INDEX IF NOT EXISTS idx_image_uploads_processed ON image_uploads(is_processed);
CREATE INDEX IF NOT EXISTS idx_image_uploads_order ON image_uploads(report_id, processing_order);

-- Analysis insights indexes
CREATE INDEX IF NOT EXISTS idx_analysis_insights_report_id ON analysis_insights(report_id);
CREATE INDEX IF NOT EXISTS idx_analysis_insights_type ON analysis_insights(insight_type);
CREATE INDEX IF NOT EXISTS idx_analysis_insights_severity ON analysis_insights(severity_level);

-- Processing jobs indexes
CREATE INDEX IF NOT EXISTS idx_processing_jobs_status ON processing_jobs(status);
CREATE INDEX IF NOT EXISTS idx_processing_jobs_report_id ON processing_jobs(report_id);
CREATE INDEX IF NOT EXISTS idx_processing_jobs_type ON processing_jobs(job_type);
CREATE INDEX IF NOT EXISTS idx_processing_jobs_created_at ON processing_jobs(created_at DESC);

-- ==========================================
-- FUNCTIONS AND TRIGGERS
-- ==========================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for reports table
DROP TRIGGER IF EXISTS update_reports_updated_at ON reports;
CREATE TRIGGER update_reports_updated_at
    BEFORE UPDATE ON reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE processing_jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reports
CREATE POLICY "Users can view reports for their farmers" ON reports
    FOR SELECT USING (true); -- Adjust based on your auth system

CREATE POLICY "Users can insert reports" ON reports
    FOR INSERT WITH CHECK (true); -- Adjust based on your auth system

CREATE POLICY "Users can update reports" ON reports
    FOR UPDATE USING (true); -- Adjust based on your auth system

-- RLS Policies for image_uploads
CREATE POLICY "Users can view image uploads for their reports" ON image_uploads
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM reports 
            WHERE reports.id = image_uploads.report_id
        )
    );

CREATE POLICY "Users can insert image uploads" ON image_uploads
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM reports 
            WHERE reports.id = image_uploads.report_id
        )
    );

-- RLS Policies for analysis_insights
CREATE POLICY "Users can view analysis insights for their reports" ON analysis_insights
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM reports 
            WHERE reports.id = analysis_insights.report_id
        )
    );

CREATE POLICY "Users can insert analysis insights" ON analysis_insights
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM reports 
            WHERE reports.id = analysis_insights.report_id
        )
    );

-- RLS Policies for processing_jobs
CREATE POLICY "Users can view processing jobs for their reports" ON processing_jobs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM reports 
            WHERE reports.id = processing_jobs.report_id
        )
    );

CREATE POLICY "Users can insert processing jobs" ON processing_jobs
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM reports 
            WHERE reports.id = processing_jobs.report_id
        )
    );

-- ==========================================
-- VIEWS FOR COMMON QUERIES
-- ==========================================

-- View for report summaries with farmer information
CREATE OR REPLACE VIEW report_summaries AS
SELECT 
    r.id,
    r.farmer_id,
    f.full_name as farmer_name,
    f.email as farmer_email,
    f.farm_location,
    r.report_name,
    r.report_date,
    r.field_area_hectares,
    r.status,
    r.ndvi_score,
    r.ndwi_score,
    r.healthy_vegetation_percent,
    r.stressed_vegetation_percent,
    r.water_stress_percent,
    r.image_count,
    r.processing_duration_seconds,
    r.created_at,
    r.updated_at
FROM reports r
JOIN farmers f ON r.farmer_id = f.id;

-- View for processing job status
CREATE OR REPLACE VIEW processing_status AS
SELECT 
    pj.id as job_id,
    pj.report_id,
    r.report_name,
    f.full_name as farmer_name,
    pj.job_type,
    pj.status,
    pj.progress_percent,
    pj.created_at as job_created_at,
    pj.started_at,
    pj.completed_at,
    pj.error_message,
    pj.retry_count
FROM processing_jobs pj
JOIN reports r ON pj.report_id = r.id
JOIN farmers f ON r.farmer_id = f.id;

-- ==========================================
-- SAMPLE DATA (for development/testing)
-- ==========================================

-- Uncomment the following to insert sample data for testing
/*
-- Sample report (adjust farmer_id to match existing farmer)
INSERT INTO reports (
    farmer_id, 
    report_name, 
    report_date, 
    field_area_hectares,
    status,
    ndvi_score,
    healthy_vegetation_percent,
    stressed_vegetation_percent
) VALUES (
    (SELECT id FROM farmers LIMIT 1), -- Use first farmer
    'Sample Vegetation Analysis',
    CURRENT_DATE - INTERVAL '7 days',
    12.5,
    'completed',
    0.65,
    78.5,
    21.5
) ON CONFLICT DO NOTHING;
*/

-- ==========================================
-- GRANTS AND PERMISSIONS
-- ==========================================

-- Grant permissions for the backend service user
-- Adjust these based on your specific user setup

-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO backend_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO backend_user;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO backend_user;

COMMENT ON TABLE reports IS 'Main table storing vegetation analysis reports and results';
COMMENT ON TABLE image_uploads IS 'Individual drone images uploaded for processing';
COMMENT ON TABLE analysis_insights IS 'Detailed insights and findings from vegetation analysis';
COMMENT ON TABLE processing_jobs IS 'Background processing jobs and their status';

COMMENT ON COLUMN reports.ndvi_score IS 'Normalized Difference Vegetation Index (-1 to 1)';
COMMENT ON COLUMN reports.ndwi_score IS 'Normalized Difference Water Index (-1 to 1)';
COMMENT ON COLUMN reports.recommendations IS 'Array of actionable recommendations for the farmer';

-- Final success message
DO $$
BEGIN
    RAISE NOTICE 'Talazo Intelligence Layer database schema created successfully!';
    RAISE NOTICE 'Tables created: reports, image_uploads, analysis_insights, processing_jobs';
    RAISE NOTICE 'Indexes, triggers, and RLS policies have been configured.';
    RAISE NOTICE 'Views created: report_summaries, processing_status';
END $$;