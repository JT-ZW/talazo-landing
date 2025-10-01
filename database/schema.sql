-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums
CREATE TYPE farmer_experience AS ENUM ('beginner', 'intermediate', 'experienced');
CREATE TYPE preferred_language AS ENUM ('english', 'shona', 'ndebele');
CREATE TYPE hear_about_source AS ENUM ('social_media', 'word_of_mouth', 'agricultural_extension', 'online_search', 'other');
CREATE TYPE farmer_status AS ENUM ('active', 'inactive', 'pending');
CREATE TYPE message_status AS ENUM ('unread', 'read', 'replied');

-- Farmers table
CREATE TABLE farmers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    farm_location VARCHAR(100) NOT NULL,
    farm_size DECIMAL(8,2) NOT NULL CHECK (farm_size > 0),
    crop_types TEXT[] NOT NULL,
    experience farmer_experience NOT NULL,
    has_smartphone BOOLEAN NOT NULL DEFAULT true,
    preferred_language preferred_language NOT NULL,
    hear_about_us hear_about_source NOT NULL,
    additional_info TEXT,
    status farmer_status NOT NULL DEFAULT 'pending'
);

-- Contact messages table
CREATE TABLE contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    status message_status NOT NULL DEFAULT 'unread'
);

-- Create indexes for better performance
CREATE INDEX idx_farmers_email ON farmers(email);
CREATE INDEX idx_farmers_phone ON farmers(phone);
CREATE INDEX idx_farmers_status ON farmers(status);
CREATE INDEX idx_farmers_created_at ON farmers(created_at);

CREATE INDEX idx_contact_messages_status ON contact_messages(status);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_farmers_updated_at 
    BEFORE UPDATE ON farmers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add row level security policies
ALTER TABLE farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow public to insert new farmers and contact messages
CREATE POLICY "Allow public to insert farmers" ON farmers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public to insert contact messages" ON contact_messages FOR INSERT WITH CHECK (true);

-- Only authenticated users can read farmers and contact messages (for admin purposes)
CREATE POLICY "Only authenticated users can read farmers" ON farmers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Only authenticated users can read contact messages" ON contact_messages FOR SELECT USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT INSERT ON farmers TO anon;
GRANT INSERT ON contact_messages TO anon;