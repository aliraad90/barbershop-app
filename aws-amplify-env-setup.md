# AWS Amplify Environment Variables Setup

## 🔧 **Environment Variables for AWS Amplify Console**

### **Frontend Environment Variables:**
In AWS Amplify Console → Environment variables, add:

```bash
REACT_APP_API_URL=https://your-backend-api-gateway-url.amazonaws.com/api
```

### **Backend Environment Variables (for Lambda/API Gateway):**
```bash
# Database
MONGODB_URI=mongodb+srv://aliraad90:Google%40%40%24%2411@cluster0.ftkay8w.mongodb.net/barbershop?retryWrites=true&w=majority&appName=Cluster0
MONGODB_TEST_URI=mongodb+srv://aliraad90:Google%40%40%24%2411@cluster0.ftkay8w.mongodb.net/barbershop_test?retryWrites=true&w=majority&appName=Cluster0

# JWT
JWT_SECRET=barbershop_jwt_secret_2024_aws_amplify_production_key
JWT_EXPIRE=7d

# Server
NODE_ENV=production

# Frontend URLs (Update with your actual Amplify domain)
FRONTEND_WEB_URL=https://main.d1234567890.amplifyapp.com
FRONTEND_MOBILE_URL=https://your-mobile-domain.com

# Gmail Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=ccr1036user@gmail.com
EMAIL_PASS=qvfa knis kidh jzoz
EMAIL_FROM=ccr1036user@gmail.com
EMAIL_FROM_NAME=Barbershop App

# AWS Configuration
AWS_REGION=us-east-1
```

## 📋 **Step-by-Step Setup:**

### **1. Frontend (AWS Amplify Console):**
1. Go to your Amplify app
2. Click "Environment variables"
3. Add: `REACT_APP_API_URL` = `https://your-backend-url.com/api`
4. Save and redeploy

### **2. Backend (AWS Lambda/API Gateway):**
1. Deploy backend using Serverless Framework
2. Set environment variables in Lambda function
3. Update CORS settings for your Amplify domain

### **3. MongoDB Atlas:**
1. Add your AWS server IP to Network Access
2. Or use `0.0.0.0/0` for testing (not recommended for production)

## 🎯 **Important Notes:**

- **Gmail App Password**: `qvfa knis kidh jzoz` (already configured)
- **MongoDB Atlas**: Your connection string is ready
- **WhatsApp API**: External service, no AWS configuration needed
- **JWT Secret**: Change for production security

## ✅ **Ready for Deployment!**
