-- =====================================================
-- DATABASE MIGRATION: Simple Category Update
-- =====================================================
-- สำหรับ database ที่มีเฉพาะ category column (ไม่มี cuisine_type แยก)
-- แปลง RESTAURANT → THAI_RESTAURANT
-- =====================================================

-- Step 1: Add temporary column
ALTER TABLE restaurants ADD COLUMN new_category VARCHAR(50);

-- Step 2: Migrate data
UPDATE restaurants SET new_category = CASE
    -- Cafe and Bar stay the same
    WHEN category = 'CAFE' THEN 'CAFE'
    WHEN category = 'BAR' THEN 'BAR'

    -- All RESTAURANT → THAI_RESTAURANT (default for now)
    WHEN category = 'RESTAURANT' THEN 'THAI_RESTAURANT'

    -- Fallback
    ELSE category
END;

-- Step 3: Verify before dropping
SELECT new_category, COUNT(*) as count
FROM restaurants
GROUP BY new_category
ORDER BY new_category;

-- Step 4: Drop old category and rename new one
ALTER TABLE restaurants DROP COLUMN category;
ALTER TABLE restaurants RENAME COLUMN new_category TO category;

-- Step 5: Update column type to match new enum values
ALTER TABLE restaurants MODIFY COLUMN category ENUM(
    'CAFE',
    'BAR',
    'CHINESE_RESTAURANT',
    'JAPANESE_RESTAURANT',
    'SOUTH_ASIAN_RESTAURANT',
    'WESTERN_RESTAURANT',
    'VEGETARIAN_RESTAURANT',
    'HALAL_RESTAURANT',
    'HEALTHY_RESTAURANT',
    'THAI_RESTAURANT'
) NOT NULL;

-- Step 6: Final verification
SELECT category, COUNT(*) as count
FROM restaurants
GROUP BY category
ORDER BY category;
