#!/bin/bash

echo "==================================="
echo "Bangrak Food Cultures Deployment"
echo "==================================="

# Step 1: Deploy Frontend to Vercel
echo ""
echo "Step 1: Deploying Frontend to Vercel..."
echo "1. Go to https://vercel.com/new"
echo "2. Import your GitHub repository"
echo "3. Select 'frontend' as root directory"
echo "4. Click Deploy"
echo ""
read -p "Press Enter after deploying frontend to Vercel..."

# Step 2: Deploy Backend to Render
echo ""
echo "Step 2: Deploying Backend to Render..."
echo "1. Go to https://dashboard.render.com/select-repo"
echo "2. Connect your GitHub repository"
echo "3. Select 'Web Service'"
echo "4. Select Docker environment"
echo "5. Set Dockerfile path to 'Dockerfile.backend'"
echo "6. Click Deploy"
echo ""
read -p "Press Enter after deploying backend to Render..."

# Step 3: Setup Database (Supabase)
echo ""
echo "Step 3: Setting up Database (Supabase)..."
echo "1. Go to https://supabase.com"
echo "2. Create a new project"
echo "3. Go to SQL Editor"
echo "4. Run the SQL from database/schema-postgresql.sql"
echo "5. Copy the database connection string"
echo ""
read -p "Press Enter after setting up database..."

# Step 4: Configure Environment Variables
echo ""
echo "Step 4: Configuring Environment Variables..."
echo "Frontend URL: "
read -p "Enter your Vercel frontend URL: " FRONTEND_URL

echo "Backend URL: "
read -p "Enter your Render backend URL: " BACKEND_URL

echo "Database URL: "
read -p "Enter your Supabase database URL: " DATABASE_URL

echo "Admin Password: "
read -p "Enter your admin password: " ADMIN_PASSWORD

# Update backend environment variables
echo ""
echo "Add these environment variables to your Render service:"
echo "SPRING_DATASOURCE_URL=jdbc:postgresql://$DATABASE_URL"
echo "SPRING_DATASOURCE_USERNAME=postgres"
echo "SPRING_DATASOURCE_PASSWORD=[your-supabase-password]"
echo "ADMIN_PASSWORD=$ADMIN_PASSWORD"
echo "SPRING_PROFILES_ACTIVE=production"
echo ""

# Update frontend environment
echo "Update frontend/.env.production:"
echo "VITE_API_URL=$BACKEND_URL"
echo ""

# Step 5: Final deployment
echo ""
echo "Step 5: Final Deployment..."
echo "1. Update environment variables in Render dashboard"
echo "2. Re-deploy backend from Render dashboard"
echo "3. Update frontend/.env.production and push to GitHub"
echo "4. Vercel will auto-deploy the changes"
echo ""

echo "Deployment Complete!"
echo "Frontend: $FRONTEND_URL"
echo "Backend: $BACKEND_URL"
echo ""
echo "Test your deployment:"
echo "- Open frontend URL in browser"
echo "- Check API health: $BACKEND_URL/api/health"
echo "- Login to admin dashboard"
echo ""
