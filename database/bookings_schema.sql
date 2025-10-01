-- Talazo Agritech Booking System Database Schema
-- Execute this in your Supabase SQL Editor

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    farm_location VARCHAR(255) NOT NULL,
    farm_size VARCHAR(50) NOT NULL,
    crop_types TEXT NOT NULL,
    farming_experience VARCHAR(100) NOT NULL,
    current_challenges TEXT NOT NULL,
    preferred_date VARCHAR(50) NOT NULL,
    additional_notes TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    admin_notes TEXT,
    assigned_to VARCHAR(255),
    user_email_sent BOOLEAN DEFAULT false,
    admin_email_sent BOOLEAN DEFAULT false,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_email ON public.bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at);
CREATE INDEX IF NOT EXISTS idx_bookings_farm_location ON public.bookings(farm_location);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Policy for service role (full access for API)
CREATE POLICY "Service role can do everything" ON public.bookings
    FOR ALL USING (auth.role() = 'service_role');

-- Policy for authenticated admin users (you can modify this based on your auth setup)
CREATE POLICY "Admin users can view all bookings" ON public.bookings
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policy for authenticated admin users to update
CREATE POLICY "Admin users can update bookings" ON public.bookings
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Insert sample data (optional - remove if not needed)
INSERT INTO public.bookings (
    first_name, 
    last_name, 
    email, 
    phone, 
    farm_location, 
    farm_size, 
    crop_types, 
    farming_experience, 
    current_challenges, 
    preferred_date,
    additional_notes
) VALUES (
    'John',
    'Mukamuri',
    'john.mukamuri@example.com',
    '+263771234567',
    'Harare, Zimbabwe',
    '10-50 hectares',
    'Maize, Tobacco, Soybeans',
    'Experienced (10+ years)',
    'Pest control and irrigation optimization',
    '2024-10-15',
    'Looking to improve crop yields and reduce pesticide usage'
) ON CONFLICT DO NOTHING;

-- Create a view for admin dashboard (optional)
CREATE OR REPLACE VIEW public.bookings_summary AS
SELECT 
    id,
    first_name || ' ' || last_name as full_name,
    email,
    phone,
    farm_location,
    farm_size,
    crop_types,
    status,
    created_at,
    preferred_date
FROM public.bookings
ORDER BY created_at DESC;

-- Grant permissions
GRANT ALL ON public.bookings TO service_role;
GRANT SELECT ON public.bookings_summary TO service_role;
GRANT SELECT, UPDATE ON public.bookings TO authenticated;
GRANT SELECT ON public.bookings_summary TO authenticated;