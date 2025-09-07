// WhatsApp API Configuration
// Update these values when you provide the WhatsApp client URL

export const WHATSAPP_CONFIG = {
  // WhatsApp API Base URL
  BASE_URL: 'https://api.mohammedraad.iq/whatsapp-api/v1.0',
  
  // API Credentials
  CUSTOMER_ID: '117159',
  BOT_ID: '2e156ee9ab3a4369',
  API_KEY: 'cd27a513-20c7-461a-8d26-ccde7c2120cb-IdiuXf5',
  NAMESPACE: '9542c71b_0ef7_4eae_b5bd_ff2a2d7579b2',
  
  // Default settings
  DEFAULT_SETTINGS: {
    // Message template for OTP
    OTP_MESSAGE_TEMPLATE: 'Hello {userName}! Your Barbershop App verification code is: {otpCode}. This code will expire in 10 minutes. Do not share this code with anyone.',
    
    // Message template for appointment reminders
    APPOINTMENT_REMINDER_TEMPLATE: 'Hi {customerName}! This is a reminder for your appointment at {barberName} on {date} at {time}. See you soon!',
    
    // OTP expiration time in minutes
    OTP_EXPIRY_MINUTES: 10,
    
    // Resend cooldown in seconds
    RESEND_COOLDOWN_SECONDS: 60,
    
    // Phone number validation regex
    PHONE_REGEX: /^\+[1-9]\d{9,14}$/,
    
    // Supported countries (ISO codes)
    SUPPORTED_COUNTRIES: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'SE', 'NO', 'DK', 'FI', 'PL', 'CZ', 'HU', 'RO', 'BG', 'HR', 'SI', 'SK', 'LT', 'LV', 'EE', 'IE', 'PT', 'GR', 'CY', 'MT', 'LU', 'IS', 'LI', 'MC', 'SM', 'VA', 'AD', 'BR', 'MX', 'AR', 'CL', 'CO', 'PE', 'VE', 'UY', 'PY', 'BO', 'EC', 'GY', 'SR', 'GF', 'FK', 'IN', 'CN', 'JP', 'KR', 'SG', 'MY', 'TH', 'VN', 'ID', 'PH', 'TW', 'HK', 'MO', 'NZ', 'ZA', 'NG', 'KE', 'GH', 'EG', 'MA', 'TN', 'DZ', 'LY', 'SD', 'ET', 'UG', 'TZ', 'ZW', 'BW', 'NA', 'ZM', 'MW', 'MZ', 'AO', 'CM', 'CI', 'SN', 'ML', 'BF', 'NE', 'TD', 'CF', 'GA', 'CG', 'CD', 'RW', 'BI', 'DJ', 'SO', 'ER', 'SS', 'GM', 'GN', 'GW', 'LR', 'SL', 'TG', 'BJ', 'MR', 'CV', 'ST', 'GQ', 'SC', 'KM', 'MG', 'MU', 'RE', 'YT', 'SH', 'AC', 'TA', 'IO', 'CX', 'CC', 'NF', 'HM', 'AQ', 'BV', 'GS', 'TF', 'UM', 'AS', 'GU', 'MP', 'PR', 'VI', 'VG', 'AI', 'AW', 'BB', 'BZ', 'BM', 'KY', 'CR', 'CU', 'DM', 'DO', 'SV', 'GD', 'GT', 'HN', 'JM', 'KN', 'LC', 'NI', 'PA', 'TT', 'TC', 'AG', 'BS', 'VC', 'PM', 'MS', 'BL', 'MF', 'SX', 'CW', 'BQ', 'GL', 'PF', 'NC', 'VU', 'FJ', 'PG', 'SB', 'TO', 'TV', 'WS', 'KI', 'NR', 'FM', 'MH', 'PW', 'CK', 'NU', 'TK', 'WF', 'WS', 'KI', 'NR', 'FM', 'MH', 'PW', 'CK', 'NU', 'TK', 'WF']
  }
};

// Helper function to get WhatsApp API endpoint
export const getWhatsAppEndpoint = () => {
  return `${WHATSAPP_CONFIG.BASE_URL}/customer/${WHATSAPP_CONFIG.CUSTOMER_ID}/bot/${WHATSAPP_CONFIG.BOT_ID}/template`;
};

// Helper function to get API headers
export const getWhatsAppHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${WHATSAPP_CONFIG.API_KEY}`,
  };
};

// Message template formatter
export const formatMessage = (template, variables) => {
  let message = template;
  Object.keys(variables).forEach(key => {
    const placeholder = `{${key}}`;
    message = message.replace(new RegExp(placeholder, 'g'), variables[key]);
  });
  return message;
};

// Phone number formatter
export const formatPhoneNumber = (phoneNumber) => {
  // Remove all non-digit characters
  const digits = phoneNumber.replace(/\D/g, '');
  
  // Add + if not present
  if (!phoneNumber.startsWith('+')) {
    return `+${digits}`;
  }
  
  return phoneNumber;
};

// Phone number validator
export const validatePhoneNumber = (phoneNumber) => {
  const cleaned = phoneNumber.replace(/[^\d+]/g, '');
  return WHATSAPP_CONFIG.DEFAULT_SETTINGS.PHONE_REGEX.test(cleaned);
};

// Country code extractor
export const extractCountryCode = (phoneNumber) => {
  const cleaned = phoneNumber.replace(/[^\d+]/g, '');
  const match = cleaned.match(/^\+(\d{1,3})/);
  return match ? match[1] : null;
};

// Usage examples:
/*
import { WHATSAPP_CONFIG, getWhatsAppEndpoint, getWhatsAppHeaders, formatMessage } from './whatsapp';

// Get endpoint
const endpoint = getWhatsAppEndpoint('/send-message');

// Get headers
const headers = getWhatsAppHeaders();

// Format message
const message = formatMessage(WHATSAPP_CONFIG.DEFAULT_SETTINGS.OTP_MESSAGE_TEMPLATE, {
  userName: 'John Doe',
  otpCode: '123456'
});
*/
