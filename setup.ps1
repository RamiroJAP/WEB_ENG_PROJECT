# Wolves Footwear Store - Setup Script (Windows)
# Run this after cloning: .\setup.ps1

Write-Host "Wolves Footwear Store - Setup" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Installing dependencies..." -ForegroundColor Green
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dependencies installed" -ForegroundColor Green
    
    Write-Host "Setting up git hooks..." -ForegroundColor Green
    npx husky install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Git hooks configured" -ForegroundColor Green
        Write-Host ""
        Write-Host "Setup complete! You're ready to go." -ForegroundColor Green
        Write-Host ""
        Write-Host "Start development:" -ForegroundColor Yellow
        Write-Host "  npm run dev" -ForegroundColor White
        Write-Host ""
        Write-Host "Future git operations will auto-install dependencies." -ForegroundColor Cyan
    } else {
        Write-Host "⚠ Husky setup had issues, but dependencies are installed." -ForegroundColor Yellow
    }
} else {
    Write-Host "✗ Setup failed. Please check npm installation." -ForegroundColor Red
    exit 1
}
