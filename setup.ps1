# Wolves Footwear Store - Setup Script (Windows)
# Run this after cloning: .\setup.ps1

Write-Host "Installing dependencies..." -ForegroundColor Green
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "Setup complete! Run 'npm run dev' to start the app." -ForegroundColor Green
} else {
    Write-Host "Setup failed. Please check npm installation." -ForegroundColor Red
    exit 1
}
