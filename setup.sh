#!/bin/bash
# Wolves Footwear Store - Setup Script (Mac/Linux)
# Run this after cloning: bash setup.sh

echo -e "\033[36mWolves Footwear Store - Setup\033[0m"
echo "============================="
echo ""

echo -e "\033[32mInstalling dependencies...\033[0m"
npm install

if [ $? -eq 0 ]; then
    echo -e "\033[32m✓ Dependencies installed\033[0m"
    
    echo -e "\033[32mSetting up git hooks...\033[0m"
    npx husky install
    
    if [ $? -eq 0 ]; then
        echo -e "\033[32m✓ Git hooks configured\033[0m"
        echo ""
        echo -e "\033[32mSetup complete! You're ready to go.\033[0m"
        echo ""
        echo -e "\033[33mStart development:\033[0m"
        echo -e "  npm run dev"
        echo ""
        echo -e "\033[36mFuture git operations will auto-install dependencies.\033[0m"
    else
        echo -e "\033[33m⚠ Husky setup had issues, but dependencies are installed.\033[0m"
    fi
else
    echo -e "\033[31m✗ Setup failed. Please check npm installation.\033[0m"
    exit 1
fi
