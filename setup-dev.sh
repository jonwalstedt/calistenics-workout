#!/bin/bash

# Setup script for development environment

echo "Setting up development environment for Calisthenics Workout App..."

# Ensure npm uses legacy-peer-deps globally for this project
echo "Configuring npm..."
npm config set legacy-peer-deps true

# Install dependencies with legacy-peer-deps
echo "Installing dependencies..."
npm ci --legacy-peer-deps

# Verify configuration
echo "Verifying configuration..."
echo "npm config:"
npm config list | grep "legacy-peer-deps"

echo "Setup complete! You can now start development with:"
echo "npm run dev" 