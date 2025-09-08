@echo off
echo.
echo 🚀 Barbershop App - Quick Update & Deploy
echo ========================================
echo.

REM Check if we're in the right directory
if not exist "frontend\web\package.json" (
    echo ❌ Error: Please run this script from the barbershop-app root directory
    pause
    exit /b 1
)

echo 📋 Checking git status...
git status
echo.

echo    Adding all changes to git...
git add .
echo.

set /p commitMessage="💬 Enter your commit message (or press Enter for default): "

if "%commitMessage%"=="" (
    set commitMessage=🔄 Update: %date% %time%
)

echo.
echo    Committing changes with message: "%commitMessage%"
git commit -m "%commitMessage%"

if %errorlevel% neq 0 (
    echo ❌ Commit failed. Please check your changes.
    pause
    exit /b 1
)

echo ✅ Changes committed successfully!
echo.

echo 🚀 Pushing to GitHub (this will trigger Railway & AWS Amplify deployments)...
git push origin master

if %errorlevel% neq 0 (
    echo ❌ Push failed. Please check your git configuration.
    pause
    exit /b 1
)

echo.
echo 🎉 SUCCESS! Update pushed to GitHub!
echo.
echo 📋 What happens next:
echo    🔄 Railway will auto-deploy your backend (2-3 minutes)
echo    🔄 AWS Amplify will auto-deploy your frontend (3-5 minutes)
echo.
echo 🌐 Your live URLs:
echo    Frontend: https://master.dkqmnkxw39wen.amplifyapp.com
echo    Backend:  https://barbershop-app-production.up.railway.app
echo.
echo ⏱️  Wait 3-5 minutes, then test your app!
echo.
echo ✨ Deploy process completed!
echo.
pause