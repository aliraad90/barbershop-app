# WhatsApp OTP Integration Guide

This guide explains how to integrate WhatsApp OTP functionality into your Barbershop App.

## 🚀 Features

✅ **Multi-Channel OTP**: Email, SMS, and WhatsApp  
✅ **6-Digit OTP**: Secure verification codes  
✅ **Auto-Focus**: Seamless OTP input experience  
✅ **Resend Timer**: 60-second cooldown between resends  
✅ **Phone Validation**: International phone number support  
✅ **Message Templates**: Customizable WhatsApp messages  
✅ **Mock Mode**: Development-friendly testing  

## 📱 WhatsApp OTP Flow

### Registration Flow:
1. User fills registration form
2. Selects OTP method (Email/SMS/WhatsApp)
3. OTP sent via selected method
4. User enters 6-digit OTP
5. Account verified and created

### Login Flow:
1. User enters email
2. Selects OTP method (Email/SMS/WhatsApp)
3. OTP sent via selected method
4. User enters 6-digit OTP
5. Login successful

## 🔧 Configuration

### ✅ WhatsApp API Setup Complete!

Your WhatsApp API is already configured with your credentials:

#### `src/config/whatsapp.js`
```javascript
export const WHATSAPP_CONFIG = {
  BASE_URL: 'https://api.mohammedraad.iq/whatsapp-api/v1.0',
  CUSTOMER_ID: '117159',
  BOT_ID: '2e156ee9ab3a4369',
  API_KEY: 'cd27a513-20c7-461a-8d26-ccde7c2120cb-IdiuXf5',
  NAMESPACE: '9542c71b_0ef7_4eae_b5bd_ff2a2d7579b2',
  // ... other settings
};
```

#### `src/utils/whatsappApi.js`
The API utility is configured to work with your specific API format.

## 📋 API Endpoint Configuration

Your WhatsApp API endpoint is configured as:

### Send OTP Template
```
POST https://api.mohammedraad.iq/whatsapp-api/v1.0/customer/117159/bot/2e156ee9ab3a4369/template
Content-Type: application/json
Authorization: Basic cd27a513-20c7-461a-8d26-ccde7c2120cb-IdiuXf5

{
  "payload": {
    "name": "otp",
    "components": [
      {
        "type": "body",
        "parameters": [
          {
            "type": "text",
            "text": "123456"
          }
        ]
      },
      {
        "type": "button",
        "sub_type": "url",
        "index": 0,
        "parameters": [
          {
            "type": "text",
            "text": "123456"
          }
        ]
      }
    ],
    "language": {
      "code": "en_US",
      "policy": "deterministic"
    },
    "namespace": "9542c71b_0ef7_4eae_b5bd_ff2a2d7579b2"
  },
  "phoneNumber": "1234567890"
}
```

### Response Format
```json
{
  "success": true,
  "messageId": "msg_123456",
  "status": "sent"
}
```

## 🧪 Testing

### Live WhatsApp API Testing
Your WhatsApp API is now configured and ready for testing:

```javascript
// Console output for real API calls
📱 Sending WhatsApp OTP: {
  phone: "1234567890",
  otp: "123456",
  user: "John Doe",
  endpoint: "https://api.mohammedraad.iq/whatsapp-api/v1.0/customer/117159/bot/2e156ee9ab3a4369/template"
}
✅ WhatsApp OTP sent successfully: { response data }
```

### Test OTP
1. Go to `/register` or `/login`
2. Select "WhatsApp" as OTP method
3. Enter a real phone number (e.g., +1234567890)
4. Check your WhatsApp for the OTP message
5. Enter the received OTP code

## 📞 Phone Number Formats

### Supported Formats:
- `+1234567890` (International)
- `1234567890` (Auto-formatted to +1234567890)
- `+44 20 7946 0958` (UK format)
- `+33 1 42 86 83 26` (French format)

### Validation:
- Must start with `+`
- 10-15 digits total
- Country code validation

## 🎨 UI Components

### OTP Method Selection
```jsx
<OTPMethodContainer>
  <OTPMethodOption selected={otpMethod === 'email'}>
    <FiMail />
    <span>Email</span>
  </OTPMethodOption>
  <OTPMethodOption selected={otpMethod === 'sms'}>
    <FiPhone />
    <span>SMS</span>
  </OTPMethodOption>
  <OTPMethodOption selected={otpMethod === 'whatsapp'}>
    <FaWhatsapp />
    <span>WhatsApp</span>
  </OTPMethodOption>
</OTPMethodContainer>
```

