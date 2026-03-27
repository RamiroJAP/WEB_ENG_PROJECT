# Wolves Footwear Store - Clone & Setup Script
# Usage: .\clone-and-setup.ps1

param(
    [string]$RepoUrl = "https://github.com/YOUR_USERNAME/WEB_ENG_PROJECT.git",
    [string]$TargetDir = "WEB_ENG_PROJECT"
)

Write-Host "Wolves Footwear Store - Automated Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Clone the repository
Write-Host "Cloning repository..." -ForegroundColor Green
git clone $RepoUrl $TargetDir

if ($LASTEXITCODE -ne 0) {
    Write-Host "Clone failed. Please check the repository URL." -ForegroundColor Red
    exit 1
}

# Navigate to the directory
Set-Location $TargetDir
Write-Host "Navigated to $TargetDir" -ForegroundColor Green

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Green
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "npm install failed." -ForegroundColor Red
    exit 1
}

Write-Host "✓ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Set up git hooks
Write-Host "Setting up git hooks..." -ForegroundColor Green
npx husky install

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠ Husky setup had issues, but dependencies are installed." -ForegroundColor Yellow
} else {
    Write-Host "✓ Git hooks configured" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Run: npm run dev" -ForegroundColor White
Write-Host "  2. Open http://localhost:5173 in your browser" -ForegroundColor White
Write-Host ""
Write-Host "Future pulls and branch checkouts will auto-install dependencies via git hooks." -ForegroundColor Cyan
