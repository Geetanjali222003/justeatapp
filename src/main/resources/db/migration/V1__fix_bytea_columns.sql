-- ============================================
-- FIX BYTEA COLUMNS TO TEXT
-- ============================================
-- This script converts bytea columns to TEXT type to fix:
-- "function lower(bytea) does not exist" error
--
-- Run this script manually in PostgreSQL or via Flyway

-- Fix restaurants table
ALTER TABLE restaurants
ALTER COLUMN name TYPE TEXT USING name::TEXT,
ALTER COLUMN description TYPE TEXT USING description::TEXT,
ALTER COLUMN location TYPE TEXT USING location::TEXT,
ALTER COLUMN address TYPE TEXT USING address::TEXT,
ALTER COLUMN city TYPE TEXT USING city::TEXT,
ALTER COLUMN cuisine TYPE TEXT USING cuisine::TEXT,
ALTER COLUMN phone_number TYPE TEXT USING phone_number::TEXT;

-- Fix foods table
ALTER TABLE foods
ALTER COLUMN name TYPE TEXT USING name::TEXT,
ALTER COLUMN description TYPE TEXT USING description::TEXT,
ALTER COLUMN cuisine TYPE TEXT USING cuisine::TEXT,
ALTER COLUMN category TYPE TEXT USING category::TEXT;

-- Verify the changes
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'restaurants'
AND column_name IN ('name', 'description', 'location', 'address', 'city', 'cuisine', 'phone_number');

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'foods'
AND column_name IN ('name', 'description', 'cuisine', 'category');

