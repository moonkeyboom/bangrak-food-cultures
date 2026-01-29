# Test Supabase Database Connection
# This script tests if the database credentials work

Write-Host "Testing Supabase Database Connection..."
Write-Host ""

$connectionString = "jdbc:postgresql://lzuxhsqrmgorczmyynqa.supabase.co:5432/postgres?user=postgres.lzuxhsqrmgorczmyynqa&password=kittyontherun&sslmode=require"

Write-Host "Connection String:"
Write-Host $connectionString
Write-Host ""

# Check if PostgreSQL client tools are available
Write-Host "Checking for pg_dump or psql..."
$pgInstalled = Get-Command psql -ErrorAction SilentlyContinue

if ($pgInstalled) {
    Write-Host "✅ PostgreSQL client found"
    Write-Host ""
    Write-Host "Testing connection with psql..."
    psql "postgresql://postgres.lzuxhsqrmgorczmyynqa:kittyontherun@lzuxhsqrmgorczmyynqa.supabase.co:5432/postgres" -c "SELECT version();"
} else {
    Write-Host "❌ PostgreSQL client (psql) not found"
    Write-Host ""
    Write-Host "Please test manually:"
    Write-Host "1. Go to Supabase Dashboard: https://supabase.com/dashboard"
    Write-Host "2. Select your project: lzuxhsqrmgorczmyynqa"
    Write-Host "3. Check Database status in Settings → Database"
    Write-Host ""
    Write-Host "Or install PostgreSQL client tools:"
    Write-Host "Windows: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads"
}

Write-Host ""
Write-Host "=== Next Steps ==="
Write-Host "1. Check Supabase Dashboard to verify:"
Write-Host "   - Database is ACTIVE (not paused)"
Write-Host "   - Connection string is correct"
Write-Host "   - No IP whitelist restrictions"
Write-Host ""
Write-Host "2. Try Supabase's Session Mode pooler instead:"
Write-Host "   jdbc:postgresql://aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?user=postgres.lzuxhsqrmgorczmyynqa&password=kittyontherun&sslmode=require"
