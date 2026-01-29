# Render Environment Variables Setup

## Required Environment Variables for bangrak-food-cultures-api

Set these in Render Dashboard: https://dashboard.render.com/

### Database Connection (CRITICAL - Use Direct Connection Only)

```
SPRING_DATASOURCE_URL=jdbc:postgresql://db.lzuxhsqrmgorczmyynqa.supabase.co:5432/postgres?user=postgres.lzuxhsqrmgorczmyynqa&password=kittyontherun&sslmode=require
```

**CRITICAL - Read Before Configuring:**
- ✅ **MUST use Direct Connection**: `db.lzuxhsqrmgorczmyynqa.supabase.co:5432`
- ❌ **DO NOT use Session pooler**: `aws-1-ap-southeast-1.pooler.supabase.com:5432` (causes timeout errors after 10-15 min)
- ❌ **DO NOT use Transaction pooler**: `aws-1-ap-southeast-1.pooler.supabase.com:6543`
- **Credentials MUST be embedded in URL** (do NOT set separate SPRING_DATASOURCE_USERNAME/PASSWORD variables)
- **Add `?sslmode=require`** for secure connection

**Why Direct Connection?**
Session pooler closes idle connections after ~10 minutes, causing HikariCP timeout errors:
```
HikariPool-1 - Failed to validate connection (This connection has been closed.)
java.net.SocketTimeoutException: Connect timed out
```

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

### Direct Connection (REQUIRED - No Pooler)
```
jdbc:postgresql://db.lzuxhsqrmgorczmyynqa.supabase.co:5432/postgres?user=postgres.lzuxhsqrmgorczmyynqa&password=YOUR_PASSWORD&sslmode=require
```

### Session Pooler (DO NOT USE - Causes Timeouts)
```
jdbc:postgresql://aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres
```
❌ **Problem**: Closes idle connections after ~10 minutes → HikariCP timeout errors

### Transaction Pooler (DO NOT USE - Not Compatible)
```
jdbc:postgresql://aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres
```
❌ **Problem**: Designed for stateless connections, not compatible with Spring Boot's persistent connections

---

## Troubleshooting

### Backend fails to start or returns 500 errors:
1. **Check Render logs** for database connection errors
2. **Verify SPRING_DATASOURCE_URL** uses Direct Connection (db.lzuxhsqrmgorczmyynqa.supabase.co:5432)
3. **Ensure credentials embedded in URL** - remove separate SPRING_DATASOURCE_USERNAME/PASSWORD if set
4. **Check database is active** in Supabase dashboard
5. **Wait 30-60 seconds** for cold start if service was spun down (free tier)

### Connection timeout errors in logs:
```
HikariPool-1 - Failed to validate connection
java.net.SocketTimeoutException: Connect timed out
```
**Solution**: You're using Session pooler → Switch to Direct Connection

### HTTP 500 on /api/restaurants but /api/health works:
**Root cause**: Database connection pool exhausted due to timeout errors
**Solution**: Switch from Session pooler to Direct Connection (see above)
