# Barbershop Application

A comprehensive barbershop management application built with React Native, React JS, Node.js, and MongoDB. This application provides a complete solution for barbershop operations including customer management, appointment booking, service management, and more.

## 🚀 Features

### Backend Features
- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Customer, Barber, Admin)
  - Email verification and password reset
  - Secure password hashing with bcrypt

- **User Management**
  - User registration and profile management
  - Address management
  - User preferences and settings
  - Account activation/deactivation

- **Barber Management**
  - Barber profile creation and management
  - Portfolio and gallery management
  - Availability scheduling
  - Specialties and experience tracking
  - Verification system

- **Service Management**
  - Service catalog with categories
  - Pricing and duration management
  - Service-barber associations
  - Popular services tracking

- **Appointment System**
  - Online appointment booking
  - Real-time availability checking
  - Appointment rescheduling and cancellation
  - Status tracking (Pending, Confirmed, Completed, etc.)
  - Email notifications

- **Review System**
  - Customer reviews and ratings
  - Barber responses to reviews
  - Review moderation and reporting
  - Rating aggregation

- **Additional Features**
  - Email notifications with Nodemailer
  - Image upload with Cloudinary
  - Rate limiting and security headers
  - Comprehensive error handling
  - API documentation

### Frontend Features (Web)
- **Modern React Application**
  - React 18 with hooks
  - React Router for navigation
  - Styled Components for styling
  - React Query for data fetching
  - React Hook Form for form management

- **Internationalization**
  - English and Arabic language support
  - RTL (Right-to-Left) layout support
  - Dynamic language switching

- **Theme System**
  - Light and dark theme support
  - CSS custom properties
  - Smooth theme transitions

- **Responsive Design**
  - Mobile-first approach
  - Responsive grid layouts
  - Touch-friendly interface

- **User Interface**
  - Modern, clean design
  - Loading states and error handling
  - Toast notifications
  - Modal dialogs
  - Form validation

### Frontend Features (Mobile - Planned)
- **React Native Application**
  - Cross-platform mobile app
  - Native performance
  - Push notifications
  - Offline support
  - Camera integration for profile pictures

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: Nodemailer
- **File Upload**: Cloudinary
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting

### Frontend (Web)
- **Framework**: React 18
- **Routing**: React Router DOM
- **Styling**: Styled Components
- **State Management**: React Query, Context API
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Icons**: React Icons
- **Internationalization**: React i18next

### Frontend (Mobile - Planned)
- **Framework**: React Native
- **Navigation**: React Navigation
- **State Management**: Redux Toolkit
- **UI Components**: React Native Elements
- **Icons**: React Native Vector Icons

## 📁 Project Structure

```
barbershop-app/
├── backend/
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Utility functions
│   ├── server.js         # Main server file
│   └── package.json      # Backend dependencies
├── frontend/
│   ├── web/              # React web application
│   │   ├── public/       # Static files
│   │   ├── src/
│   │   │   ├── components/   # Reusable components
│   │   │   ├── pages/        # Page components
│   │   │   ├── contexts/     # React contexts
│   │   │   ├── hooks/        # Custom hooks
│   │   │   ├── utils/        # Utility functions
│   │   │   ├── styles/       # Global styles
│   │   │   ├── i18n/         # Internationalization
│   │   │   ├── App.js        # Main app component
│   │   │   └── index.js      # Entry point
│   │   └── package.json      # Frontend dependencies
│   └── mobile/           # React Native app (planned)
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd barbershop-app
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend/web
   npm install
   ```

4. **Environment Setup**
   
   Create a `.env` file in the backend directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/barbershop
   
   # JWT
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   
   # Server
   PORT=5000
   NODE_ENV=development
   
   # Cloudinary (for image uploads)
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   
   # Email (for notifications)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   
   # Frontend URLs
   FRONTEND_WEB_URL=http://localhost:3000
   FRONTEND_MOBILE_URL=http://localhost:8081
   ```

### Running the Application

1. **Start MongoDB**
   ```bash
   mongod
   ```

2. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

3. **Start the frontend development server**
   ```bash
   cd frontend/web
   npm start
   ```

4. **Access the application**
   - Web Application: http://localhost:3000
   - API Server: http://localhost:5000

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/verify-email` - Verify email address
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `PUT /api/auth/update-password` - Update password

### User Endpoints
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin)
- `POST /api/users/:id/addresses` - Add address
- `PUT /api/users/:id/addresses/:addressId` - Update address
- `DELETE /api/users/:id/addresses/:addressId` - Delete address

### Barber Endpoints
- `GET /api/barbers` - Get all barbers
- `GET /api/barbers/:id` - Get barber by ID
- `POST /api/barbers` - Create barber profile
- `PUT /api/barbers/:id` - Update barber profile
- `GET /api/barbers/:id/availability` - Get barber availability
- `POST /api/barbers/:id/portfolio` - Add portfolio item
- `DELETE /api/barbers/:id/portfolio/:itemId` - Remove portfolio item