### OTP Input Fields
```jsx
<OTPContainer>
  {otp.map((digit, index) => (
    <OTPInput
      key={index}
      value={digit}
      onChange={(e) => handleOTPChange(index, e.target.value)}
      onKeyDown={(e) => handleOTPKeyDown(index, e)}
    />
  ))}
</OTPContainer>
```

## 🔐 Security Features

### OTP Generation
- 6-digit random numbers
- 10-minute expiration
- Single-use codes
- Secure storage (sessionStorage for demo)

### Rate Limiting
- 60-second resend cooldown
- Maximum 3 attempts per session
- IP-based rate limiting (backend)

### Validation
- Phone number format validation
- Email format validation
- OTP format validation
- Expiration checking

## 📱 Message Templates

### OTP Message
```
Hello {userName}! Your Barbershop App verification code is: {otpCode}. 
This code will expire in 10 minutes. Do not share this code with anyone.
```

### Appointment Reminder
```
Hi {customerName}! This is a reminder for your appointment at {barberName} 
on {date} at {time}. See you soon!
```

## 🚀 Usage Examples

### Send OTP
```javascript
import whatsappAPI from '../utils/whatsappApi';

// Send OTP via WhatsApp
const success = await whatsappAPI.sendOTP(
  '+1234567890',  // Phone number
  '123456',       // OTP code
  'John Doe'      // User name
);
```

### Validate Phone
```javascript
const isValid = whatsappAPI.validatePhoneNumber('+1234567890');
const formatted = whatsappAPI.formatPhoneNumber('1234567890');
```

### Send Appointment Reminder
```javascript
const reminderSuccess = await whatsappAPI.sendAppointmentReminder(
  '+1234567890',
  {
    customerName: 'John Doe',
    barberName: 'Mike Johnson',
    date: '2024-01-15',
    time: '10:00 AM'
  }
);
```

## 🔧 Customization

### Message Templates
Edit `src/config/whatsapp.js`:

```javascript
DEFAULT_SETTINGS: {
  OTP_MESSAGE_TEMPLATE: 'Your custom OTP message: {otpCode}',
  APPOINTMENT_REMINDER_TEMPLATE: 'Custom reminder: {customerName}...',
  // ... other settings
}
```

### Styling
Customize OTP components in:
- `src/pages/Auth/Register.js`
- `src/pages/Auth/Login.js`

### Validation Rules
Modify phone validation in `src/config/whatsapp.js`:

```javascript
PHONE_REGEX: /^\+[1-9]\d{9,14}$/,
SUPPORTED_COUNTRIES: ['US', 'CA', 'GB', ...]
```

## 🐛 Troubleshooting

### Common Issues:

1. **OTP not sending**
   - Check API URL configuration
   - Verify API key
   - Check network connectivity

2. **Invalid phone number**
   - Ensure international format (+1234567890)
   - Check country code support

3. **Mock mode not working**
   - Check console for mock messages
   - Verify environment variables

### Debug Mode:
```javascript
// Enable debug logging
localStorage.setItem('debug', 'whatsapp:*');
```

## 📞 Support

When you provide the WhatsApp client URL:

1. Update `REACT_APP_WHATSAPP_API_URL` in `.env`
2. Update `REACT_APP_WHATSAPP_API_KEY` in `.env`
3. Test with real phone numbers
4. Verify message delivery

## 🎯 Next Steps

1. ✅ **WhatsApp API Configured** - Your API is ready to use
2. **Test Integration** - Try sending OTP to your phone number
3. **Create Templates** - Ensure "otp" template exists in your WhatsApp Business
4. **Deploy** - Go live with WhatsApp OTP

## 📋 WhatsApp Business Template Requirements

Make sure you have these templates created in your WhatsApp Business account:

### OTP Template
- **Name**: `otp`
- **Language**: `en_US`
- **Components**: 
  - Body with OTP parameter
  - Button with OTP parameter
- **Namespace**: `9542c71b_0ef7_4eae_b5bd_ff2a2d7579b2`

### Appointment Reminder Template (Optional)
- **Name**: `appointment_reminder`
- **Language**: `en_US`
- **Components**: Body with customer name, barber name, date, time parameters

---

**🎉 WhatsApp OTP is now fully integrated and ready to use! Test it with your phone number! 🚀**
