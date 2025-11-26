-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Photos table
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  photo_url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  status TEXT DEFAULT 'public' CHECK (status IN ('public', 'hidden')),
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_ratings INTEGER DEFAULT 0,
  rating_sum INTEGER DEFAULT 0,
  rating_average FLOAT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ratings table
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  photo_id UUID NOT NULL REFERENCES photos(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating_value INTEGER NOT NULL CHECK (rating_value >= 1 AND rating_value <= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(photo_id, user_id)
);

-- Admin roles table
CREATE TABLE admin_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create indexes for better performance
CREATE INDEX idx_photos_status ON photos(status);
CREATE INDEX idx_photos_rating_average ON photos(rating_average DESC);
CREATE INDEX idx_photos_total_ratings ON photos(total_ratings DESC);
CREATE INDEX idx_ratings_photo_id ON ratings(photo_id);
CREATE INDEX idx_ratings_user_id ON ratings(user_id);
CREATE INDEX idx_admin_roles_user_id ON admin_roles(user_id);

-- Enable Row Level Security
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

-- Photos policies
CREATE POLICY "Public photos are viewable by everyone"
  ON photos FOR SELECT
  USING (status = 'public');

CREATE POLICY "Admins can insert photos"
  ON photos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
      AND admin_roles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update photos"
  ON photos FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
      AND admin_roles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete photos"
  ON photos FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
      AND admin_roles.role = 'admin'
    )
  );

-- Ratings policies
CREATE POLICY "Users can view all ratings"
  ON ratings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert their own ratings"
  ON ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admin roles policies
CREATE POLICY "Users can check their own admin status"
  ON admin_roles FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all admin roles"
  ON admin_roles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles ar
      WHERE ar.user_id = auth.uid()
      AND ar.role = 'admin'
    )
  );

-- Function to update photo rating stats
CREATE OR REPLACE FUNCTION update_photo_rating_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE photos
  SET 
    total_ratings = (SELECT COUNT(*) FROM ratings WHERE photo_id = NEW.photo_id),
    rating_sum = (SELECT SUM(rating_value) FROM ratings WHERE photo_id = NEW.photo_id),
    rating_average = (SELECT AVG(rating_value)::FLOAT FROM ratings WHERE photo_id = NEW.photo_id)
  WHERE id = NEW.photo_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update stats after rating insert
CREATE TRIGGER update_rating_stats_trigger
AFTER INSERT ON ratings
FOR EACH ROW
EXECUTE FUNCTION update_photo_rating_stats();

-- ============================================
-- ADMIN USER SETUP (DO THIS AFTER RUNNING SQL)
-- ============================================
-- 1. Go to Authentication > Users in Supabase Dashboard
-- 2. Click "Add user" > "Create new user"
-- 3. Enter:
--    Email: yoastech5@gmail.com
--    Password: 1q2w3e4r
--    Check "Auto Confirm User"
-- 4. Copy the User UUID from the users list
-- 5. Run this SQL (replace YOUR_USER_UUID with actual UUID):
--    INSERT INTO admin_roles (user_id, role) VALUES ('YOUR_USER_UUID', 'admin');
-- ============================================

-- Storage bucket for photos (run this in Supabase Dashboard > Storage)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('photos', 'photos', true);

-- Storage policies (run after creating bucket)
-- CREATE POLICY "Public photos are publicly accessible"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'photos');

-- CREATE POLICY "Admins can upload photos"
--   ON storage.objects FOR INSERT
--   WITH CHECK (
--     bucket_id = 'photos' AND
--     EXISTS (
--       SELECT 1 FROM admin_roles
--       WHERE admin_roles.user_id = auth.uid()
--       AND admin_roles.role = 'admin'
--     )
--   );

-- CREATE POLICY "Admins can delete photos"
--   ON storage.objects FOR DELETE
--   USING (
--     bucket_id = 'photos' AND
--     EXISTS (
--       SELECT 1 FROM admin_roles
--       WHERE admin_roles.user_id = auth.uid()
--       AND admin_roles.role = 'admin'
--     )
--   );
