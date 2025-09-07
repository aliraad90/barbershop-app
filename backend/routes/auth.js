const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Barber = require('../models/Barber');
const { generateToken, generateEmailVerificationToken } = require('../utils/generateToken');
const { sendWelcomeEmail, sendEmailVerification, sendPasswordResetEmail, sendOTPEmail } = require('../utils/sendEmail');
const { protect } = require('../middleware/auth');
const fetch = require('node-fetch'); // Add this line
const router = express.Router();

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', [
  body('firstName').trim().isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
  body('lastName').trim().isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('phone').matches(/^\+?[\d\s-()]+$/).withMessage('Please provide a valid phone number'),
  body('role').optional().isIn(['customer', 'barber']).withMessage('Role must be either customer or barber')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { firstName, lastName, email, password, phone, role = 'customer' } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      role
    });

    // Generate email verification token
    const emailVerificationToken = generateEmailVerificationToken();
    user.emailVerificationToken = emailVerificationToken;
    await user.save();

    // Send welcome email
    try {
      await sendWelcomeEmail(user);
      await sendEmailVerification(user, emailVerificationToken);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail registration if email fails
    }

    // Generate JWT token
    const token = generateToken({ id: user._id });

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isEmailVerified: user.isEmailVerified
        },
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during registration'
    });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'Account is deactivated'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = generateToken({ id: user._id });

    res.json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar,
          isEmailVerified: user.isEmailVerified
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during login'
    });
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Verify email
// @route   POST /api/auth/verify-email
// @access  Public
router.post('/verify-email', [
  body('token').notEmpty().withMessage('Verification token is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { token } = req.body;

    // Find user with this verification token
    const user = await User.findOne({ emailVerificationToken: token });
    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired verification token'
      });
    }

    // Update user
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    res.json({
      status: 'success',
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during email verification'
    });
  }
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found with this email'
      });
    }

    // Generate password reset token
    const resetToken = generateEmailVerificationToken(); // Reusing the same function
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    try {
      await sendPasswordResetEmail(user, resetToken);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to send reset email'
      });
    }

    res.json({
      status: 'success',
      message: 'Password reset email sent'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
router.post('/reset-password', [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { token, password } = req.body;

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired reset token'
      });
    }

    // Update password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({
      status: 'success',
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
router.put('/update-password', protect, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');

    // Check current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        status: 'error',
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      status: 'success',
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});
// @desc    Send Email OTP
// @route   POST /api/auth/send-email-otp
// @access  Public
router.post('/send-email-otp', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('otpCode').notEmpty().withMessage('OTP code is required'),
  body('userName').optional().isString().withMessage('User name must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, otpCode, userName = 'User' } = req.body;

    console.log('📧 Backend sending Email OTP:', {
      email,
      otp: otpCode,
      user: userName
    });

    // Check environment variables
    console.log('🔧 Environment Check:', {
      EMAIL_HOST: process.env.EMAIL_HOST,
      EMAIL_PORT: process.env.EMAIL_PORT,
      EMAIL_USER: process.env.EMAIL_USER,
      EMAIL_PASS: process.env.EMAIL_PASS ? 'SET' : 'NOT SET'
    });

    // Send OTP email
    await sendOTPEmail(email, otpCode, userName);

    console.log('✅ Email OTP sent successfully to:', email);

    res.json({
      status: 'success',
      message: 'Email OTP sent successfully',
      data: { email, otpCode }
    });

  } catch (error) {
    console.error('❌ Email OTP send error:', error.message);
    console.error('❌ Full error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to send email OTP',
      error: error.message
    });
  }
});

// @desc    Send WhatsApp OTP
// @route   POST /api/auth/send-whatsapp-otp
// @access  Public
router.post('/send-whatsapp-otp', async (req, res) => {
  try {
    const { phoneNumber, otpCode, userName } = req.body;

    // WhatsApp API configuration
    const endpoint = 'https://api.mohammedraad.iq/whatsapp-api/v1.0/customer/117159/bot/2e156ee9ab3a4369/template';
    
    // Format phone number (remove + and any spaces)
    const formattedPhone = phoneNumber.replace(/[^\d]/g, '');

    const payload = {
      payload: {
        name: "otp",
        components: [
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: otpCode
              }
            ]
          },
          {
            type: "button",
            sub_type: "url",
            index: 0,
            parameters: [
              {
                type: "text",
                text: otpCode
              }
            ]
          }
        ],
        language: {
          code: "en_US",
          policy: "deterministic"
        },
        namespace: "9542c71b_0ef7_4eae_b5bd_ff2a2d7579b2"
      },
      phoneNumber: formattedPhone
    };

    console.log('📱 Backend sending WhatsApp OTP:', {
      phone: formattedPhone,
      otp: otpCode,
      user: userName
    });

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic cd27a513-20c7-461a-8d26-ccde7c2120cb-IdiuXf5'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('WhatsApp API error:', response.status, errorText);
      return res.status(400).json({
        status: 'error',
        message: 'Failed to send WhatsApp OTP',
        error: errorText
      });
    }

    const result = await response.json();
    console.log('✅ WhatsApp OTP sent successfully:', result);

    res.json({
      status: 'success',
      message: 'WhatsApp OTP sent successfully',
      data: result
    });

  } catch (error) {
    console.error('WhatsApp OTP send error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
});
module.exports = router;
