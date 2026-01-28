# 🚀 Bangrak Food Cultures - Deployment Guide

## โครงสร้างระบบ (Architecture)

```
┌─────────────────────────────────────────────────────┐
│              USER (Mobile/Desktop)                   │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │  Cloudflare Pages (CDN)      │
        │  - Static HTML/CSS/JS        │
        │  - Global Edge Locations     │
        │  - Auto HTTPS                │
        └──────────────┬───────────────┘
                       │
        ┌──────────────┴───────────────┐
        ▼                              ▼
┌──────────────────┐         ┌─────────────────┐
│  Frontend        │         │  Backend        │
│  (React Build)   │◄───────►│  (Spring Boot)  │
│  Cloudflare Pages│  AJAX   │  Render         │
└──────────────────┘         └────────┬────────┘
                                     │
                                     ▼
                          ┌──────────────────────┐
                          │  Database            │
                          │  Supabase (PostgreSQL)│
                          └──────────────────────┘
```

---

## 📋 CHECKLIST ก่อนเริ่ม Deploy

- [ ] มี GitHub account (ฟรี)
- [ ] มี Email สำหรับสมัครบริการต่างๆ
- [ ] Code พร้อม deploy อยู่ใน GitHub repository
- [ ] มีเวลาประมาณ 30-45 นาที

---

## STEP 1: เตรียม GitHub Repository

### 1.1 สร้าง Repository บน GitHub

1. ไปที่: https://github.com/new
2. ตั้งชื่อ: `bangrak-food-cultures`
3. เลือก `Public` (ถ้าต้องการฟรี)
4. **อย่า**เลือก `Initialize with README`
5. กด `Create repository`

### 1.2 Push Code ไปยัง GitHub

```bash
# เข้าไปในโปรเจกต์
cd D:\Mook\personalProject\bangrak-food-cultures

# Initialize git (ถ้ายังไม่ได้ทำ)
git init

# Add all files
git add .

# Commit ครั้งแรก
git commit -m "Initial commit: Ready for deployment"

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/bangrak-food-cultures.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**✅ ตรวจสอบ:** ไปที่ GitHub แล้วดูว่า code อัปโหลดหมดแล้ว

---

## STEP 2: Deploy Database บน Supabase

### 2.1 สร้าง Supabase Account

1. ไปที่: https://supabase.com/sign-up
2. กด `Sign up with GitHub` (ฟรี 100%)
3. Authorize GitHub

### 2.2 สร้าง Database Project

1. กด `New Project`
2. ตั้งค่าดังนี้:

```
Name: bangrak-food-cultures
Database Password: [สร้าง password และจดไว้!]
Region: Southeast Asia (Singapore)
Pricing Plan: Free
```

3. กด `Create new project`
4. **รอสักครู่** (ประมาณ 2-3 นาที)

### 2.3 รับ Database Connection String

1. ใน project dashboard ไปที่ `Settings` → `Database`
2. หา `Connection string` → `JDBC`
3. กด `Copy` connection string
4. **จดไว้ใน notepad** จะใช้ใน STEP 3

ตัวอย่าง:
```
jdbc:postgresql://db.abcdefg.supabase.co:5432/postgres
```

### 2.4 Run Database Schema

1. ใน Supabase dashboard ไปที่ `SQL Editor`
2. กด `New query`
3. Copy SQL จากไฟล์ `database/schema.sql`
4. Paste ลงใน editor
5. กด `Run` หรือ `Ctrl + Enter`

### 2.5 ตั้งค่า Row Level Security (Optional)

ถ้าต้องการให้มี security เพิ่ม:

```sql
-- เปิด RLS
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

-- อนุญาตให้อ่านได้ทั้งหมด
CREATE POLICY "Allow public read access"
ON restaurants FOR SELECT
TO public
USING (true);

