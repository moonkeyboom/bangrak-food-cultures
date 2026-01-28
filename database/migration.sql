-- Migration script to update existing database schema
-- Run this script on your existing database to apply the new changes

USE bangrak_food_cultures;

-- Step 1: Add the new image_urls JSON column
ALTER TABLE restaurants ADD COLUMN image_urls JSON AFTER image_url;

-- Step 2: Make address column nullable
ALTER TABLE restaurants MODIFY COLUMN address VARCHAR(500) NULL;

-- Step 3: Update category ENUM to support new categories
-- Note: MySQL doesn't support directly modifying ENUM values, so we need to:
-- 1. Create a temporary column with new ENUM
-- 2. Copy data from old column to new column with mapping
-- 3. Drop old column
-- 4. Rename new column to original name

-- Step 3.1: Add new category column with updated ENUM
ALTER TABLE restaurants ADD COLUMN category_new ENUM('CAFE', 'BAR', 'CHINESE_RESTAURANT', 'JAPANESE_RESTAURANT', 'SOUTH_ASIAN_RESTAURANT', 'WESTERN_RESTAURANT', 'VEGETARIAN_RESTAURANT', 'HALAL_RESTAURANT', 'HEALTHY_RESTAURANT', 'THAI_RESTAURANT') AFTER description_en;

-- Step 3.2: Migrate data from old category to new category with mapping
UPDATE restaurants SET category_new = CASE category
    WHEN 'CAFE' THEN 'CAFE'
    WHEN 'BAR' THEN 'BAR'
    WHEN 'RESTAURANT' THEN
        CASE cuisine_type
            WHEN 'THAI' THEN 'THAI_RESTAURANT'
            WHEN 'CHINESE' THEN 'CHINESE_RESTAURANT'
            WHEN 'JAPANESE' THEN 'JAPANESE_RESTAURANT'
            WHEN 'SOUTH_ASIAN' THEN 'SOUTH_ASIAN_RESTAURANT'
            WHEN 'WESTERN' THEN 'WESTERN_RESTAURANT'
            WHEN 'VEGAN' THEN 'VEGETARIAN_RESTAURANT'
            WHEN 'HALAL' THEN 'HALAL_RESTAURANT'
            ELSE 'THAI_RESTAURANT'
        END
    ELSE 'THAI_RESTAURANT'
END;

-- Step 3.3: Drop old category column
ALTER TABLE restaurants DROP COLUMN category;

-- Step 3.4: Drop old cuisine_type column
ALTER TABLE restaurants DROP COLUMN cuisine_type;

-- Step 3.5: Rename new column to category
ALTER TABLE restaurants CHANGE COLUMN category_new category ENUM('CAFE', 'BAR', 'CHINESE_RESTAURANT', 'JAPANESE_RESTAURANT', 'SOUTH_ASIAN_RESTAURANT', 'WESTERN_RESTAURANT', 'VEGETARIAN_RESTAURANT', 'HALAL_RESTAURANT', 'HEALTHY_RESTAURANT', 'THAI_RESTAURANT') NOT NULL;

-- Step 4: Update indexes (remove old cuisine_type index)
ALTER TABLE restaurants DROP INDEX idx_cuisine_type;

-- Verify the changes
SELECT 'Migration completed successfully!' as message;
