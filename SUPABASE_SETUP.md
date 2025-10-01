# Supabase Database Setup for Talazo Agritech Booking System

## 📊 Database Schema

### 1. Create the `bookings` table in Supabase

Execute this SQL in your Supabase SQL Editor:

```sql
-- Create the bookings table
CREATE TABLE bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Contact Information
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,

    -- Farm Information
    farm_location TEXT NOT NULL,
    farm_size DECIMAL(10,2) NOT NULL, -- in hectares
    crop_names TEXT NOT NULL, -- comma-separated crop names
    farming_experience VARCHAR(20) NOT NULL CHECK (farming_experience IN ('beginner', 'intermediate', 'experienced')),

    -- Technical Information
    has_smartphone BOOLEAN NOT NULL DEFAULT false,
    preferred_language VARCHAR(20) NOT NULL DEFAULT 'english' CHECK (preferred_language IN ('english', 'shona', 'ndebele')),

    -- Marketing Information
    hear_about_us VARCHAR(50) NOT NULL CHECK (hear_about_us IN ('social_media', 'word_of_mouth', 'agricultural_extension', 'online_search', 'other')),
    additional_info TEXT,

    -- Booking Status
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),

    -- Admin Notes
    admin_notes TEXT,
    assigned_to VARCHAR(255),

    -- Notification Status
    user_email_sent BOOLEAN DEFAULT false,
    admin_email_sent BOOLEAN DEFAULT false,

    -- Metadata
    ip_address INET,
    user_agent TEXT
);

-- Create indexes for better performance
CREATE INDEX idx_bookings_email ON bookings(email);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_created_at ON bookings(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow anonymous users to insert bookings (for form submissions)
CREATE POLICY "Allow anonymous insert" ON bookings
    FOR INSERT TO anon
    WITH CHECK (true);

-- Allow authenticated users to view their own bookings
CREATE POLICY "Users can view own bookings" ON bookings
    FOR SELECT TO authenticated
    USING (auth.jwt() ->> 'email' = email);

-- Admin policy (you'll need to set up admin role later)
CREATE POLICY "Admin full access" ON bookings
    FOR ALL TO authenticated
    USING (auth.jwt() ->> 'role' = 'admin');
```

### 2. Create notification_logs table for tracking emails

```sql
-- Create notification logs table
CREATE TABLE notification_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL CHECK (notification_type IN ('user_confirmation', 'admin_notification')),
    recipient_email VARCHAR(255) NOT NULL,
    subject TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    error_message TEXT,

    -- Email service metadata
    email_service_id TEXT,
    sent_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX idx_notification_logs_booking_id ON notification_logs(booking_id);
CREATE INDEX idx_notification_logs_status ON notification_logs(status);
CREATE INDEX idx_notification_logs_created_at ON notification_logs(created_at DESC);

-- Enable RLS
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admin can view all notification logs" ON notification_logs
    FOR ALL TO authenticated
    USING (auth.jwt() ->> 'role' = 'admin');
```

## 📧 Email Service Setup

### Option 1: Resend (Recommended - Easy setup)

1. Sign up at [Resend.com](https://resend.com)
2. Get your API key
3. Verify your domain (or use their test domain initially)

### Option 2: SendGrid (Alternative)

1. Sign up at [SendGrid.com](https://sendgrid.com)
2. Get your API key
3. Set up sender verification

## 🔧 Environment Variables

Add these to your `.env.local` file:

```env
# Existing Supabase variables (keep these)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Email Service (choose one)
# Option 1: Resend
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com

# Option 2: SendGrid (alternative)
# SENDGRID_API_KEY=your_sendgrid_api_key
# FROM_EMAIL=noreply@yourdomain.com
# ADMIN_EMAIL=admin@yourdomain.com

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🚀 Next Steps

1. **Execute the SQL** in your Supabase dashboard
2. **Choose and set up** an email service (Resend recommended)
3. **Add environment variables** to your `.env.local`
4. **Install email dependencies** (will be done in next step)

This setup provides:

- ✅ Proper database schema with all necessary fields
- ✅ Row Level Security for data protection
- ✅ Email tracking and logging
- ✅ Admin capabilities for future dashboard
- ✅ Scalable structure for future enhancements
