-- =====================================================
-- DATABASE MIGRATION: Migrate to Single Category System
-- =====================================================
-- แปลงข้อมูลจากระบบเก่า (category + cuisineType)
-- เป็นระบบใหม่ (category เดียวรวมทุกอย่าง)
-- =====================================================

-- Step 1: Add temporary column to hold new category values
ALTER TABLE restaurants ADD COLUMN new_category VARCHAR(50);

-- Step 2: Migrate data based on old category + cuisineType
-- Mapping rules:
-- - cafe → CAFE
-- - bar → BAR
-- - restaurant + thai → THAI_RESTAURANT
-- - restaurant + chinese → CHINESE_RESTAURANT
-- - restaurant + japanese → JAPANESE_RESTAURANT
-- - restaurant + south_asian → SOUTH_ASIAN_RESTAURANT
-- - restaurant + western → WESTERN_RESTAURANT
-- - restaurant + vegan → VEGETARIAN_RESTAURANT
-- - restaurant + halal → HALAL_RESTAURANT
-- - restaurant + (no cuisine or other) → THAI_RESTAURANT (default)

UPDATE restaurants SET new_category = CASE
    -- Cafe and Bar stay the same
    WHEN category = 'CAFE' THEN 'CAFE'
    WHEN category = 'BAR' THEN 'BAR'

    -- Restaurant + specific cuisine → new combined category
    WHEN category = 'RESTAURANT' AND cuisine_type = 'THAI' THEN 'THAI_RESTAURANT'
    WHEN category = 'RESTAURANT' AND cuisine_type = 'CHINESE' THEN 'CHINESE_RESTAURANT'
    WHEN category = 'RESTAURANT' AND cuisine_type = 'JAPANESE' THEN 'JAPANESE_RESTAURANT'
    WHEN category = 'RESTAURANT' AND cuisine_type = 'SOUTH_ASIAN' THEN 'SOUTH_ASIAN_RESTAURANT'
    WHEN category = 'RESTAURANT' AND cuisine_type = 'WESTERN' THEN 'WESTERN_RESTAURANT'
    WHEN category = 'RESTAURANT' AND cuisine_type = 'VEGAN' THEN 'VEGETARIAN_RESTAURANT'
    WHEN category = 'RESTAURANT' AND cuisine_type = 'HALAL' THEN 'HALAL_RESTAURANT'

    -- Default: restaurant with no cuisine type → Thai restaurant
    WHEN category = 'RESTAURANT' THEN 'THAI_RESTAURANT'

    -- Fallback (shouldn't happen)
    ELSE 'THAI_RESTAURANT'
END;

-- Step 3: Drop old columns
ALTER TABLE restaurants DROP COLUMN cuisine_type;
ALTER TABLE restaurants DROP COLUMN category;

-- Step 4: Rename new_category to category
ALTER TABLE restaurants RENAME COLUMN new_category TO category;

-- Step 5: Set category as NOT NULL (it should already have values)
ALTER TABLE restaurants MODIFY COLUMN category VARCHAR(50) NOT NULL;

-- Step 6: Verify migration
SELECT
    category,
    COUNT(*) as count
FROM restaurants
GROUP BY category
ORDER BY category;

-- Expected result:
-- CAFE - count
-- BAR - count
-- CHINESE_RESTAURANT - count
-- JAPANESE_RESTAURANT - count
-- SOUTH_ASIAN_RESTAURANT - count
-- WESTERN_RESTAURANT - count
-- VEGETARIAN_RESTAURANT - count
-- HALAL_RESTAURANT - count
-- THAI_RESTAURANT - count
