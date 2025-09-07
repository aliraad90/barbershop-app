const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const generateEmailVerificationToken = () => {
  return jwt.sign({ type: 'email_verification' }, process.env.JWT_SECRET, {
    expiresIn: '24h'
  });
};

const generatePasswordResetToken = () => {
  return jwt.sign({ type: 'password_reset' }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  generateEmailVerificationToken,
  generatePasswordResetToken
};
