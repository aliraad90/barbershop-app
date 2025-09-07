const nodemailer = require('nodemailer');

const createTransporter = () => {
  console.log('📧 Email Configuration:', {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS ? '***configured***' : 'NOT SET'
  });

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const sendEmail = async (options) => {
  try {
    console.log('📧 Attempting to send email to:', options.email);
    console.log('📧 Subject:', options.subject);
    
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Barbershop App" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html
    };

    console.log('📧 Mail options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    console.error('❌ Full error:', error);
    throw error;
  }
};

const sendWelcomeEmail = async (user) => {
  const subject = 'Welcome to Barbershop App!';
  const message = `
    Hi ${user.firstName},
    
    Welcome to Barbershop App! We're excited to have you on board.
    
    You can now:
    - Book appointments with professional barbers
    - Browse services and prices
    - Manage your profile and preferences
    - Leave reviews and ratings
    
    If you have any questions, feel free to contact our support team.
    
    Best regards,
    The Barbershop Team
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Welcome to Barbershop App!</h2>
      <p>Hi ${user.firstName},</p>
      <p>Welcome to Barbershop App! We're excited to have you on board.</p>
      
      <h3>You can now:</h3>
      <ul>
        <li>Book appointments with professional barbers</li>
        <li>Browse services and prices</li>
        <li>Manage your profile and preferences</li>
        <li>Leave reviews and ratings</li>
      </ul>
      
      <p>If you have any questions, feel free to contact our support team.</p>
      
      <p>Best regards,<br>The Barbershop Team</p>
    </div>
  `;

  return sendEmail({
    email: user.email,
    subject,
    message,
    html
  });
};

const sendEmailVerification = async (user, token) => {
  const verificationUrl = `${process.env.FRONTEND_WEB_URL}/verify-email?token=${token}`;
  
  const subject = 'Verify Your Email Address';
  const message = `
    Hi ${user.firstName},
    
    Please click the link below to verify your email address:
    ${verificationUrl}
    
    This link will expire in 24 hours.
    
    If you didn't create an account, please ignore this email.
    
    Best regards,
    The Barbershop Team
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Verify Your Email Address</h2>
      <p>Hi ${user.firstName},</p>
      <p>Please click the button below to verify your email address:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" 
           style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Verify Email
        </a>
      </div>
      
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't create an account, please ignore this email.</p>
      
      <p>Best regards,<br>The Barbershop Team</p>
    </div>
  `;

  return sendEmail({
    email: user.email,
    subject,
    message,
    html
  });
};

const sendPasswordResetEmail = async (user, token) => {
  const resetUrl = `${process.env.FRONTEND_WEB_URL}/reset-password?token=${token}`;
  
  const subject = 'Password Reset Request';
  const message = `
    Hi ${user.firstName},
    
    You requested a password reset. Please click the link below to reset your password:
    ${resetUrl}
    
    This link will expire in 1 hour.
    
    If you didn't request this, please ignore this email.
    
    Best regards,
    The Barbershop Team
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p>Hi ${user.firstName},</p>
      <p>You requested a password reset. Please click the button below to reset your password:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" 
           style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
      </div>
      
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
      
      <p>Best regards,<br>The Barbershop Team</p>
    </div>
  `;

  return sendEmail({
    email: user.email,
    subject,
    message,
    html
  });
};

const sendOTPEmail = async (email, otpCode, userName = 'User') => {
  const subject = 'Your OTP Code - Barbershop App';
  const message = `
    Hi ${userName},
    
    Your OTP code for Barbershop App login is: ${otpCode}
    
    This code will expire in 10 minutes.
    
    If you didn't request this OTP, please ignore this email.
    
    Best regards,
    The Barbershop Team
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Your OTP Code</h2>
      <p>Hi ${userName},</p>
      <p>Your OTP code for Barbershop App login is:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; display: inline-block;">
          <h1 style="color: #007bff; font-size: 2.5rem; margin: 0; letter-spacing: 5px;">${otpCode}</h1>
        </div>
      </div>
      
      <p style="color: #dc3545; font-weight: bold;">This code will expire in 10 minutes.</p>
      <p>If you didn't request this OTP, please ignore this email.</p>
      
      <p>Best regards,<br>The Barbershop Team</p>
    </div>
  `;

  return sendEmail({
    email,
    subject,
    message,
    html
  });
};

const sendAppointmentConfirmation = async (user, appointment) => {
  const subject = 'Appointment Confirmed';
  const message = `
    Hi ${user.firstName},
    
    Your appointment has been confirmed!
    
    Details:
    - Date: ${appointment.formattedDate}
    - Time: ${appointment.formattedTimeRange}
    - Service: ${appointment.service.name}
    - Barber: ${appointment.barber.fullName}
    - Price: ${appointment.formattedPrice}
    
    Please arrive 10 minutes before your appointment time.
    
    Best regards,
    The Barbershop Team
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Appointment Confirmed</h2>
      <p>Hi ${user.firstName},</p>
      <p>Your appointment has been confirmed!</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3>Appointment Details:</h3>
        <p><strong>Date:</strong> ${appointment.formattedDate}</p>
        <p><strong>Time:</strong> ${appointment.formattedTimeRange}</p>
        <p><strong>Service:</strong> ${appointment.service.name}</p>
        <p><strong>Barber:</strong> ${appointment.barber.fullName}</p>
        <p><strong>Price:</strong> ${appointment.formattedPrice}</p>
      </div>
      
      <p>Please arrive 10 minutes before your appointment time.</p>
      
      <p>Best regards,<br>The Barbershop Team</p>
    </div>
  `;

  return sendEmail({
    email: user.email,
    subject,
    message,
    html
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendEmailVerification,
  sendPasswordResetEmail,
  sendOTPEmail,
  sendAppointmentConfirmation
};