### Service Endpoints
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID
- `POST /api/services` - Create service (Admin)
- `PUT /api/services/:id` - Update service (Admin)
- `DELETE /api/services/:id` - Delete service (Admin)
- `GET /api/services/categories` - Get service categories
- `GET /api/services/popular` - Get popular services

### Appointment Endpoints
- `GET /api/appointments` - Get appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `PUT /api/appointments/:id/cancel` - Cancel appointment
- `PUT /api/appointments/:id/reschedule` - Reschedule appointment
- `DELETE /api/appointments/:id` - Delete appointment (Admin)

### Review Endpoints
- `GET /api/reviews` - Get all reviews
- `GET /api/reviews/:id` - Get review by ID
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review
- `POST /api/reviews/:id/helpful` - Mark review as helpful
- `POST /api/reviews/:id/response` - Respond to review
- `POST /api/reviews/:id/report` - Report review

## 🎨 UI/UX Features

### Design System
- **Color Palette**: Primary blue, secondary grays, success green, danger red
- **Typography**: Inter font family with multiple weights
- **Spacing**: Consistent spacing scale (0.25rem to 3rem)
- **Border Radius**: Rounded corners for modern look
- **Shadows**: Subtle shadows for depth
- **Transitions**: Smooth animations and transitions

### Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: ARIA labels and semantic HTML
- **Color Contrast**: WCAG AA compliant
- **Focus Indicators**: Clear focus states

## 🔒 Security Features

### Backend Security
- **Authentication**: JWT tokens with expiration
- **Authorization**: Role-based access control
- **Password Security**: bcrypt hashing with salt rounds
- **Input Validation**: Express Validator for all inputs
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS**: Cross-origin resource sharing configuration
- **Helmet**: Security headers
- **SQL Injection**: MongoDB with parameterized queries

### Frontend Security
- **XSS Protection**: Input sanitization
- **CSRF Protection**: SameSite cookies
- **Secure Storage**: Local storage for tokens
- **HTTPS**: SSL/TLS encryption in production

## 🌍 Internationalization

### Supported Languages
- **English (en)**: Default language
- **Arabic (ar)**: RTL support

### Features
- **Dynamic Language Switching**: Real-time language change
- **RTL Support**: Right-to-left layout for Arabic
- **Date/Time Formatting**: Locale-specific formatting
- **Number Formatting**: Locale-specific number formats
- **Currency Display**: Multi-currency support

## 📱 Mobile App (Planned)

### Features
- **Cross-Platform**: iOS and Android support
- **Native Performance**: React Native framework
- **Push Notifications**: Appointment reminders
- **Offline Support**: Cached data for offline use
- **Camera Integration**: Profile picture uploads
- **Location Services**: Find nearby barbershops
- **Biometric Authentication**: Fingerprint/Face ID login

## 🚀 Deployment

### Backend Deployment
1. **Environment Variables**: Set production environment variables
2. **Database**: Set up MongoDB Atlas or self-hosted MongoDB
3. **File Storage**: Configure Cloudinary for image uploads
4. **Email Service**: Set up SMTP service for notifications
5. **Server**: Deploy to Heroku, AWS, or DigitalOcean

### Frontend Deployment
1. **Build**: Create production build
2. **Static Hosting**: Deploy to Netlify, Vercel, or AWS S3
3. **CDN**: Use CloudFront or similar for global distribution
4. **SSL**: Enable HTTPS for security

## 🧪 Testing

### Backend Testing
- **Unit Tests**: Jest for individual functions
- **Integration Tests**: API endpoint testing
- **Database Tests**: MongoDB integration tests

### Frontend Testing
- **Component Tests**: React Testing Library
- **E2E Tests**: Cypress or Playwright
- **Visual Tests**: Storybook for component testing

## 📈 Performance Optimization

### Backend Optimization
- **Database Indexing**: Optimized MongoDB queries
- **Caching**: Redis for session storage
- **Compression**: Gzip compression
- **Rate Limiting**: API throttling

### Frontend Optimization
- **Code Splitting**: Lazy loading of components
- **Image Optimization**: WebP format with fallbacks
- **Bundle Analysis**: Webpack bundle analyzer
- **Caching**: Service worker for offline support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

### Planned Features
- **Mobile App**: React Native application
- **Real-time Chat**: Customer-barber communication
- **Payment Integration**: Stripe/PayPal integration
- **Analytics Dashboard**: Business insights
- **Inventory Management**: Product tracking
- **Loyalty Program**: Customer rewards
- **Multi-location Support**: Multiple barbershop locations
- **Advanced Scheduling**: Recurring appointments
- **Video Consultations**: Remote consultations
- **Social Media Integration**: Share reviews and photos

### Technical Improvements
- **Microservices**: Break down into smaller services
- **GraphQL**: Alternative to REST API
- **WebSocket**: Real-time updates
- **Docker**: Containerization
- **Kubernetes**: Container orchestration
- **CI/CD**: Automated deployment pipeline
- **Monitoring**: Application performance monitoring
- **Logging**: Centralized logging system

---

**Built with ❤️ by the Barbershop Development Team**
