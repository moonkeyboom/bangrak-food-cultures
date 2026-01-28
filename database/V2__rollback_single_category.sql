-- =====================================================
-- ROLLBACK SCRIPT: Revert to Old Category + CuisineType System
-- =====================================================
-- ย้อนกลับจากระบบใหม่ (category เดียว)
-- กลับไประบบเก่า (category + cuisineType)
-- =====================================================
-- ⚠️  WARNING: ใช้สคริปต์นี้เฉพาะเมื่อต้องการย้อนกลับเท่านั้น!
-- =====================================================

-- Step 1: Add back old columns
ALTER TABLE restaurants ADD COLUMN category_old VARCHAR(50);
ALTER TABLE restaurants ADD COLUMN cuisine_type VARCHAR(50);

-- Step 2: Convert new category back to old system
UPDATE restaurants SET
    category_old = CASE
        WHEN category IN ('CHINESE_RESTAURANT', 'JAPANESE_RESTAURANT', 'SOUTH_ASIAN_RESTAURANT',
                          'WESTERN_RESTAURANT', 'VEGETARIAN_RESTAURANT', 'HALAL_RESTAURANT',
                          'HEALTHY_RESTAURANT', 'THAI_RESTAURANT')
        THEN 'RESTAURANT'
        ELSE category
    END,
    cuisine_type = CASE
        WHEN category = 'THAI_RESTAURANT' THEN 'THAI'
        WHEN category = 'CHINESE_RESTAURANT' THEN 'CHINESE'
        WHEN category = 'JAPANESE_RESTAURANT' THEN 'JAPANESE'
        WHEN category = 'SOUTH_ASIAN_RESTAURANT' THEN 'SOUTH_ASIAN'
        WHEN category = 'WESTERN_RESTAURANT' THEN 'WESTERN'
        WHEN category = 'VEGETARIAN_RESTAURANT' THEN 'VEGAN'
        WHEN category = 'HALAL_RESTAURANT' THEN 'HALAL'
        WHEN category = 'HEALTHY_RESTAURANT' THEN 'THAI'
        ELSE NULL
    END;

-- Step 3: Drop new category column
ALTER TABLE restaurants DROP COLUMN category;

-- Step 4: Rename old columns back
ALTER TABLE restaurants RENAME COLUMN category_old TO category;
ALTER TABLE restaurants RENAME COLUMN cuisine_type TO cuisine_type;

-- Step 5: Set constraints
ALTER TABLE restaurants MODIFY COLUMN category VARCHAR(50) NOT NULL;
ALTER TABLE restaurants MODIFY COLUMN cuisine_type VARCHAR(50) NOT NULL;

-- Step 6: Verify rollback
SELECT
    id,
    name_th,
    category,
    cuisine_type,
    COUNT(*) as count
FROM restaurants
GROUP BY category, cuisine_type
ORDER BY category, cuisine_type;
