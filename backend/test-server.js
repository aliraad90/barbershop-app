const express = require('express');
const cors = require('cors');

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8081'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Test server is running',
    timestamp: new Date().toISOString()
  });
});

// Test auth endpoint
app.post('/api/auth/login', (req, res) => {
  res.json({
    status: 'success',
    message: 'Test login endpoint working',
    data: {
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User'
      },
      token: 'test-token'
    }
  });
});

// Test WhatsApp OTP endpoint
app.post('/api/auth/send-whatsapp-otp', (req, res) => {
  console.log('📱 Test WhatsApp OTP endpoint called:', req.body);
  res.json({
    status: 'success',
    message: 'Test WhatsApp OTP sent successfully',
    data: { test: true }
  });
});

const PORT = 5001;

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
