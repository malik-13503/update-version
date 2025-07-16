#!/bin/bash

# Create a directory for the package
mkdir -p d4youpromogame

# Copy essential files and directories
cp -r client d4youpromogame/
cp -r server d4youpromogame/
cp -r shared d4youpromogame/
cp -r attached_assets d4youpromogame/

# Copy configuration files
cp package.json d4youpromogame/
cp package-lock.json d4youpromogame/
cp tsconfig.json d4youpromogame/
cp vite.config.ts d4youpromogame/
cp tailwind.config.ts d4youpromogame/
cp postcss.config.js d4youpromogame/
cp components.json d4youpromogame/
cp drizzle.config.ts d4youpromogame/
cp .env.example d4youpromogame/
cp .gitignore d4youpromogame/

# Copy documentation
cp README.md d4youpromogame/
cp RAILWAY_DEPLOYMENT.md d4youpromogame/

# Create the tar.gz archive
tar -czf d4youpromogame.tar.gz d4youpromogame/

# Clean up
rm -rf d4youpromogame/

echo "Package created: d4youpromogame.tar.gz"
echo "Ready for GitHub upload and Railway deployment!"