# คู่มือ Deployment สำหรับ Bangrak Food Cultures
## เวอร์ชันสำหรับ Production

วันที่: 28 มกราคม 2026
ผู้จัดทำ: DevOps Team
สถานะ: พร้อมใช้งานจริง

---

## สารบัญ

1. [โครงสร้างระบบ](#โครงสร้างระบบ)
2. [เตรียมการก่อน Deploy](#เตรียมการก่อน-deploy)
3. [ขั้นตอนการ Deploy](#ขั้นตอนการ-deploy)
4. [การตรวจสอบและทดสอบ](#การตรวจสอบและทดสอบ)
5. [การป้องกันปัญหา](#การป้องกันปัญหา)
6. [ข้อจำกัดและวิธีแก้ไข](#ข้อจำกัดและวิธีแก้ไข)
7. [การดูแลรักษาระบบ](#การดูแลรักษาระบบ)

---

## โครงสร้างระบบ

### ภาพรวมสถาปัตยกรรม

ระบบของเราใช้สถาปัตยกรรมแบบ **Decoupled Frontend-Backend** ซึ่งแยกส่วนแสดงผลและ API ออกจากกันครับ

```
┌─────────────────────────────────────────┐
│         ผู้ใช้งาน                      │
│    (Mobile / Desktop Browser)          │
└─────────────────┬───────────────────────┘
                  │
                  ▼
    ┌──────────────────────────────┐
    │  Cloudflare CDN Network      │
    │  - เซิร์ฟเวอร์อยู่ทั่วโลก    │
    │  - Static file caching       │
    │  - Automatic HTTPS           │
    └──────────┬───────────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
┌──────────────┐  ┌─────────────────┐
│  Frontend     │  │  Backend API    │
│  (React SPA)  │  │  (Spring Boot)  │
│  เว็บไซต์     │  │  REST API       │
└──────────────┘  └────────┬────────┘
                           │
                           ▼
                    ┌──────────────────┐
                    │  Database        │
                    │  (PostgreSQL)    │
                    │  Supabase Cloud  │
                    └──────────────────┘
```

### เหตุผลที่ใช้สถาปัตยกรรมแบบนี้

1. **Frontend เป็น Static Files**
   - โหลดเร็วมเพราะอยู่บน CDN
   - ประหยัดค่า server ไม่ต้องใช้ Node.js runtime
   - scale ง่าย เพราะเป็นแค่ไฟล์ HTML/CSS/JS

2. **Backend เป็น REST API**
   - แยก business logic ออกจากการแสดงผล
   - ง่ายต่อการ maintenance และ update
   - สามารถใช้ภาษาอื่นได้ถ้าจำเป็น (Python, Go, ฯลฯ)

3. **Database อยู่บน Cloud**
   - ไม่ต้องดูแล server เอง
   - มี automatic backup
   - scale ง่ายเพียง upgrade plan

---

## เตรียมการก่อน Deploy

### 1. สิ่งที่ต้องมี

- ✅ GitHub account (ใช้ฟรี)
- ✅ Email สำหรับสมัครบริการต่างๆ
- ✅ เวลาว่างประมาณ 30-45 นาที
- ✅ Code อยู่ใน GitHub repository แล้ว

### 2. บริการที่เราใช้ (ฟรี 100%)

| บริการ | ใช้ทำอะไร | ราคา | ข้อจำกัด |
|---------|------------|------|----------|
| **Cloudflare Pages** | เก็บไฟล์เว็บ (Frontend) | ฟรี | ไม่มี |
| **Render** | รัน backend API | ฟรี | 750 ชม./เดือน |
| **Supabase** | ฐานข้อมูล PostgreSQL | ฟรี | 500 MB |
| **UptimeRobot** | ping backend ไม่ให้หลับ | ฟรี | 50 monitors |
| **GitHub** | เก็บ code | ฟรี | Public repo |

**รวมค่าใช้จ่ายต่อเดือน: 0 บาท**

---

## ขั้นตอนการ Deploy

### STEP 1: สร้าง GitHub Repository

ถ้ายังไม่ได้สร้าง:

1. เข้าไปที่ https://github.com/new
2. ตั้งชื่อ repository: `bangrak-food-cultures`
3. เลือก **Public** (ถ้าเลือก Private จะไม่ฟรีบางบริการ)
4. อย่าติ๊ก "Initialize with README"
5. กด "Create repository"

6. จากนั้นในเครื่อง local เปิด terminal หรือ command prompt:

```bash
cd D:\Mook\personalProject\bangrak-food-cultures
git remote add origin https://github.com/ชื่อผู้ใช้/bangrak-food-cultures.git
git branch -M main
git push -u origin main
```

---

### STEP 2: สร้าง Database บน Supabase

#### 2.1 สมัคร Supabase

1. ไปที่ https://supabase.com/sign-up
2. กด "Sign up with GitHub" (ง่ายที่สุด)
3. ให้สิทธิ์ GitHub เข้าถึง account
4. รอสักครู่ จะเข้าสู่หน้า dashboard

#### 2.2 สร้าง Project ใหม่

1. ใน dashboard กด "New Project"
2. กรอกข้อมูล:

   - **Name:** `bangrak-food-cultures`
   - **Database Password:** สร้าง password ที่ยากๆ และ **จดไว้เด้อครับ** (เดี๋ยวจะใช้)
   - **Region:** Singapore (ใกล้เราที่สุด)
   - **Pricing Plan:** Free

3. กด "Create new project"
4. รอประมาณ 2-3 นาที (ตอนสร้าง database ใหม่ครั้งแรก)

#### 2.3 รับ Connection String

เมื่อ project พร้อมแล้ว:

1. ไปที่เมนูซ้ายมือ → กดที่ project ที่สร้าง
2. ไปที่ **Settings** (รูปฟันเฟือง) → **Database**
3. หาส่วน **Connection string**
4. เลือก tab **JDBC**
5. กดปุ่ม Copy ตรง connection string

ตัวอย่างที่จะได้:
```
jdbc:postgresql://db.abcdefghijklmnopqrstuvwxyz.supabase.co:5432/postgres
```

**จด string นี้ไว้ใน Notepad ก่อนครับ** เดี๋ยวจะใช้ใน STEP 3

#### 2.4 สร้างตารางใน Database

1. ใน project dashboard ไปที่เมนู **SQL Editor**
2. กด "New query"
3. Copy โค้ด SQL จากไฟล์ `database/schema.sql`
4. วางลงใน editor
5. กดปุ่ม **Run** (หรือกด Ctrl + Enter)

ตอนนี้ database ของเราพร้อมใช้งานแล้วครับ!

---

### STEP 3: Deploy Backend บน Render

#### 3.1 สมัคร Render

1. ไปที่ https://render.com/register
2. กด "Sign up with GitHub"
3. Authorize ให้ Render เข้าถึง GitHub

#### 3.2 เตรียม Configuration File

ในโฟลเดอร์ backend สร้างไฟล์สำหรับ production:

```bash
cd backend/src/main/resources
```

สร้างไฟล์ `application-production.properties`:

```properties
# Database Config (ใส่ค่าจาก STEP 2.3)
spring.datasource.url=jdbc:postgresql://db.xxx.supabase.co:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=ใส่ password ที่ตั้งตอนสร้าง Supabase
spring.datasource.driver-class-name=org.postgresql.Driver

# Connection Pool (สำคัญมากสำหรับ Supabase Free Tier)
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=30000

# JPA Config
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

# Server Config
server.port=${PORT:8080}

# CORS Config (จะใส่ frontend URL ใน STEP 4)
cors.allowed-origins=https://bangrak-food-cultures.pages.dev

# Admin Password
admin.password=ใส่ password ที่ต้องการสำหรับ admin
```

**สำคัญ:** อย่า commit ไฟล์นี้ขึ้น GitHub เด้อครับ! เพราะมี password อยู่

ไฟล์นี้อยู่ใน .gitignore แล้ว ปลอดภัย

#### 3.3 สร้าง Web Service บน Render

1. ใน Render dashboard กดปุ่ม **New** → **Web Service**
2. กด **Connect GitHub**
3. เลือก repository `bangrak-food-cultures`
4. กด **Connect**

#### 3.4 ตั้งค่า Build & Deploy

ในหน้า "Create Web Service":

- **Name:** `bangrak-food-cultures-api`
- **Environment:** Docker
- **Dockerfile Path:** `Dockerfile.backend`
- **Region:** Singapore (เลือกใกล้ๆ)
- **Branch:** `main`
- **Plan:** Free

ในส่วน **Environment Variables** กดปุ่ม **+** เพิ่มตัวแปร:

```
SPRING_PROFILES_ACTIVE = production
PORT = 8080
SPRING_DATASOURCE_URL = jdbc:postgresql://db.xxx.supabase.co:5432/postgres
SPRING_DATASOURCE_USERNAME = postgres
SPRING_DATASOURCE_PASSWORD = password จาก Supabase
ADMIN_PASSWORD = password สำหรับ admin
```

5. กดปุ่ม **Create Web Service**

#### 3.5 รอ Deploy

ตอนนี้ Render จะเริ่ม build Docker image:

- ครั้งแรกจะใช้เวลา 5-10 นาที (เพราะต้อง download dependencies)
- ครั้งต่อไปจะเร็วขึ้น (ประมาณ 2-3 นาที)

ดู progress ได้ที่ tab **Logs** ด้านขวา

เมื่อ deploy เสร็จจะเห็น status: **"Live"**

#### 3.6 ทดสอบ Backend

ได้ URL ประมาณนี้:
```
https://bangrak-food-cultures-api.onrender.com
```

ทดสอบโดย:
1. เปิด browser ไปที่: `https://bangrak-food-cultures-api.onrender.com/api/health`
2. ควรได้ response:
```json
{
  "status": "UP",
  "service": "Bangrak Food Cultures API"
}
```

ถ้าได้แบบนี้ แปลว่า backend พร้อมแล้วครับ!

**จด URL นี้ไว้ครับ** เดี๋ยวจะใช้ใน STEP 4

---

### STEP 4: Deploy Frontend บน Cloudflare Pages

#### 4.1 สมัคร Cloudflare

1. ไปที่ https://dash.cloudflare.com/sign-up
2. กรอก email และ password
3. ยืนยัน email ที่ได้รับ

#### 4.2 เชื่อม GitHub Repository

1. ใน dashboard ไปที่เมนู **Workers & Pages**
2. กด **Create application** → **Pages**
3. กด **Connect to Git**

ถ้ายังไม่เคย connect:
1. กด **Install GitHub App**
2. Authorize Cloudflare
3. เลือก organization หรือ personal account
4. เลือก repository `bangrak-food-cultures`
5. กด **Install**

6. กลับมาที่หน้า Create Pages แล้วเลือก repo อีกครั้ง

#### 4.3 ตั้งค่า Build Settings

ในหน้า "Begin setup":

- **Project name:** `bangrak-food-cultures`
- **Production branch:** `main`
- **Framework preset:** Vite
- **Root directory:** `frontend`

ในส่วน **Build settings**:
- **Build command:** `npm run build`
- **Build output directory:** `dist`

#### 4.4 ตั้งค่า Environment Variables

ในส่วน **Environment variables** กด **+** เพิ่ม:

```
VITE_API_BASE_URL = https://bangrak-food-cultures-api.onrender.com/api
```

5. กด **Save and Deploy**

#### 4.5 รอ Deploy

Cloudflare จะ build และ deploy:

- ใช้เวลา 2-3 นาที
- ดู progress ได้ที่ **Deployments** tab

เมื่อ deploy เสร็จจะได้ URL:
```
https://bangrak-food-cultures.pages.dev
```

#### 4.6 ทดสอบ Frontend

1. คลิก URL ด้านบน
2. ควรเห็นหน้าเว็บแผนที่แล้ว
3. ลองกดที่หมุดร้านอาหาร ดู popup แสดงไหม
4. เปิด Console (F12) ตรวจดูว่ามี error ไหม

---

### STEP 5: ตั้งค่า Keep-Alive (ไม่ให้ Backend หลับ)

ปัญหาของ Render Free Tier:
- ถ้าไม่มีคนใช้ 15 นาที → backend จะหลับ
- คนถัดไปที่ใช้ → รอ 5-30 วินาที (Cold Start)

วิธีแก้: ใช้ UptimeRobot ping ทุก 5 นาที

#### 5.1 สมัคร UptimeRobot

1. ไปที่ https://uptimerobot.com/register
2. กรอก email และ password
3. ยืนยัน email

#### 5.2 สร้าง Monitor

1. กด **Add New** → **Monitor**
2. ตั้งค่า:

   - **Monitor Type:** HTTPS
   - **URL:** `https://bangrak-food-cultures-api.onrender.com/api/health`
   - **Friendly Name:** `Bangrak API - Health Check`
   - **Monitoring Interval:** 5 นาที
   - **Alert Contacts:** เลือก email ของคุณ

3. กด **Create Monitor**

ตอนนี้ backend จะไม่หลับแล้วครับ!

---

### STEP 6: ตั้งค่า CORS (สำคัญ!)

ตอนนี้ frontend อยู่ที่ Cloudflare Pages แต่ backend ยังไม่รู้ว่า frontend URL อะไร

วิธีแก้:

1. กลับไปที่ Render dashboard
2. เลือก service: `bangrak-food-cultures-api`
3. ไปที่ **Environment**
4. แก้ไขตัวแปร `CORS_ALLOWED_ORIGINS`:

```
https://bangrak-food-cultures.pages.dev
```

ถ้ามีหลายบรรทัดใช้ comma คั่น:
```
https://bangrak-food-cultures.pages.dev,https://custom-domain.com
```

5. กด **Save Changes**
6. Render จะ auto-deploy ใหม่ให้อัตโนมัติ

---

### STEP 7: ทดสอบระบบทั้งหมด

#### 7.1 Frontend Checklist

- [ ] หน้าเว็บโหลดเร็ว
- [ ] แผนที่แสดง
- [ ] หมุดร้านอาหารแสดง
- [ ] กดหมุด → popup แสดงข้อมูล
- [ ] Filter ทำงาน
- [ ] Search ทำงาน
- [ ] Admin dashboard ทำงาน
- [ ] Mobile responsive

#### 7.2 Backend Checklist

เปิด terminal หรือ command prompt แล้วพิมพ์:

```bash
# Test health endpoint
curl https://bangrak-food-cultures-api.onrender.com/api/health

# Test get restaurants
curl https://bangrak-food-cultures-api.onrender.com/api/restaurants

# Test CORS
curl -H "Origin: https://bangrak-food-cultures.pages.dev" \
     https://bangrak-food-cultures-api.onrender.com/api/health
```

ต้องได้ response 200 OK ทั้งหมดครับ

---

## การตรวจสอบและทดสอบ

### Dashboard ที่ต้องดูทุกวัน

1. **Cloudflare Pages**
   - URL: https://dash.cloudflare.com
   - ดู: Build status, Errors, Analytics

2. **Render**
   - URL: https://dashboard.render.com
   - ดู: CPU/RAM usage, Response time, Logs

3. **Supabase**
   - URL: https://supabase.com/dashboard
   - ดู: Database size, API calls, Storage

4. **UptimeRobot**
   - URL: https://uptimerobot.com/dashboard
   - ดู: Uptime percentage, Response time

### สัญญาณเตือนที่ต้องระวัง

| สัญญาณ | ปัญหา | วิธีแก้ |
|--------|--------|---------|
| RAM เกิน 90% | Backend อาจ crash | Optimize code, เพิ่ม connection pool |
| Database เกิน 400MB | เกือบเต็มแล้ว | Archive data เก่าๆ |
| Build minutes เกิน 400/500 | เกือบหมดอายุ | ลดจำนวน deploy |
| Response time > 5 วินาที | Backend หลับ | Check UptimeRobot |

---

## การป้องกันปัญหา

### ปัญหาที่ 1: Backend หลับ (Sleep Mode)

**อาการ:** ครั้งแรกใช้ช้า 5-30 วินาที

**สาเหตุ:** Render Free Tier ให้ backend หลับถ้าไม่มี request 15 นาที

**วิธีแก้:**
- ✅ ใช้ UptimeRobot ping ทุก 5 นาที (ทำไปแล้วใน STEP 5)
- ✅ ใส่ health check endpoint ไว้ (สร้างไปแล้ว)
- ✅ Frontend cache ข้อมูลใน localStorage

### ปัญหาที่ 2: Database Connection Pool เต็ม

**อาการ:** Error "Connection timeout" หรือ "Too many connections"

**สาเหตุ:** Supabase Free Tier จำกัด 60 connections พร้อมกัน

**วิธีแก้:**
- ✅ Set `maximum-pool-size=10` (ทำไปแล้ว)
- ✅ Set `minimum-idle=5` (ทำไปแล้ว)
- ✅ Monitor connection count ที่ Supabase dashboard

### ปัญหาที่ 3: CORS Error

**อาการ:** Console ฟ้อง "Access-Control-Allow-Origin" error

**สาเหตุ:** Backend ไม่อนุญาตให้ frontend เรียกใช้

**วิธีแก้:**
- ✅ Update `cors.allowed-origins` ใน Render (ทำไปแล้ว)
- ✅ ตรวจสอบว่า URL ถูกต้อง

### ปัญหาที่ 4: Build Minutes เกือบหมด

**อาการ:** Cloudflare ไม่ยอมให้ deploy ต่อ

**สาเหตุ:** Free tier จำกัด 500 build minutes/เดือน

**วิธีแก้:**
- ✅ Deploy เฉพาะเมื่อมีการเปลี่ยนแปลงจริง
- ✅ ใช้ Preview deployments สำหรับทดสอบ
- ✅ Delete old deployments ที่ไม่ใช้แล้ว

---

## ข้อจำกัดและวิธีแก้ไข

### Cloudflare Pages

| รายการ | Free Tier | เมื่อเกือบ | วิธีแก้ |
|---------|-----------|------------|----------|
| Bandwidth | Unlimited | - | - |
| Build Minutes | 500/เดือน | Delete deployments | เหลือ 300+ นาที |
| Requests | Unlimited | - | - |
| Sites | Unlimited | - | - |

### Render (Backend)

| รายการ | Free Tier | เมื่อเกือบ | วิธีแก้ |
|---------|-----------|------------|----------|
| RAM | 512 MB | เกิน 90% | Optimize JVM, code cache |
| CPU | Shared | Slow | Optimize queries |
| Hours | 750/เดือน | เกิน 700 ชม. | ลบ service ที่ไม่ใช้ |
| Sleep | 15 นาที | เริ่มช้า | UptimeRobot ping |

### Supabase (Database)

| รายการ | Free Tier | เมื่อเกือบ | วิธีแก้ |
|---------|-----------|------------|----------|
| Storage | 500 MB | เกิน 400 MB | Archive data, delete logs |
| Database Size | 500 MB | เกิน 400 MB | เหมือนกัน |
| Connections | 60 | เกิน 50 | Increase pool efficiency |
| Bandwidth | 1 GB/เดือน | เกิน 800 MB | Cache API responses |

---

## การดูแลรักษาระบบ

### รายวัน (5 นาที/วัน)

1. **UptimeRobot Dashboard**
   - ตรวจดูว่า backend ยัง up อยู่
   - Response time ไม่เกิน 1 วินาที

2. **Render Logs**
   - ดูว่ามี error หรือไม่
   - CPU/RAM ไม่ปกติหรือเปล่า

### รายสัปดาห์ (30 นาที/สัปดาห์)

1. **Cloudflare Analytics**
   - ดู traffic, popular pages
   - ตรวจดู error rate

2. **Supabase Table Editor**
   - ตรวจสอบข้อมูลครบถ้วน
   - Backup data สำคัญ

3. **Performance Check**
   - ใช้ Google PageSpeed Insights
   - ตรวจสอบ mobile score

### รายเดือน (1 ชั่วโมง/เดือน)

1. **Database Maintenance**
   - Export data dump จาก Supabase
   - Archive หรือลบข้อมูลที่ไม่ใช้

2. **Security Check**
   - Update dependencies
   - Review logs สำหรับ suspicious activity

3. **Capacity Planning**
   - ดู usage trend
   - วางแผน upgrade ถ้าจำเป็น

---

## ตัวอย่าง Commit Message ที่ดี

### Commit ที่ 1: เริ่มต้นโปรเจกต์
```
feat: initialize project structure

- Setup Spring Boot backend with JPA and MySQL
- Create React frontend with Vite and Tailwind CSS
- Add Docker Compose for local development
- Create initial database schema

Tech stack:
- Backend: Spring Boot 3.2.0, Java 17
- Frontend: React 19, Vite 7, Tailwind CSS 4
- Database: MySQL 8.0
- DevOps: Docker, Docker Compose
```

### Commit ที่ 2: เพิ่มฟีเจอร์ค้นหา
```
feat: add search and filter functionality

Frontend changes:
- Add SearchBar component with real-time search
- Implement FilterPanel with category and district filters
- Update RestaurantContext to handle filter state

Backend changes:
- Add query parameters support in RestaurantController
- Implement dynamic query building in RestaurantService

Testing:
- Test search with Thai and English text
- Verify filter combinations work correctly
```

### Commit ที่ 3: แก้ไข bug
```
fix: resolve imageUrls JSON serialization error

Problem:
- MySQL JSON column rejects undefined values
- Backend throws "Invalid JSON text" error

Solution:
- Update StringListConverter to use JSON format
- Change frontend to send null instead of undefined
- Update TypeScript types for imageUrls

Files changed:
- backend/src/main/java/.../StringListConverter.java
- frontend/src/components/Admin/AdminDashboard.tsx
- frontend/src/types/index.ts

Testing:
- Create restaurant with multiple images
- Update existing restaurant
- Delete all images from restaurant
```

### Commit ที่ 4: เตรียม deploy
```
chore: prepare for production deployment

Infrastructure:
- Add HealthController for /api/health endpoint
- Update Dockerfile for Render compatibility
- Add render.yaml configuration
- Create production config templates

Config changes:
- Add PostgreSQL driver for Supabase migration
- Update vite.config.ts for production build
- Add environment variable examples

Documentation:
- Create comprehensive deployment guide
- Add migration guide from MySQL to PostgreSQL
- Document free tier limitations

Next: Deploy to Cloudflare Pages, Render, Supabase
```

### Commit ที่ 5: แก้ไขหลัง deploy
```
fix: resolve CORS issue after deployment

Problem:
- Frontend cannot call backend API
- Console shows "Access-Control-Allow-Origin" error

Root cause:
- Backend CORS config doesn't include Cloudflare Pages URL

Solution:
- Update CORS allowed origins in Render environment
- Add production URL to cors.allowed-origins

Verified:
- Frontend can fetch restaurants successfully
- Admin dashboard can CRUD operations
```

---

## สรุป

### อะไรคือ "Free 100%" ที่เราใช้

1. **ไม่ต้องใช้บัตรเครดิต**
   - ทุกบริการสมัครด้วย email/GitHub
   - ไม่มีการถาบัตรเครดิตเลย

2. **ไม่มีการหักเงินอัตโนมัติ**
   - ฟรีตลอดอายุ (หรือไม่มีวันหมดอายุ)
   - ไม่ต้องกังวลเรื่องค่าใช้จ่ายแอบแฝง

3. **ระบบที่ใช้**
   - **Frontend:** Cloudflare Pages (CDN ทั่วโลก)
   - **Backend:** Render (Docker container)
   - **Database:** Supabase (Managed PostgreSQL)
   - **Monitoring:** UptimeRobot (Health check)

### ข้อดีของสถาปัตยกรรมนี้

✅ **เสถียร:** CDN ทั่วโลก โหลดเร็ว
✅ **ประหยัด:** ไม่เสียค่า server
✅ **Scale ง่าย:** Frontend auto-scale
✅ **ง่ายต่อการ develop:** แยก frontend/backend
✅ **เหมาะกับ small project:** รองรับได้ถึง 10,000 users

### เมื่อไรต้อง upgrade

เมื่อมี users เพิ่มขึ้น:

1. **1,000 users:** ยังใช้ free tier ได้
2. **10,000 users:** Implement caching, optimize queries
3. **100,000 users:** ถึงเวลา upgrade plan

ตอน upgrade:
- Render Pro: $7/เดือน
- Supabase Pro: $25/เดือน
- ยังถูกกว่าเช่า VPS เอง

---

## คำถามที่พบบ่อย (FAQ)

**Q: ทำไม backend ช้าครั้งแรก?**
A: Render Free Tier ต้องเริ่ม container ใหม่ (Cold Start) ใช้เวลา 5-30 วินาที

**Q: ทำไม database ไม่ต่อเนื่อง?**
A: Check UptimeRobot ว่ายัง ping อยู่ไหม หรือ database เต็ม

**Q: ทำไม frontend มี error?**
A: ตรวจ CORS config ใน backend และ API URL ใน frontend

**Q: จะรู้ได้อย่างไรว่าใกล้หมด quota?**
A: ดูที่ dashboard ของแต่ละบริการ จะมี % การใช้งาน

---

**สรุป:** ระบบนี้ใช้งานได้จริง เสถียร และฟรีตลอดไป หากใครถ้านไปต่อ ให้ถามได้เลยครับ
