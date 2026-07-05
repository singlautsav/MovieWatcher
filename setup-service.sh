#!/bin/bash

# Setup script for MovieWatcher PM2 Service
echo "🚀 Setting up MovieWatcher as a background service..."

# Check if pm2 is installed globally
if ! command -v pm2 &> /dev/null
then
    echo "📦 PM2 is not installed. Installing PM2 globally via npm..."
    npm install -g pm2
else
    echo "✅ PM2 is already installed."
fi

# Ensure dependencies are installed
echo "📦 Installing project dependencies..."
npm install

# Start the application via PM2
echo "⚙️ Starting MovieWatcher via PM2 ecosystem configuration..."
pm2 start ecosystem.config.cjs

# Save the PM2 list so it restarts on system reboot
echo "💾 Saving PM2 process list to persist on reboot..."
pm2 save

# Setup PM2 startup script automatically
echo "🔄 Setting up startup script..."
pm2 startup | tail -n 1 | bash

echo "✅ Success! MovieWatcher is now running in the background."
echo "🌍 You can access it on this device at http://localhost:5173"
echo "📱 You can access it on other devices on your Wi-Fi at http://<YOUR_LOCAL_IP>:5173"
echo "📊 To monitor logs, run: pm2 logs MovieWatcher"
