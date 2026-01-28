#!/bin/bash

echo "Deploying Frontend to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

# Deploy to Vercel
cd frontend
vercel --prod

echo "Frontend deployed successfully!"
echo "Copy the Vercel URL and update VITE_API_URL in .env.production if needed"
