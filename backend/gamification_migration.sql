-- Run this in your Supabase SQL Editor to add gamification, profile, and settings features

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS notifications_enabled BOOLEAN DEFAULT false;

-- If you get a schema cache error after running this, run:
NOTIFY pgrst, 'reload schema';

-- The achievements table should already exist based on your schema:
-- CREATE TABLE achievements (
--     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--     user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
--     title TEXT NOT NULL,
--     description TEXT,
--     date_earned TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
-- );
