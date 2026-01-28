# Setup Guide - Bangrak Food Cultures

## วิธีการติดตั้งและใช้งานระบบ

## 📋 ขั้นตอนการติดตั้ง (Installation Steps)

### Option 1: ใช้ Docker (แนะนำ - ง่ายที่สุด)

#### 1. ติดตั้ง Docker Desktop
- Download: https://www.docker.com/products/docker-desktop/
- ติดตั้งและเปิด Docker Desktop

#### 2. Build และ Run ระบบ
```bash
cd bangrak-food-cultures
docker-compose up --build
```

#### 3. เข้าใช้งาน
- เปิด browser ไปที่: http://localhost
- Admin Dashboard: http://localhost/admin-secret-dashboard
  - Password: `admin123`

#### 4. Import ข้อมูล (Optional)
```bash
# สร้าง folder ใน container
docker exec -it bangrak-backend mkdir -p /app/PrepData

# Copy CSV file เข้า container
docker cp "PrepData/Final restaurant list.csv" bangrak-backend:/app/PrepData/

# Import data
docker exec -it bangrak-backend curl -X POST http://localhost:8080/api/import/csv \
  -H "Content-Type: application/json" \
  -d "/app/PrepData/Final restaurant list.csv"
```

### Option 2: Development Mode (แยก Frontend & Backend)

#### Prerequisites
- Node.js 20+
- Java 17+
- Maven 3.9+
- MySQL 8.0+

#### 1. Setup Database

```bash
# สร้าง database
mysql -u root -p
CREATE DATABASE bangrak_food_cultures;
USE bangrak_food_cultures;
SOURCE database/schema.sql;
EXIT;
```

#### 2. Start Backend

```bash
cd backend

# แก้ไข application.properties ถ้าจำเป็น
# - spring.datasource.password
# - admin.password

# Run backend
mvn spring-boot:run

# Backend will run on http://localhost:8080
```

#### 3. Start Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Frontend will run on http://localhost:5173
```

#### 4. Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080
- Admin: http://localhost:5173/admin-secret-dashboard

## 🔧 การตั้งค่า (Configuration)

### เปลี่ยน Admin Password

#### ใน Docker:
แก้ไขไฟล์ `docker-compose.yml`:
```yaml
environment:
  ADMIN_PASSWORD: your_new_password
```

#### ใน Development:
แก้ไขไฟล์ `backend/src/main/resources/application.properties`:
```properties
admin.password=your_new_password
```

### เปลี่ยน Database Password

#### ใน Docker:
แก้ไข `docker-compose.yml`:
```yaml
environment:
  MYSQL_ROOT_PASSWORD: new_root_password
  MYSQL_PASSWORD: new_user_password
```

และอย่าลืมเปลี่ยนใน backend environment:
```yaml
SPRING_DATASOURCE_PASSWORD: new_user_password
```

#### ใน Development:
แก้ไข `application.properties`:
```properties
spring.datasource.password=your_password
```

## 📤 การ Import ข้อมูลจาก CSV

### 1. ตรวจสอบไฟล์ CSV
ตำแหน่ง: `PrepData/Final restaurant list.csv`

### 2. Import ผ่าน API

#### ใน Docker:
```bash
docker exec -it bangrak-backend curl -X POST http://localhost:8080/api/import/csv \
  -H "Content-Type: application/json" \
  -d "/app/PrepData/Final restaurant list.csv"
```

#### ใน Development:
```bash
curl -X POST http://localhost:8080/api/import/csv \
  -H "Content-Type: application/json" \
  -d "PrepData/Final restaurant list.csv"
