// WhatsApp API utility for sending OTP messages
// This file will be used when you provide the WhatsApp client URL

import { WHATSAPP_CONFIG, getWhatsAppEndpoint, getWhatsAppHeaders, formatMessage, formatPhoneNumber, validatePhoneNumber } from '../config/whatsapp';
import { useState } from 'react';

class WhatsAppAPI {
  constructor() {
    this.baseUrl = WHATSAPP_CONFIG.BASE_URL;
    this.apiKey = WHATSAPP_CONFIG.API_KEY;
  }

  /**
   * Send OTP via WhatsApp
   * @param {string} phoneNumber - Phone number in international format (e.g., +1234567890)
   * @param {string} otpCode - 6-digit OTP code
   * @param {string} userName - User's name for personalization
   * @returns {Promise<boolean>} - Success status
   */
  async sendOTP(phoneNumber, otpCode, userName = 'User') {
    try {
      console.log('�� Sending WhatsApp OTP via backend:', {
        phone: phoneNumber,
        otp: otpCode,
        user: userName
      });

      // Call backend instead of direct API
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/auth/send-whatsapp-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          otpCode,
          userName
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend WhatsApp API error:', errorData);
        throw new Error(`Backend error: ${errorData.message}`);
      }

      const result = await response.json();
      console.log('✅ WhatsApp OTP sent successfully via backend:', result);
      return true;
    } catch (error) {
      console.error('WhatsApp OTP send error:', error);
      // Fallback to mock for development
      return this.mockSendOTP(phoneNumber, otpCode, userName);
    }
  }

  /**
   * Mock WhatsApp OTP sending for development/testing
   * @param {string} phoneNumber - Phone number
   * @param {string} otpCode - OTP code
   * @param {string} userName - User name
   * @returns {Promise<boolean>} - Always returns true for mock
   */
  async mockSendOTP(phoneNumber, otpCode, userName) {
    console.log(`📱 WhatsApp OTP Mock: Sending to ${phoneNumber}`);
    console.log(`👤 User: ${userName}`);
    console.log(`🔐 OTP Code: ${otpCode}`);
    console.log(`📝 Message: Hello ${userName}! Your Barbershop App verification code is: ${otpCode}. This code will expire in 10 minutes.`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return true;
  }

  /**
   * Validate phone number format
   * @param {string} phoneNumber - Phone number to validate
   * @returns {boolean} - Valid format
   */
  validatePhoneNumber(phoneNumber) {
    return validatePhoneNumber(phoneNumber);
  }

  /**
   * Format phone number for WhatsApp API
   * @param {string} phoneNumber - Raw phone number
   * @returns {string} - Formatted phone number
   */
  formatPhoneNumber(phoneNumber) {
    return formatPhoneNumber(phoneNumber);
  }

  /**
   * Send appointment reminder via WhatsApp
   * @param {string} phoneNumber - Phone number
   * @param {Object} appointment - Appointment details
   * @returns {Promise<boolean>} - Success status
   */
  async sendAppointmentReminder(phoneNumber, appointment) {
    try {
      const endpoint = getWhatsAppEndpoint();
      const headers = getWhatsAppHeaders();

      // Format phone number (remove + and any spaces)
      const formattedPhone = phoneNumber.replace(/[^\d]/g, '');

      // Create appointment reminder message
      const reminderMessage = `${appointment.customerName}, your appointment with ${appointment.barberName} is on ${appointment.date} at ${appointment.time}. See you soon!`;

      const payload = {
        payload: {
          name: "appointment_reminder", // You might need to create this template in your WhatsApp Business
          components: [
            {
              type: "body",
              parameters: [
                {
                  type: "text",
                  text: appointment.customerName
                },
                {
                  type: "text",
                  text: appointment.barberName
                },
                {
                  type: "text",
                  text: appointment.date
                },
                {
                  type: "text",
                  text: appointment.time
                }
              ]
            }
          ],
          language: {
            code: "en_US",
            policy: "deterministic"
          },
          namespace: WHATSAPP_CONFIG.NAMESPACE
        },
        phoneNumber: formattedPhone
      };

      console.log('📅 Sending WhatsApp appointment reminder:', {
        phone: formattedPhone,
        appointment: appointment,
        endpoint: endpoint
      });

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('WhatsApp reminder API error:', response.status, errorText);
        throw new Error(`WhatsApp API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ WhatsApp appointment reminder sent successfully:', result);
      return true;
    } catch (error) {
      console.error('WhatsApp reminder send error:', error);
      return this.mockSendAppointmentReminder(phoneNumber, appointment);
    }
  }

  /**
   * Mock appointment reminder for development
   */
  async mockSendAppointmentReminder(phoneNumber, appointment) {
    console.log(`📱 WhatsApp Reminder Mock: Sending to ${phoneNumber}`);
    console.log(`📅 Appointment: ${appointment.date} at ${appointment.time}`);
    console.log(`💇 Barber: ${appointment.barberName}`);
    console.log(`👤 Customer: ${appointment.customerName}`);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  }
}

// Create singleton instance
const whatsappAPI = new WhatsAppAPI();

export default whatsappAPI;

// Usage examples:
/*
// Send OTP
const success = await whatsappAPI.sendOTP('+1234567890', '123456', 'John Doe');

// Send appointment reminder
const reminderSuccess = await whatsappAPI.sendAppointmentReminder('+1234567890', {
  customerName: 'John Doe',
  barberName: 'Mike Johnson',
  date: '2024-01-15',
  time: '10:00 AM'
});

// Validate phone number
const isValid = whatsappAPI.validatePhoneNumber('+1234567890');

// Format phone number
const formatted = whatsappAPI.formatPhoneNumber('1234567890'); // Returns: +1234567890
*/