-- Admin เท่านั้นที่เขียนได้ (ใช้ backend API)
```

---

## STEP 3: Deploy Backend บน Render

### 3.1 สร้าง Render Account

1. ไปที่: https://render.com/register
2. กด `Sign up with GitHub` (ฟรี 100%)
3. Authorize GitHub

### 3.2 เตรียม Production Config

1. ในโปรเจกต์ local ของคุณ:
   ```bash
   cd backend/src/main/resources
   ```

2. Copy ไฟล์ example:
   ```bash
   cp application-production.properties.example application-production.properties
   ```

3. แก้ไฟล์ `application-production.properties`:
   ```properties
   # ใส่ค่าจริงจาก Supabase (STEP 2.3)
   spring.datasource.url=jdbc:postgresql://db.xxx.supabase.co:5432/postgres
   spring.datasource.username=postgres
   spring.datasource.password=your-password-from-step-2

   # Frontend URL (จะได้ใน STEP 4)
   cors.allowed-origins=https://bangrak-food-cultures.pages.dev

   # Admin password
   admin.password=your-strong-password
   ```

4. **⚠️ สำคัญ:** ไฟล์นี้จะถูก `.gitignore` แล้ว ไม่ต้อง commit!

### 3.3 สร้าง Web Service บน Render

1. ใน Render dashboard กด `New` → `Web Service`
2. กด `Connect GitHub`
3. เลือก repo: `bangrak-food-cultures`
4. กด `Connect`

### 3.4 Config Web Service

ในหน้า "Create Web Service":

```
Name: bangrak-food-cultures-api
Environment: Docker
Dockerfile Path: Dockerfile.backend
Region: Singapore (ใกล้ที่สุด)
Branch: main
Plan: Free
```

### 3.5 ตั้งค่า Environment Variables

ใน section "Environment" กด `+` เพิ่มตัวแปร:

```
Key: SPRING_PROFILES_ACTIVE
Value: production

Key: PORT
Value: 8080

Key: SPRING_DATASOURCE_URL
Value: jdbc:postgresql://db.xxx.supabase.co:5432/postgres

Key: SPRING_DATASOURCE_USERNAME
Value: postgres

Key: SPRING_DATASOURCE_PASSWORD
Value: your-supabase-password