```

### 3. ตรวจสอบผลลัพธ์
เปิด http://localhost:8080/api/restaurants เพื่อดูรายชื่อร้านอาหาร

## 🎨 การปรับแต่งรูปภาพ

### 1. เปลี่ยนรูปแผนที่
วางไฟล์ SVG ของแผนที่ที่:
```
frontend/public/assets/map/map.svg
```

### 2. เปลี่ยนหมุด (Pins)
วางไฟล์ PNG ของหมุดที่:
```
frontend/public/assets/pins/Pin_Cafe.png
frontend/public/assets/pins/Pin_Restaurant.png
frontend/public/assets/pins/Pin_Bar.png
```

ขนาดแนะนำ: 64x64 pixels (transparent background)

## 🔒 การตั้งค่า Security

### CORS Configuration

แก้ไขใน `docker-compose.yml` หรือ `application.properties`:
```properties
cors.allowed.origins=http://yourdomain.com,https://yourdomain.com
```

### SSL/HTTPS (Production)

ใน production ควรใช้ HTTPS:
1. ใช้ reverse proxy (Nginx/Apache)
2. ติดตั้ง SSL certificate (Let's Encrypt)
3. Update nginx.conf

## 🐛 Troubleshooting

### Problem: Database connection failed
**Solution:**
- ตรวจสอบว่า MySQL รันอยู่
- ตรวจสอบ username/password
- ตรวจสอบว่า database ถูกสร้างแล้ว

### Problem: Frontend cannot connect to backend
**Solution:**
- ตรวจสอบ CORS configuration
- ตรวจสอบ backend URL ใน `frontend/.env`
- ตรวจสอบ firewall

### Problem: Docker build failed
**Solution:**
- ตรวจสอบว่า Docker Desktop รันอยู่
- ใช้ `docker-compose down` แล้ว `docker-compose up --build` ใหม่
- ตรวจสอบ disk space

### Problem: Import CSV failed
**Solution:**
- ตรวจสอบ path ของ CSV file
- ตรวจสอบว่าไฟล์ไม่ได้ถูกเปิดอยู่ในโปรแกรมอื่น
- ตรวจสอบ encoding ของไฟล์ (ควรเป็น UTF-8)

## 📊 การใช้งานระบบ

### สำหรับผู้ใช้ทั่วไป

1. **ค้นหาร้านอาหาร**: ใช้ search bar ด้านบน
2. **กรองข้อมูล**: กดปุ่ม Filter ด้านซ้าย
3. **ดูรายละเอียด**: แตะที่หมุดบนแผนที่
4. **เปิด Google Maps**: กดปุ่มใน bottom sheet

### สำหรับ Admin

1. **Login**: เข้า `/admin-secret-dashboard`
2. **เพิ่มร้านอาหาร**: กดปุ่ม "เพิ่มร้านอาหาร"
3. **แก้ไขข้อมูล**: กดปุ่ม "Edit" บนร้านอาหาร
4. **ลบร้านอาหาร**: กดปุ่ม "Delete"
5. **ปรับตำแหน่งหมุด**: แก้ไข Pin X / Pin Y (0-100)

## 🚀 Deployment ขึ้น Production

### 1. สร้าง Production Build

```bash
# Build all images
docker-compose -f docker-compose.yml build

# Tag images
docker tag bangrak-food-cultures-frontend your-registry/frontend:latest
docker tag bangrak-food-cultures-backend your-registry/backend:latest

# Push to registry
docker push your-registry/frontend:latest
docker push your-registry/backend:latest
```

### 2. ตั้งค่า Environment Variables ใน Production

```yaml
environment:
  SPRING_DATASOURCE_URL: jdbc:mysql://production-db:3306/bangrak_food_cultures
  SPRING_DATASOURCE_PASSWORD: secure_password
  ADMIN_PASSWORD: very_secure_password
  CORS_ALLOWED_ORIGINS: https://yourdomain.com
```

### 3. Run ใน Production Mode

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 📞 ติดต่อสนับสนุน

หากพบปัญหาหรือต้องการความช่วยเหลือ:
1. อ่าน README.md
2. ตรวจสอบ logs: `docker-compose logs`
3. ติดต่อทีมพัฒนา

---

**ขอให้สนุกกับการใช้งานระบบ! 🎉**
