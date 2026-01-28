# FOOD CULTURES in Bangrak District

Web Application สำหรับแสดงข้อมูลร้านอาหารในเขตบางรัก กรุงเทพมหานคร

## 🎯 Features

- **Custom Interactive Map**: แผนที่ปกติที่สามารถซูม แพน และหมุนได้ พร้อมหมุดระบุตำแหน่งร้านอาหาร
- **Search & Filter**: ค้นหาและกรองร้านอาหารตามประเภท ประเภทอาหาร และแขวง
- **Bilingual**: รองรับ 2 ภาษา (ไทย/อังกฤษ) พร้อมสลับภาษาทันที
- **Mobile-First UX**: ออกแบบมาเพื่อใช้งานบนมือถือเป็นหลัก พร้อม Bottom Sheet style
- **Admin System**: ระบบจัดการร้านอาหาร (Create/Read/Update/Delete)
  - Login ด้วย password เดียว
  - ลากหมุดเพื่อเปลี่ยนตำแหน่ง
  - แก้ไขข้อมูลร้านอาหาร
  - ปรับแต่งแผนที่

## 🛠 Tech Stack

### Frontend
- **React 19.2.0** + TypeScript
- **Tailwind CSS 4.1.18**
- **React Router DOM** (Routing)
- **Lucide React** (Icons)
- **Headless UI** (Components)

### Backend
- **Java Spring Boot 3.2.0**
- **Spring Data JPA**
- **MySQL 8.0**
- **OpenCSV** (CSV Import)

### DevOps
- **Docker** + **Docker Compose**
- **Nginx** (Reverse Proxy & Static Files)

## 📦 Project Structure

```
bangrak-food-cultures/
├── frontend/                 # React + Tailwind CSS
│   ├── src/
│   │   ├── components/      # React Components
│   │   ├── contexts/        # React Contexts
│   │   ├── i18n/           # Translation files
│   │   ├── services/       # API service
│   │   └── types/          # TypeScript types
│   └── public/
│       └── assets/         # Map & Pin images
├── backend/                 # Spring Boot
│   └── src/main/java/
│       ├── controller/     # REST Controllers
│       ├── service/        # Business Logic
│       ├── repository/     # JPA Repositories
│       ├── model/          # JPA Entities
│       └── config/         # Configurations
├── database/               # SQL Schema
├── PrepData/              # CSV Data & Map Images
├── docker-compose.yml     # Docker Compose config
├── Dockerfile.frontend    # Frontend Dockerfile
├── Dockerfile.backend     # Backend Dockerfile
└── nginx.conf            # Nginx configuration
```

## 🚀 Quick Start with Docker

### Prerequisites
- Docker Desktop หรือ Docker Engine ที่ติดตั้งอยู่
- Port 80, 3306, 8080 ว่าง

### 1. Clone & Build

```bash
# Clone repository (or navigate to project directory)
cd bangrak-food-cultures

# Build and start all services
docker-compose up --build
```

### 2. Access Application

- **Main Application**: http://localhost
- **Admin Dashboard**: http://localhost/admin-secret-dashboard
  - Default Password: `admin123`

### 3. Import CSV Data (Optional)

```bash
# Import CSV file to database
curl -X POST http://localhost:8080/api/import/csv \
  -H "Content-Type: application/json" \
  -d "/app/PrepData/Final restaurant list.csv"
```

### 4. Stop Services

```bash
docker-compose down
```

## 💻 Development Setup

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build
```

### Backend Development

```bash
cd backend

# Make sure MySQL is running on localhost:3306

# Run with Maven
mvn spring-boot:run

# Or build JAR
mvn clean package
java -jar target/food-cultures-1.0.0.jar
```

### Database Setup (Local MySQL)

```sql
CREATE DATABASE bangrak_food_cultures;

-- Run schema
mysql -u root -p bangrak_food_cultures < database/schema.sql
```

## 🎨 Theme Colors

- **Tan**: `#D8BA98`
- **Maroon**: `#7F0303`
- **Alabaster**: `#EFE8DF`
- **Light Blue**: `#96C0CE`
- **Midnight Blue**: `#0F414A`

## 📝 API Endpoints

### Restaurants

- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/{id}` - Get restaurant by ID
- `POST /api/restaurants` - Create new restaurant (Admin only)
- `PUT /api/restaurants/{id}` - Update restaurant (Admin only)
- `DELETE /api/restaurants/{id}` - Delete restaurant (Admin only)

### Admin

- `POST /api/admin/login` - Admin login
  - Body: `{ "password": "admin123" }`
  - Returns: `{ "success": true, "token": "..." }`
- `GET /api/admin/verify` - Verify admin token
  - Header: `Authorization: Bearer {token}`

### Import

- `POST /api/import/csv` - Import CSV data
  - Body: CSV file path (string)

## 🔧 Configuration

### Frontend Environment (.env)

```
VITE_API_BASE_URL=http://localhost:8080/api
```

### Backend Configuration (application.properties)

```properties
# Change admin password in production
admin.password=your_secure_password

# Database credentials
spring.datasource.username=root
spring.datasource.password=your_password
```

## 📱 User Guide

### For Users

1. **Search**: ใช้ search bar ด้านบนเพื่อค้นหาร้านอาหาร
2. **Filter**: กดปุ่ม Filter ด้านซ้ายเพื่อกรองตามประเภท
3. **View Details**: แตะที่หมุดร้านอาหารเพื่อดูรายละเอียด
4. **Map Controls**:
   - ซูมเข้า/ออก
   - หมุนแผนที่
   - รีเซ็ตมุมมอง
5. **Google Map**: กดปุ่ม "ดูบน Google Map" เพื่อเปิดใน Google Maps

### For Admins

1. **Login**: เข้า http://localhost/admin-secret-dashboard
2. **Manage Restaurants**:
   - เพิ่มร้านอาหารใหม่
   - แก้ไขข้อมูลร้านอาหาร
   - ลบร้านอาหาร
3. **Position Pins**:
   - แก้ไขร้านอาหาร
   - ปรับ Pin X / Pin Y (0-100)
   - หรือใช้ drag & drop บนแผนที่ (ถ้าเปิดใช้งาน)

## 🗂 Data Source

รายชื่อร้านอาหารมาจากไฟล์: `PrepData/Final restaurant list.csv`

ข้อมูลที่นำเข้า:
- ชื่อร้านอาหาร (ภาษาไทย/อังกฤษ)
- ที่อยู่
- ประเภทร้าน (คาเฟ่/ร้านอาหาร/บาร์)
- ประเภทอาหาร
- แขวงในเขตบางรัก (5 แขวง)
- Google Maps URL
- คำอธิบาย (จากคอลัมน์ "หมายเหตุ")
- ข้อมูลใบอนุญาต

## 🌐 Deployment

### Production Deployment

1. **Update Environment Variables**:
   - Change admin password
   - Update database credentials
   - Configure CORS origins

2. **Build Images**:
   ```bash
   docker-compose build
   ```

3. **Run Production Containers**:
   ```bash
   docker-compose up -d
   ```

4. **Setup SSL/HTTPS**:
   - Use reverse proxy with SSL certificate
   - Update nginx.conf for HTTPS

### Cloud Deployment Options

- **AWS**: ECS + RDS MySQL
- **Google Cloud**: Cloud Run + Cloud SQL
- **Azure**: Container Instances + Azure Database
- **DigitalOcean**: App Platform + Managed Database

## 🔒 Security Notes

- **Admin Password**: ต้องเปลี่ยนรหัสผ่าน Admin ใน production
- **CORS**: ตั้งค่า CORS origins ให้เหมาะสม
- **SQL Injection**: ใช้ JPA Prepared Statements (ปลอดภัยแล้ว)
- **XSS Prevention**: React มีการป้องกัน XSS โดยค่าเริ่มต้น

## 📄 License

This project is proprietary and confidential.

## 👥 Contributors

- Senior Full-Stack Developer & UX/UI Designer

## 📞 Support

For issues or questions, please contact the development team.

---

**เขตบางรัก ประกอบด้วย 5 แขวง:**
1. มหาพฤฒาราม (Maha Phruettharam)
2. สีลม (Silom)
3. สุริยวงศ์ (Suriyawong)
4. บางรัก (Bang Rak)
5. สี่พระยา (Si Phraya)