Key: ADMIN_PASSWORD
Value: your-admin-password
```

### 3.6 Deploy

1. กด `Create Web Service`
2. **รอสักครู่** (ประมาณ 5-10 นาทีสำหรับครั้งแรก)
3. เมื่อ deploy เสร็จ จะได้ URL:
   ```
   https://bangrak-food-cultures-api.onrender.com
   ```

### 3.7 Test Backend Health

เปิด browser หรือใช้ curl:

```bash
curl https://bangrak-food-cultures-api.onrender.com/api/health
```

ต้องได้ response:
```json
{
  "status": "UP",
  "service": "Bangrak Food Cultures API",
  "timestamp": "2024-xx-xx..."
}
```

**จด URL นี้ไว้** จะใช้ใน STEP 4

---

## STEP 4: Deploy Frontend บน Cloudflare Pages

### 4.1 สร้าง Cloudflare Account

1. ไปที่: https://dash.cloudflare.com/sign-up
2. กรอก email และ password
3. ยืนยัน email (ฟรี 100%)

### 4.2 เตรียม Frontend Environment Variables

1. ในโปรเจกต์ local:
   ```bash
   cd frontend
   ```

2. สร้างไฟล์ `.env.production`:
   ```bash
   # ใส่ backend URL จาก STEP 3.7
   VITE_API_BASE_URL=https://bangrak-food-cultures-api.onrender.com/api
   ```

3. **⚠️ ไฟล์นี้จะถูก .gitignore แล้ว ไม่ต้อง commit!**

### 4.3 Connect GitHub Repository

1. ใน Cloudflare dashboard ไปที่ `Workers & Pages` → `Create Application` → `Pages`
2. กด `Connect to Git`
3. ถ้ายังไม่ได้ install Cloudflare GitHub app:
   - กด `Install GitHub App`
   - Authorize Cloudflare
   - เลือก repo: `bangrak-food-cultures`
   - กด `Install`
4. กลับมาที่ Cloudflare Pages แล้วเลือก repo อีกครั้ง

### 4.4 Config Build Settings

ในหน้า "Begin setup":

```
Project name: bangrak-food-cultures
Production branch: main
Framework preset: Vite
Root directory: frontend
```

Build settings:

```
Build command: npm run build
Build output directory: dist
```

### 4.5 ตั้งค่า Environment Variables

ใน section "Environment variables (preview & production)" กด `+`:

```
Key: VITE_API_BASE_URL
Value: https://bangrak-food-cultures-api.onrender.com/api
```

### 4.6 Deploy

1. กด `Save and Deploy`
2. **รอสักครู่** (ประมาณ 2-3 นาที)
3. เมื่อ deploy เสร็จ จะได้ URL:
   ```
   https://bangrak-food-cultures.pages.dev
   ```

### 4.7 Test Frontend

1. คลิก URL ของ frontend
2. ควรเห็นหน้าเว็บและแผนที่
3. คลิกที่ร้านอาหาร → ควรเห็น popup
4. เปิด Console (F12) → ต้องไม่มี error

---

## STEP 5: Update Backend CORS Configuration

### 5.1 กลับไปที่ Render

1. ไปที่: https://dashboard.render.com
2. เลือก service: `bangrak-food-cultures-api`
3. ไปที่ `Environment`

### 5.2 อัปเดต CORS

แก้ environment variable:

```
Key: CORS_ALLOWED_ORIGINS
Value: https://bangrak-food-cultures.pages.dev
```

หรือถ้าใช้ multiple origins (เช่น custom domain):

```
Value: https://bangrak-food-cultures.pages.dev,https://your-custom-domain.com
```

### 5.3 Redeploy

1. กด `Save Changes`
2. Render จะ auto-deploy ใหม่
3. รอสักครู่ (2-3 นาที)

---

## STEP 6: Setup UptimeRobot (Keep-Alive)

**วัตถุประสงค์:** ป้องกัน backend จากการ sleep (Render free tier จะ sleep ถ้าไม่มี request 15 นาที)

### 6.1 สร้าง UptimeRobot Account

1. ไปที่: https://uptimerobot.com/register
2. กรอก:
   ```
   Email: your-email@example.com
   Password: your-password
   ```
3. ยืนยัน email (ฟรี 100%)

### 6.2 สร้าง Monitor

1. กด `Add New` → `Monitor`
2. ตั้งค่า:

```
Monitor Type: HTTPS
URL: https://bangrak-food-cultures-api.onrender.com/api/health
Friendly Name: Bangrak Food Cultures API
Monitoring Interval: 5 minutes
Alert Contacts: [เลือก email ของคุณ]
```

3. กด `Create Monitor`

**✅ ตอนนี้ backend จะไม่ sleep แล้ว!**

---

## STEP 7: Test ระบบทั้งหมด

### 7.1 Frontend Test

1. เปิด: https://bangrak-food-cultures.pages.dev
2. ตรวจสอบ:
   - [ ] แผนที่แสดง
   - [ ] หมุดร้านอาหารแสดง
   - [ ] คลิกร้านอาหาร → Popup แสดง
   - [ ] Filter ทำงาน
   - [ ] Search ทำงาน
   - [ ] Mobile responsive

### 7.2 Backend Test

```bash
# Test health endpoint
curl https://bangrak-food-cultures-api.onrender.com/api/health

# Test restaurants API
curl https://bangrak-food-cultures-api.onrender.com/api/restaurants

