# Barbershop App - Update & Deploy Script
# This script pushes updates to GitHub, which automatically triggers Railway and AWS Amplify deployments

Write-Host "🚀 Starting Barbershop App Update & Deploy Process..." -ForegroundColor Green
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "package.json") -and -not (Test-Path "frontend/web/package.json")) {
    Write-Host "❌ Error: Please run this script from the barbershop-app root directory" -ForegroundColor Red
    exit 1
}

# Check git status
Write-Host "📋 Checking git status..." -ForegroundColor Yellow
git status

Write-Host ""
Write-Host "📝 Adding all changes to git..." -ForegroundColor Yellow
git add .

# Get commit message from user
Write-Host ""
$commitMessage = Read-Host "💬 Enter your commit message (or press Enter for default)"

if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "🔄 Update: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
}

Write-Host ""
Write-Host "💾 Committing changes with message: '$commitMessage'" -ForegroundColor Yellow
git commit -m $commitMessage

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Changes committed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Commit failed. Please check your changes." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🚀 Pushing to GitHub (this will trigger Railway & AWS Amplify deployments)..." -ForegroundColor Yellow
git push origin master

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🎉 SUCCESS! Update pushed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 What happens next:" -ForegroundColor Cyan
    Write-Host "   🔄 Railway will auto-deploy your backend (2-3 minutes)" -ForegroundColor White
    Write-Host "   🔄 AWS Amplify will auto-deploy your frontend (3-5 minutes)" -ForegroundColor White
    Write-Host ""
    Write-Host "🌐 Your live URLs:" -ForegroundColor Cyan
    Write-Host "   Frontend: https://master.dkqmnkxw39wen.amplifyapp.com" -ForegroundColor White
    Write-Host "   Backend:  https://barbershop-app-production.up.railway.app" -ForegroundColor White
    Write-Host ""
    Write-Host "⏱️  Wait 3-5 minutes, then test your app!" -ForegroundColor Yellow
} else {
    Write-Host "❌ Push failed. Please check your git configuration." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✨ Deploy process completed!" -ForegroundColor Green
