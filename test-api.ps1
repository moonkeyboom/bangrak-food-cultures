# Test POST /api/restaurants
$body = @{
    nameTh = "ทดสอบ"
    nameEn = "Test"
    descriptionTh = "ทดสอบระบบ"
    descriptionEn = "Testing system"
    category = "THAI_RESTAURANT"
    subDistrict = "SILOM"
    googleMapsUrl = "https://maps.google.com"
    pinX = 50.0
    pinY = 50.0
    healthFriendly = $false
    heritageRestaurant = $false
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://bangrak-food-cultures-api-1.onrender.com/api/restaurants" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
