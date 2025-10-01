-- Sample farmers data for testing
INSERT INTO farmers (
    full_name,
    email,
    phone,
    farm_location,
    farm_size,
    crop_types,
    experience,
    has_smartphone,
    preferred_language,
    hear_about_us,
    additional_info,
    status
) VALUES
(
    'Tendai Mukamuri',
    'tendai.mukamuri@example.com',
    '+263771234567',
    'Mazowe, Mashonaland Central',
    15.5,
    ARRAY['maize', 'tobacco'],
    'experienced',
    true,
    'english',
    'agricultural_extension',
    'Very interested in drone technology for my tobacco farm',
    'active'
),
(
    'Grace Sithole',
    'grace.sithole@example.com',
    '+263772345678',
    'Kwekwe, Midlands',
    8.2,
    ARRAY['maize', 'soybeans'],
    'intermediate',
    true,
    'shona',
    'word_of_mouth',
    'Heard great things from my neighbor',
    'active'
),
(
    'John Ncube',
    'john.ncube@example.com',
    '+263773456789',
    'Bulawayo, Bulawayo',
    25.0,
    ARRAY['maize', 'cotton', 'sunflower'],
    'experienced',
    true,
    'ndebele',
    'social_media',
    'Saw your Facebook ad and very impressed',
    'active'
),
(
    'Mary Chivero',
    'mary.chivero@example.com',
    '+263774567890',
    'Chitungwiza, Harare',
    3.8,
    ARRAY['vegetables', 'maize'],
    'beginner',
    false,
    'shona',
    'online_search',
    'New to farming, need all the help I can get',
    'pending'
),
(
    'Peter Mandaza',
    'peter.mandaza@example.com',
    '+263775678901',
    'Mutare, Manicaland',
    12.3,
    ARRAY['tobacco', 'wheat'],
    'intermediate',
    true,
    'english',
    'agricultural_extension',
    'Extension officer recommended your services',
    'active'
);

-- Sample contact messages for testing
INSERT INTO contact_messages (
    name,
    email,
    phone,
    subject,
    message,
    status
) VALUES
(
    'Sarah Moyo',
    'sarah.moyo@example.com',
    '+263776789012',
    'Pricing for large farms',
    'Hello, I have a 100-hectare farm and would like to know about your enterprise pricing options. Can you provide more details?',
    'unread'
),
(
    'David Gumbo',
    'david.gumbo@example.com',
    null,
    'Technical question about drones',
    'I am curious about the technical specifications of your drones. What type of sensors do you use and how accurate are the readings?',
    'read'
),
(
    'Elizabeth Mujuru',
    'elizabeth.mujuru@example.com',
    '+263777890123',
    'Partnership opportunity',
    'I represent an agricultural cooperative with 50+ members. We would like to discuss potential partnership opportunities with Talazo.',
    'replied'
);