#!/bin/bash

echo "Deploying Backend to Render..."

# Check if Render CLI is installed
if ! command -v render &> /dev/null
then
    echo "Render CLI is not installed. Installing..."
    npm install -g @render/cli
fi

# Login to Render
render login

# Deploy to Render
render deploy --service bangrak-food-cultures-api

echo "Backend deployed successfully!"
echo "Copy the Render URL and update environment variables"
