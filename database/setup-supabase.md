# วิธี setup Database ใน Supabase

## 1. เปิด Supabase SQL Editor
- เข้าไปที่ https://supabase.com/dashboard
- เลือก project ของคุณ
- คลิกที่ "SQL Editor" ที่เมนูด้านซ้าย

## 2. สร้าง New Query
- คลิก "New query"

## 3. Copy และ Paste SQL นี้

```sql
-- Bangrak Food Cultures Database Schema (PostgreSQL for Supabase)

-- Restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_th VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    description_th TEXT NOT NULL,
    description_en TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN ('CAFE', 'BAR', 'CHINESE_RESTAURANT', 'JAPANESE_RESTAURANT', 'SOUTH_ASIAN_RESTAURANT', 'WESTERN_RESTAURANT', 'VEGETARIAN_RESTAURANT', 'HALAL_RESTAURANT', 'HEALTHY_RESTAURANT', 'THAI_RESTAURANT')),
    sub_district VARCHAR(50) NOT NULL CHECK (sub_district IN ('MAHA_PHRUETTHARAM', 'SILOM', 'SURIYAWONG', 'BANG_RAK', 'SI_PHRAYA')),
    address VARCHAR(500),
    google_maps_url VARCHAR(1000) NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    pin_x DOUBLE PRECISION NOT NULL,
    pin_y DOUBLE PRECISION NOT NULL,
    image_url VARCHAR(1000),
    image_urls JSONB,
    health_friendly BOOLEAN NOT NULL DEFAULT FALSE,
    heritage_restaurant BOOLEAN NOT NULL DEFAULT FALSE,
    license_volume VARCHAR(50),
    license_number VARCHAR(50),
    license_year VARCHAR(10),
    license_holder VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_restaurants_category ON restaurants(category);
CREATE INDEX IF NOT EXISTS idx_restaurants_sub_district ON restaurants(sub_district);
CREATE INDEX IF NOT EXISTS idx_restaurants_health_friendly ON restaurants(health_friendly);
CREATE INDEX IF NOT EXISTS idx_restaurants_heritage_restaurant ON restaurants(heritage_restaurant);

-- Create trigger function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for restaurants table
DROP TRIGGER IF EXISTS update_restaurants_updated_at ON restaurants;
CREATE TRIGGER update_restaurants_updated_at
    BEFORE UPDATE ON restaurants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Database schema created successfully!';
END $$;
```

## 4. Run SQL
- คลิกปุ่ม "Run" หรือกด Ctrl+Enter
- รอจนกว่าจะขึ้น "Success" หรือ "NOTICE: Database schema created successfully!"

## 5. Verify Table Created
- ไปที่ "Table Editor" ที่เมนูด้านซ้าย
- ควรเห็น table "restaurants"

## 6. Test API
หลังจาก run SQL แล้ว ให้ลอง POST อีกครั้ง:
```bash
curl -X POST https://bangrak-food-cultures-api-1.onrender.com/api/restaurants \
  -H "Content-Type: application/json" \
  -d "{\"nameTh\":\"ทดสอบ\",\"nameEn\":\"Test\",\"descriptionTh\":\"ทดสอบ\",\"descriptionEn\":\"Test\",\"category\":\"THAI_RESTAURANT\",\"subDistrict\":\"SILOM\",\"googleMapsUrl\":\"https://maps.google.com\",\"pinX\":50.0,\"pinY\":50.0,\"healthFriendly\":false,\"heritageRestaurant\":false}"
```
