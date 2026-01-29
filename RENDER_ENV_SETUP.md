# Render Environment Variables Setup

## Required Environment Variables for bangrak-food-cultures-api

Set these in Render Dashboard: https://dashboard.render.com/

### Database Connection (CRITICAL - Use Direct Connection)

```
SPRING_DATASOURCE_URL=jdbc:postgresql://db.lzuxhsqrmgorczmyynqa.supabase.co:5432/postgres
SPRING_DATASOURCE_USERNAME=postgres.lzuxhsqrmgorczmyynqa
SPRING_DATASOURCE_PASSWORD=kittyontherun
```

**IMPORTANT:**
- ✅ Use **Direct Connection** (port 5432): `db.lzuxhsqrmgorczmyynqa.supabase.co:5432`
- ❌ DO NOT use Connection Pooler (port 6543): `aws-1-ap-southeast-1.pooler.supabase.com:6543`
- Connection pooler may cause timeouts with long-running queries

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

### Direct Connection (RECOMMENDED)
```
jdbc:postgresql://db.lzuxhsqrmgorczmyynqa.supabase.co:5432/postgres
```

### Connection Pooler (NOT RECOMMENDED)
```
jdbc:postgresql://aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres
```

---

## Troubleshooting

If backend fails to start:
1. Check Render logs for database connection errors
2. Verify SPRING_DATASOURCE_URL uses port 5432 (not 6543)
3. Verify credentials match Supabase dashboard
4. Check database is active in Supabase
