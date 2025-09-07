# 🚀 Complete AWS Amplify Deployment Guide

## **Step 1: Create GitHub Repository**

### **1.1 Go to GitHub**
1. Open [GitHub.com](https://github.com) in your browser
2. Sign in with your account
3. Click the **"+"** button in the top right corner
4. Select **"New repository"**

### **1.2 Repository Settings**
- **Repository name**: `barbershop-app`
- **Description**: `Modern barbershop management app with email and WhatsApp OTP`
- **Visibility**: **Public** (for free hosting)
- **Initialize**: ❌ **DO NOT** check "Add a README file" (we already have one)
- **Initialize**: ❌ **DO NOT** check "Add .gitignore" (we already have one)
- **Initialize**: ❌ **DO NOT** check "Choose a license"

### **1.3 Create Repository**
Click **"Create repository"**

## **Step 2: Push Your Code to GitHub**

### **2.1 Copy the Repository URL**
After creating the repository, GitHub will show you commands. Copy the HTTPS URL that looks like:
```
https://github.com/yourusername/barbershop-app.git
```

### **2.2 Push Your Code**
Run these commands in your terminal (in the barbershop-app directory):

```bash
# Add remote repository
git remote add origin https://github.com/yourusername/barbershop-app.git

# Push your code
git push -u origin master
```

## **Step 3: Deploy to AWS Amplify**

### **3.1 Go to AWS Amplify Console**
1. Open [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Sign in with your AWS account (`aliraad90@gmail.com`)
3. Click **"New app"**
4. Select **"Host web app"**

### **3.2 Connect Repository**
1. Choose **"GitHub"** as your source
2. Click **"Connect branch"**
3. Authorize AWS Amplify to access your GitHub account
4. Select your repository: `barbershop-app`
5. Select branch: `master`
6. Click **"Next"**

### **3.3 Configure Build Settings**
AWS Amplify will automatically detect the `amplify.yml` file. You should see:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - echo "Installing frontend dependencies..."
        - cd frontend/web
        - npm ci
    build:
      commands:
        - echo "Building frontend..."
        - npm run build
  artifacts:
    baseDirectory: frontend/web/build
    files:
      - '**/*'
```

Click **"Next"**

### **3.4 Environment Variables**
Add these environment variables:

**Key**: `REACT_APP_API_URL`
**Value**: `https://your-backend-url.com/api` (we'll update this after backend deployment)

Click **"Next"**

### **3.5 Review and Deploy**
1. Review your settings
2. Click **"Save and deploy"**
3. Wait for the build to complete (5-10 minutes)

## **Step 4: Deploy Backend (Choose One Option)**

### **Option A: AWS Lambda (Recommended - Serverless)**

#### **4A.1 Install Serverless Framework**
```bash
# Install globally
npm install -g serverless

# Install serverless-offline plugin
npm install --save-dev serverless-offline
```

#### **4A.2 Deploy Backend**
```bash
# Go to backend directory
cd backend

# Deploy to AWS
serverless deploy
```

#### **4A.3 Get Backend URL**
After deployment, you'll get a URL like:
```
https://abc123def4.execute-api.us-east-1.amazonaws.com/dev
```

### **Option B: AWS App Runner (Easier)**

#### **4B.1 Create App Runner Service**
1. Go to [AWS App Runner Console](https://console.aws.amazon.com/apprunner/)
2. Click **"Create service"**
3. Choose **"Source code repository"**
4. Connect your GitHub repository
5. Select `barbershop-app/backend`
6. Configure build settings:
   - **Build command**: `npm install`
   - **Start command**: `npm start`
7. Set environment variables (same as above)
8. Click **"Create & deploy"**

### **Option C: AWS Elastic Beanstalk (Traditional)**

#### **4C.1 Create Elastic Beanstalk Application**
1. Go to [AWS Elastic Beanstalk Console](https://console.aws.amazon.com/elasticbeanstalk/)
2. Click **"Create application"**
3. Choose **"Web server environment"**
4. Upload your backend code as a ZIP file
5. Configure environment variables
6. Deploy

## **Step 5: Update Frontend API URL**

### **5.1 Get Your Backend URL**
After backend deployment, copy your backend URL.

### **5.2 Update Amplify Environment Variables**
1. Go back to AWS Amplify Console
2. Click on your app
3. Go to **"Environment variables"**
4. Update `REACT_APP_API_URL` with your backend URL
5. Click **"Save"**
6. Click **"Redeploy this version"**

## **Step 6: Configure MongoDB Atlas**

### **6.1 Update Network Access**
1. Go to [MongoDB Atlas Console](https://cloud.mongodb.com/)
2. Go to **"Network Access"**
3. Click **"Add IP Address"**
4. Add your AWS server IP or use `0.0.0.0/0` for testing
5. Click **"Confirm"**

### **6.2 Test Connection**
Your backend should now connect to MongoDB Atlas successfully.

## **Step 7: Test Your Application**

### **7.1 Get Your App URL**
1. Go to AWS Amplify Console
2. Click on your app
3. Copy the app URL (e.g., `https://main.d1234567890.amplifyapp.com`)

### **7.2 Test OTP Functionality**
1. Open your app URL
2. Go to registration page
3. Test email OTP with `aliraad90@gmail.com`
4. Test WhatsApp OTP with your phone number
5. Complete registration process

## **Step 8: Domain Setup (Optional)**

### **8.1 Custom Domain**
1. In Amplify Console, go to **"Domain management"**
2. Click **"Add domain"**
3. Enter your custom domain
4. Follow DNS configuration instructions
5. Wait for SSL certificate (up to 24 hours)

## **🎯 Expected Results**

After deployment, you should have:
- ✅ **Frontend**: `https://main.d1234567890.amplifyapp.com`
- ✅ **Backend**: `https://abc123def4.execute-api.us-east-1.amazonaws.com/dev`
- ✅ **Email OTP**: Working with Gmail SMTP
- ✅ **WhatsApp OTP**: Working with external API
- ✅ **Database**: Connected to MongoDB Atlas
- ✅ **Authentication**: JWT tokens working

## **💰 Cost Estimate**

- **AWS Amplify**: Free tier (1GB storage, 15GB bandwidth/month)
- **AWS Lambda**: ~$0-5/month for testing
- **MongoDB Atlas**: Free tier available
- **Total**: ~$0-10/month for testing

## **🆘 Troubleshooting**

### **Common Issues:**
1. **Build fails**: Check `amplify.yml` configuration
2. **API not working**: Verify environment variables
3. **Database connection fails**: Check MongoDB Atlas network access
4. **Email not sending**: Verify Gmail app password

### **Support:**
- Check AWS Amplify build logs
- Check backend logs in CloudWatch
- Verify environment variables
- Test API endpoints manually

## **✅ Success!**

Your barbershop app is now live on AWS Amplify with:
- Modern React frontend
- Serverless backend
- Email and WhatsApp OTP
- MongoDB Atlas database
- Professional deployment

**Congratulations! 🎉**
