# Database Migration Guide

## เป้าหมาย (Objective)
แปลงข้อมูลร้านอาหารจากระบบเก่า (category + cuisineType) เป็นระบบใหม่ (category เดียว)

## สิ่งที่ต้องทำก่อน Migrate (Pre-migration Checklist)

### 1. Backup Database ก่อนเป็นอันดับแรก!
```bash
# สำหรับ MySQL
mysqldump -u root -p bangrak_food_cultures > backup_before_migration_$(date +%Y%m%d_%H%M%S).sql

# หรือถ้าใช้ Docker
docker exec -i mysql_container mysqldump -u root -p bangrak_food_cultures > backup_before_migration_$(date +%Y%m%d_%H%M%S).sql
```

### 2. ตรวจสอบข้อมูลเดิม
```sql
-- เช็คก่อนว่าข้อมูลเดิมมีอะไรบ้าง
SELECT
    category,
    cuisine_type,
    COUNT(*) as count
FROM restaurants
GROUP BY category, cuisine_type
ORDER BY category, cuisine_type;
```

ผลลัพธ์ที่คาดหวัง:
```
category     | cuisine_type | count
-------------|--------------|-------
BAR          | NULL         | X
CAFE         | NULL         | X
RESTAURANT   | CHINESE      | X
RESTAURANT   | HALAL        | X
RESTAURANT   | JAPANESE     | X
RESTAURANT   | SOUTH_ASIAN  | X
RESTAURANT   | THAI         | X
RESTAURANT   | VEGAN        | X
RESTAURANT   | WESTERN      | X
```

## วิธีการ Migrate (Migration Steps)

### ขั้นตอนที่ 1: เลือกวิธีการรัน SQL Script

#### วิธี A: ใช้ MySQL Command Line
```bash
mysql -u root -p bangrak_food_cultures < database/V2__migrate_to_single_category.sql
```

#### วิธี B: ใช้ Docker Compose (ถ้ารันใน Docker)
```bash
docker exec -i mysql_container mysql -u root -p bangrak_food_cultures < database/V2__migrate_to_single_category.sql
```

#### วิธี C: ใช้ MySQL Workbench / DBeaver / phpMyAdmin
1. เปิด database connection
2. เลือก database: `bangrak_food_cultures`
3. เปิดไฟล์ `database/V2__migrate_to_single_category.sql`
4. Execute/Run script

### ขั้นตอนที่ 2: ตรวจสอบผลลัพธ์หลัง Migrate

```sql
-- เช็คว่า migration สำเร็จไหม
SELECT
    category,
    COUNT(*) as count,
    MIN(name_th) as example_restaurant
FROM restaurants
GROUP BY category
ORDER BY category;
```

ผลลัพธ์ที่คาดหวัง (ควรมี 10 ประเภท):
```
category                  | count | example_restaurant
--------------------------|-------|------------------
BAR                       | X     | ...
CAFE                      | X     | ...
CHINESE_RESTAURANT        | X     | ...
HALAL_RESTAURANT          | X     | ...
HEALTHY_RESTAURANT        | 0     | NULL (ยังไม่มีข้อมูล)
JAPANESE_RESTAURANT       | X     | ...
SOUTH_ASIAN_RESTAURANT   | X     | ...
THAI_RESTAURANT          | X     | ...
VEGETARIAN_RESTAURANT    | X     | ...
WESTERN_RESTAURANT       | X     | ...
```

### ขั้นตอนที่ 3: ตรวจสอบว่า Backend ทำงานได้

```bash
# 1. Restart backend
cd backend
mvn spring-boot:run

# หรือถ้าใช้ Docker
docker-compose restart backend

# 2. ทดสอบ API endpoints
curl http://localhost:8080/api/restaurants | jq .

# ควรเห็นว่าแต่ละ restaurant มี category แบบใหม่
```

### ขั้นตอนที่ 4: ตรวจสอบ Frontend

```bash
# 1. Restart frontend
cd frontend
npm run dev

# 2. เปิดเว็บและทดสอบ
# - คลิก pin ดูว่าหมุดถูกต้องไหม
# - เปิด Filter panel ดูว่า filter ใช้ได้ไหม
# - เปิด Bottom Sheet ดูว่า category แสดงถูกต้องไหม
```

## Mapping Rules (กฎการแปลง)

| ระบบเก่า (Old System)                    | ระบบใหม่ (New System)         |
|------------------------------------------|-------------------------------|
| category = "CAFE"                         | CAFE                          |
| category = "BAR"                          | BAR                           |
| category = "RESTAURANT" + cuisine = "THAI" | THAI_RESTAURANT              |
| category = "RESTAURANT" + cuisine = "CHINESE" | CHINESE_RESTAURANT       |
| category = "RESTAURANT" + cuisine = "JAPANESE" | JAPANESE_RESTAURANT     |
| category = "RESTAURANT" + cuisine = "SOUTH_ASIAN" | SOUTH_ASIAN_RESTAURANT |
| category = "RESTAURANT" + cuisine = "WESTERN" | WESTERN_RESTAURANT      |
| category = "RESTAURANT" + cuisine = "VEGAN" | VEGETARIAN_RESTAURANT    |
| category = "RESTAURANT" + cuisine = "HALAL" | HALAL_RESTAURANT        |
| category = "RESTAURANT" + (no cuisine)     | THAI_RESTAURANT (default)   |

## หากเกิดปัญหา (Troubleshooting)

### ปัญหา: Migration ล้มเหลว
**วิธีแก้:** ใช้ Rollback Script
```bash
mysql -u root -p bangrak_food_cultures < database/V2__rollback_single_category.sql
```

### ปัญหา: Pin icon ไม่แสดง
**วิธีแก้:** ตรวจสอบไฟล์ pin icons
```bash
ls -la frontend/public/assets/pins/

# ต้องมีไฟล์ทั้ง 10 ไฟล์:
# Pin_Cafe.png
# Pin_Bar.png
# Pin_Restaurant_Chinese.png
# Pin_Restaurant_Japanese.png
# Pin_Restaurant_SouthAsian.png
# Pin_Restaurant_Western.png
# Pin_Restaurant_Vegan.png
# Pin_Restaurant_Halal.png
# Pin_Restaurant_Healthy.png
# Pin_Restaurant_Thai.png
```

### ปัญหา: Backend ส่ง category เป็น null
**วิธีแก้:** ตรวจสอบข้อมูล
```sql
-- เช็คว่ามี restaurant ไหนที่ category = null
SELECT id, name_th FROM restaurants WHERE category IS NULL;

-- ถ้ามี ให้ update เป็นค่า default
UPDATE restaurants SET category = 'THAI_RESTAURANT' WHERE category IS NULL;
```

## สรุป (Summary)

✅ **Migrate สำเร็จเมื่อ:**
1. Database มี category แบบใหม่ (10 ประเภท)
2. ไม่มีคอลัมน์ `cuisine_type` แล้ว
3. Backend API ส่งข้อมูล category ใหม่ได้ถูกต้อง
4. Frontend แสดงผล pin และ filter ถูกต้อง

⚠️ **ข้อควรระวัง:**
- Backup database ก่อนเสมอ
- Test ใน environment ทดลองก่อน production
- เตรียม rollback script ไว้เผื่อไว้

🎯 **Next Steps:**
หลังจาก migrate สำเร็จแล้ว สามารถเพิ่ม restaurant ประเภทใหม่ๆ ได้เลย เช่น:
- ร้านอาหารสุขภาพ (HEALTHY_RESTAURANT)
- หรือประเภทอื่นๆ ที่อาจจะเพิ่มในอนาคต
