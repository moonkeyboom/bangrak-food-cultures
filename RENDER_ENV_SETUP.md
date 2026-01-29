# Render Environment Variables Setup

## Required Environment Variables for bangrak-food-cultures-api

Set these in Render Dashboard: https://dashboard.render.com/

### Database Connection (Choose One Option)

#### Option 1: Direct Connection (RECOMMENDED for stability)
```
SPRING_DATASOURCE_URL=jdbc:postgresql://lzuxhsqrmgorczmyynqa.supabase.co:5432/postgres?user=postgres.lzuxhsqrmgorczmyynqa&password=kittyontherun&sslmode=require
```

#### Option 2: Transaction Pooler (Try if Direct Connection times out)
```
SPRING_DATASOURCE_URL=jdbc:postgresql://aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?user=postgres.lzuxhsqrmgorczmyynqa&password=kittyontherun&sslmode=require
```

**Connection Options Explained:**

| Option | Host | Port | Pros | Cons |
|--------|------|------|------|------|
| Direct Connection | `lzuxhsqrmgorczmyynqa.supabase.co` | 5432 | Stable, persistent connections | May have network issues from Render |
| Transaction Pooler | `aws-0-ap-southeast-1.pooler.supabase.com` | 6543 | Optimized for serverless, stateless | Each request = new connection |
| Session Pooler | `aws-0-ap-southeast-1.pooler.supabase.com` | 5432 | Persistent connections | ❌ Times out after 10 min idle |

**CRITICAL Configuration Notes:**
- **Credentials MUST be embedded in URL** (do NOT set separate SPRING_DATASOURCE_USERNAME/PASSWORD variables)
- **Add `?sslmode=require`** for secure connection
- **NO "db." prefix in hostname** (use `lzuxhsqrmgorczmyynqa.supabase.co` NOT `db.lzuxhsqrmgorczmyynqa.supabase.co`)

**Which to choose?**
- ✅ **Start with Direct Connection** (port 5432) - most stable
- ⚠️ **Try Transaction Pooler** (port 6543) if Direct Connection times out
- ❌ **NEVER use Session Pooler** (port 5432 with pooler) - causes timeout errors

### Spring Configuration

```
SPRING_PROFILES_ACTIVE=production
PORT=8080
```

### Application Security

```
ADMIN_PASSWORD=moomoo
```

### CORS (Optional - for production frontend)

```
CORS_ALLOWED_ORIGINS=https://bangrak-food-cultures-1.vercel.app
```

---

## Deployment Verification

After deployment, check:

1. Health endpoint: `https://bangrak-food-cultures-api.onrender.com/api/health`
2. API endpoint: `https://bangrak-food-cultures-api.onrender.com/api/restaurants`

---

## Connection String Format

### Direct Connection (Port 5432) - BEST FOR STABILITY
```
jdbc:postgresql://lzuxhsqrmgorczmyynqa.supabase.co:5432/postgres?user=postgres.lzuxhsqrmgorczmyynqa&password=YOUR_PASSWORD&sslmode=require
```

### Transaction Pooler (Port 6543) - GOOD FOR SERVERLESS
```
jdbc:postgresql://aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?user=postgres.lzuxhsqrmgorczmyynqa&password=YOUR_PASSWORD&sslmode=require
```

### Session Pooler (Port 5432) - DO NOT USE
```
jdbc:postgresql://aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
```
❌ **Problem**: Closes idle connections after ~10 minutes → HikariCP timeout errors

---

## Troubleshooting

### Backend fails to start - Connection timeout during startup:
```
java.net.SocketTimeoutException: Connect timed out
The connection attempt failed.
```

**Diagnosis Steps:**

1. **Check Supabase Database Status**:
   - Go to https://supabase.com/dashboard
   - Select project: `lzuxhsqrmgorczmyynqa`
   - Check if database is **ACTIVE** (not paused)
   - If paused, click "Resume" to activate it

2. **Verify Connection String**:
   - Go to Supabase: Settings → Database → Connection String
   - Select "JDBC" format
   - Copy the **Direct connection** (not pooler)
   - Verify it matches your Render environment variable

3. **Try Transaction Pooler (if Direct Connection fails)**:
   ```
   SPRING_DATASOURCE_URL=jdbc:postgresql://aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?user=postgres.lzuxhsqrmgorczmyynqa&password=kittyontherun&sslmode=require
   ```
   Transaction pooler is designed for serverless environments like Render.

4. **Test Connection Locally**:
   - Run: `.\test-db-connection.ps1` (in project root)
   - This tests if the database credentials work from your machine
   - If it works locally but not on Render → Network/firewall issue

### Backend fails to start or returns 500 errors:
1. **Check Render logs** for database connection errors
2. **Verify SPRING_DATASOURCE_URL** uses correct hostname (lzuxhsqrmgorczmyynqa.supabase.co - NO "db." prefix!)
3. **Ensure credentials embedded in URL** - remove separate SPRING_DATASOURCE_USERNAME/PASSWORD if set
4. **Check database is active** in Supabase dashboard
5. **Wait 30-60 seconds** for cold start if service was spun down (free tier)

### Connection timeout errors in logs (after startup works):
```
HikariPool-1 - Failed to validate connection
java.net.SocketTimeoutException: Connect timed out
```
**Solution**: You're using Session pooler → Switch to Direct Connection or Transaction Pooler

### HTTP 500 on /api/restaurants but /api/health works:
**Root cause**: Database connection pool exhausted due to timeout errors
**Solution**: Switch from Session pooler to Direct Connection or Transaction Pooler

### UnknownHostException during startup:
```
java.net.UnknownHostException: db.lzuxhsqrmgorczmyynqa.supabase.co
```
**Root cause**: Incorrect hostname with "db." prefix
**Solution**: Remove "db." prefix - use `lzuxhsqrmgorczmyynqa.supabase.co` (NOT `db.lzuxhsqrmgorczmyynqa.supabase.co`)
