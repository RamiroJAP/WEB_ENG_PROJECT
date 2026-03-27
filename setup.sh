#!/bin/bash
# Wolves Footwear Store - Setup Script (Mac/Linux)
# Run this after cloning: bash setup.sh

echo "Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "Setup complete! Run 'npm run dev' to start the app."
else
    echo "Setup failed. Please check npm installation."
    exit 1
fi
