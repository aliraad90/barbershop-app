@echo off
cd /d "%~dp0"
set EMAIL_HOST=smtp.gmail.com
set EMAIL_PORT=587
set EMAIL_USER=ccr1036user@gmail.com
set EMAIL_PASS=vcns mcvn uvbd fulo
set MONGODB_URI=mongodb+srv://aliraad90:Google%40%40%24%2411@cluster0.ftkay8w.mongodb.net/barbershop?retryWrites=true&w=majority&appName=Cluster0
set JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production_aws
set FRONTEND_WEB_URL=http://localhost:3000
set PORT=5001
node server.js
pause