# Test single restaurant (แทน ID ด้วย ID จริง)
curl https://bangrak-food-cultures-api.onrender.com/api/restaurants/1
```

### 7.3 Admin Dashboard Test

1. ไปที่: https://bangrak-food-cultures.pages.dev/admin-secret-dashboard
2. Login ด้วย password ที่ตั้งไว้
3. ทดสอบ:
   - [ ] เพิ่มร้านอาหารใหม่
   - [ ] แก้ไขร้านอาหาร
   - [ ] ลบร้านอาหาร
   - [ ] ปรับ pin position

---

## STEP 8: (Optional) Setup Custom Domain

### 8.1 ซื้อ Domain

ซื้อจากผู้ให้บริการที่ถูกและดี:
- Namecheap: https://www.namecheap.com
- Cloudflare Registrar: https://www.cloudflare.com/products/registrar/

### 8.2 เพิ่ม Domain ใน Cloudflare

1. ใน Cloudflare dashboard → `Workers & Pages`
2. เลือก project: `bangrak-food-cultures`
3. ไปที่ `Custom domains`
4. กด `Set up a custom domain`
5. ใส่ domain: `bangrak-food-cultures.com` (หรือ domain ที่ซื้อ)
6. ตาม instruction ให้ update DNS records

---

## 🎉 สำเร็จแล้ว!

**URL ทั้งหมด:**

- 🌐 **Frontend**: https://bangrak-food-cultures.pages.dev
- 🔧 **Backend**: https://bangrak-food-cultures-api.onrender.com
- 🗄️ **Database**: Supabase Dashboard
- 📊 **Monitoring**: UptimeRobot Dashboard

---

## 📊 Monitoring & Maintenance

### รายวัน

1. **UptimeRobot**: ตรวจสอบว่า backend ยัง up อยู่
2. **Cloudflare Analytics**: ดู traffic และ errors
3. **Render Dashboard**: ตรวจสอบ CPU/RAM usage

### รายสัปดาห์

1. **Database Storage**: ตรวจสอบขนาด database (Supabase Free: 500MB)
2. **Build Minutes**: ตรวจสอบ Cloudflare build minutes (500 นาที/เดือน)
3. **Render Hours**: ตรวจสอบ usage hours (750 ชั่วโมง/เดือน)

### รายเดือน

1. **Review Logs**: ตรวจสอบ error logs ทั้ง backend และ frontend
2. **Performance**: ใช้ Lighthouse ตรวจสอบ performance
3. **Backup**: Export database dump จาก Supabase

---

## 🚨 Troubleshooting

### Problem: Backend ไม่ตอบสนอง

**Solution:**
1. ตรวจสอบ Render dashboard → `Logs`
2. ตรวจสอบ database connection ใน environment variables
3. ตรวจสอบ health check: `/api/health`

### Problem: CORS Error

**Solution:**
1. ตรวจสอบ CORS config ใน backend
2. ตรวจสอบว่า frontend URL ถูกต้อง
3. แก้ `cors.allowed-origins` ใน Render environment variables

### Problem: Frontend build ล้มเหลว

**Solution:**
1. ตรวจสอบ Cloudflare Pages → `Build logs`
2. ตรวจสอบ `package.json` ว่า scripts ถูกต้อง
3. ลอง build local ก่อน: `npm run build`

### Problem: Database connection error

**Solution:**
1. ตรวจสอบ connection string ใน Supabase
2. ตรวจสอบ password ใน Render environment variables
3. ตรวจสอบ Supabase status: https://status.supabase.com

---

## 💰 Cost Summary

| Service | Cost | Limitations |
|---------|------|-------------|
| Cloudflare Pages | **ฟรี** | Unlimited bandwidth |
| Render (Backend) | **ฟรี** | 750 hrs/month, 512MB RAM |
| Supabase (Database) | **ฟรี** | 500MB storage, 60 connections |
| UptimeRobot | **ฟรี** | 50 monitors |
| **TOTAL** | **ฟรี 100%** | ✅ |

---

## 📈 Next Steps (ถ้าต้องการ Scale)

เมื่อมี users เพิ่มขึ้น:

1. **1,000-10,000 users**: Implement caching (Redis Cloud Free)
2. **10,000-100,000 users**: Upgrade เป็น Render Pro ($7/เดือน)
3. **100,000+ users**: เริ่มหารายได้ แล้ว upgrade database

---

**🎉 ขอให้โชคดีกับ deployment!**

มีปัญหาตรงไหน ถามได้เลยครับ! 🚀
