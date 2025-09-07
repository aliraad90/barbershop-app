# 💇‍♂️ Barbershop App

A modern, full-stack barbershop management application with email and WhatsApp OTP functionality, built with React, Node.js, and MongoDB.

## 🚀 **Features**

### **Authentication & Security**
- ✅ **Email OTP** - Gmail SMTP integration
- ✅ **WhatsApp OTP** - Professional messaging service
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Password Hashing** - bcrypt encryption
- ✅ **Email Verification** - Welcome emails and verification

### **Core Functionality**
- 👤 **User Management** - Customer and barber profiles
- 💇‍♂️ **Barber Profiles** - Skills, ratings, availability
- 📅 **Appointment Booking** - Real-time scheduling
- ⭐ **Reviews & Ratings** - Customer feedback system
- 🛠️ **Service Management** - Haircut services and pricing
- 🌍 **Multi-language** - English and Arabic support
- 🎨 **Responsive Design** - Mobile and desktop optimized

## 🛠️ **Tech Stack**

### **Frontend**
- **React 18** - Modern UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Styled Components** - CSS-in-JS styling
- **i18next** - Internationalization

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **Nodemailer** - Email sending
- **bcrypt** - Password hashing

### **Deployment**
- **AWS Amplify** - Frontend hosting
- **AWS Lambda** - Serverless backend
- **MongoDB Atlas** - Cloud database
- **Docker** - Containerization

## 📱 **OTP Functionality**

### **Email OTP**
- **Provider**: Gmail SMTP
- **Template**: Professional HTML design
- **Features**: 6-digit code, 10-minute expiry
- **Integration**: Seamless registration flow

### **WhatsApp OTP**
- **Provider**: Mohammed Raad API
- **Template**: Business-approved messaging
- **Features**: Button-based verification
- **Fallback**: Mock functionality for development

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+
- MongoDB Atlas account
- Gmail account with app password
- Git

### **Installation**

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd barbershop-app
```

2. **Install dependencies**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend/web
npm install
```

3. **Environment Setup**
```bash
# Backend .env file
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/barbershop
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_password
```

4. **Run the application**
```bash
# Backend (Terminal 1)
cd backend
npm start

# Frontend (Terminal 2)
cd frontend/web
npm start
```

## 🌐 **AWS Amplify Deployment**

### **Frontend Deployment**
1. Push code to Git repository
2. Connect repository to AWS Amplify
3. Configure build settings with `amplify.yml`
4. Deploy automatically

### **Backend Deployment**
- **Option 1**: AWS Lambda (Serverless)
- **Option 2**: AWS App Runner
- **Option 3**: AWS Elastic Beanstalk

## 📧 **Email Configuration**

### **Gmail Setup**
1. Enable 2-Factor Authentication
2. Generate App Password: `qvfa knis kidh jzoz`
3. Configure SMTP settings:
   - Host: `smtp.gmail.com`
   - Port: `587`
   - User: `ccr1036user@gmail.com`

### **Email Templates**
- Welcome email for new users
- Email verification with token
- OTP verification code
- Appointment confirmations

## 📱 **WhatsApp Integration**

### **API Configuration**
- **Endpoint**: `https://api.mohammedraad.iq/whatsapp-api/v1.0/customer/117159/bot/2e156ee9ab3a4369/template`
- **Template**: Professional OTP messaging
- **Features**: Button-based verification

## 🧪 **Testing**

### **Email OTP Test**
1. Go to registration page
2. Enter email address
3. Select "Email OTP" method
4. Check Gmail inbox for OTP code

### **WhatsApp OTP Test**
1. Go to registration page
2. Enter phone number
3. Select "WhatsApp OTP" method
4. Check WhatsApp for OTP message

## 📁 **Project Structure**

```
barbershop-app/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   ├── middleware/      # Express middleware
│   └── server.js        # Main server file
├── frontend/web/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── contexts/    # React contexts
│   │   ├── utils/       # Utility functions
│   │   └── styles/      # Styling
│   └── public/          # Static assets
├── amplify.yml          # AWS Amplify config
├── docker-compose.yml   # Docker configuration
└── README.md           # This file
```

## 🔧 **Environment Variables**

### **Backend (.env)**
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/barbershop
JWT_SECRET=your_jwt_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_password
```

### **Frontend (.env)**
```bash
REACT_APP_API_URL=http://localhost:5000/api
```

## 🚀 **Deployment Options**

### **AWS Amplify (Recommended)**
- Serverless frontend hosting
- Automatic deployments
- Free tier available
- Perfect for React apps

### **AWS Lambda + API Gateway**
- Serverless backend
- Pay per request
- Automatic scaling
- Cost-effective

### **Docker Deployment**
- Containerized application
- Easy scaling
- Production-ready
- Cross-platform

## 📊 **Performance Features**

- **Lazy Loading** - Code splitting for faster loads
- **Caching** - API response caching
- **Compression** - Gzip compression
- **CDN** - Global content delivery
- **Optimization** - Bundle size optimization

## 🔒 **Security Features**

- **JWT Tokens** - Secure authentication
- **Password Hashing** - bcrypt encryption
- **CORS Protection** - Cross-origin security
- **Input Validation** - Data sanitization
- **Rate Limiting** - API protection

## 🌍 **Internationalization**

- **Languages**: English, Arabic
- **RTL Support** - Right-to-left text
- **Dynamic Loading** - Language switching
- **Cultural Adaptation** - Localized content

## 📱 **Mobile Responsiveness**

- **Responsive Design** - All screen sizes
- **Touch Optimization** - Mobile-friendly
- **Progressive Web App** - PWA features
- **Offline Support** - Service workers

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 **License**

This project is licensed under the MIT License.

## 🆘 **Support**

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the deployment guides

## 🎯 **Roadmap**

- [ ] Real-time notifications
- [ ] Payment integration
- [ ] Advanced analytics
- [ ] Mobile app (React Native)
- [ ] Admin dashboard
- [ ] Multi-tenant support

---

**Built with ❤️ for modern barbershops**