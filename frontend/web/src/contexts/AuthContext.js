import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import whatsappAPI from '../utils/whatsappApi';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Set default authorization header
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Get current user
  const { data: userData, isLoading: userLoading, error } = useQuery(
    'currentUser',
    () => api.get('/auth/me').then(res => res.data.data.user),
    {
      enabled: !!token,
      retry: false,
      onError: (error) => {
        if (error.response?.status === 401) {
          logout();
        }
      }
    }
  );

  useEffect(() => {
    if (userData) {
      setUser(userData);
    }
    setIsLoading(false);
  }, [userData]);

  // Login mutation
  const loginMutation = useMutation(
    (credentials) => api.post('/auth/login', credentials),
    {
      onSuccess: (response) => {
        const { user: userData, token: newToken } = response.data.data;
        setUser(userData);
        setToken(newToken);
        localStorage.setItem('token', newToken);
        toast.success('Login successful');
        navigate('/');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Login failed';
        toast.error(message);
      }
    }
  );

  // Register mutation
  const registerMutation = useMutation(
    (userData) => api.post('/auth/register', userData),
    {
      onSuccess: (response) => {
        const { user: newUser, token: newToken } = response.data.data;
        setUser(newUser);
        setToken(newToken);
        localStorage.setItem('token', newToken);
        toast.success('Registration successful');
        navigate('/');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Registration failed';
        toast.error(message);
      }
    }
  );

  // Forgot password mutation
  const forgotPasswordMutation = useMutation(
    (email) => api.post('/auth/forgot-password', { email }),
    {
      onSuccess: () => {
        toast.success('Password reset email sent');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to send reset email';
        toast.error(message);
      }
    }
  );

  // Reset password mutation
  const resetPasswordMutation = useMutation(
    ({ token, password }) => api.post('/auth/reset-password', { token, password }),
    {
      onSuccess: () => {
        toast.success('Password reset successful');
        navigate('/login');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Password reset failed';
        toast.error(message);
      }
    }
  );

  // Update password mutation
  const updatePasswordMutation = useMutation(
    (passwords) => api.put('/auth/update-password', passwords),
    {
      onSuccess: () => {
        toast.success('Password updated successfully');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Password update failed';
        toast.error(message);
      }
    }
  );

  // Verify email mutation
  const verifyEmailMutation = useMutation(
    (token) => api.post('/auth/verify-email', { token }),
    {
      onSuccess: () => {
        toast.success('Email verified successfully');
        queryClient.invalidateQueries('currentUser');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Email verification failed';
        toast.error(message);
      }
    }
  );

  // Send OTP mutation
  const sendOTPMutation = useMutation(
    async ({ email, phone, method, userName }) => {
      // Generate 6-digit OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store OTP temporarily (in real app, this would be stored securely on backend)
      sessionStorage.setItem('temp_otp', otpCode);
      sessionStorage.setItem('temp_otp_email', email);
      sessionStorage.setItem('temp_otp_phone', phone);
      sessionStorage.setItem('temp_otp_method', method);
      
      // Send OTP based on method
      if (method === 'whatsapp' && phone) {
        const formattedPhone = whatsappAPI.formatPhoneNumber(phone);
        if (whatsappAPI.validatePhoneNumber(formattedPhone)) {
          await whatsappAPI.sendOTP(formattedPhone, otpCode, userName);
        } else {
          throw new Error('Invalid phone number format');
        }
      } else if (method === 'sms' && phone) {
        // For SMS, you would integrate with SMS service like Twilio
        console.log(`SMS OTP sent to ${phone}: ${otpCode}`);
      } else if (method === 'email' && email) {
        // Send email OTP via backend API
        await api.post('/auth/send-email-otp', {
          email,
          otpCode,
          userName
        });
      }
      
      return { success: true, otp: otpCode };
    },
    {
      onSuccess: (data, variables) => {
        const method = variables.method;
        let message = '';
        switch (method) {
          case 'email':
            message = 'OTP sent to your email address';
            break;
          case 'sms':
            message = 'OTP sent to your phone number via SMS';
            break;
          case 'whatsapp':
            message = 'OTP sent to your WhatsApp number';
            break;
          default:
            message = 'OTP sent successfully';
        }
        toast.success(message);
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to send OTP');
      }
    }
  );

  // Verify OTP mutation
  const verifyOTPMutation = useMutation(
    async ({ otp, email, phone, method }) => {
      const storedOTP = sessionStorage.getItem('temp_otp');
      const storedEmail = sessionStorage.getItem('temp_otp_email');
      const storedPhone = sessionStorage.getItem('temp_otp_phone');
      const storedMethod = sessionStorage.getItem('temp_otp_method');
      
      // Verify OTP
      if (otp !== storedOTP) {
        throw new Error('Invalid OTP code');
      }
      
      // Verify email/phone matches
      if (email && email !== storedEmail) {
        throw new Error('Email mismatch');
      }
      
      if (phone && phone !== storedPhone) {
        throw new Error('Phone number mismatch');
      }
      
      // Clear temporary OTP data
      sessionStorage.removeItem('temp_otp');
      sessionStorage.removeItem('temp_otp_email');
      sessionStorage.removeItem('temp_otp_phone');
      sessionStorage.removeItem('temp_otp_method');
      
      return { success: true };
    },
    {
      onSuccess: () => {
        toast.success('OTP verified successfully');
      },
      onError: (error) => {
        toast.error(error.message || 'OTP verification failed');
      }
    }
  );

  const login = (credentials) => {
    loginMutation.mutate(credentials);
  };

  const register = (userData) => {
    registerMutation.mutate(userData);
  };

  const sendOTP = ({ email, phone, method, userName }) => {
    sendOTPMutation.mutate({ email, phone, method, userName });
  };

  const verifyOTP = ({ otp, email, phone, method }) => {
    verifyOTPMutation.mutate({ otp, email, phone, method });
  };

  const forgotPassword = (email) => {
    forgotPasswordMutation.mutate(email);
  };

  const resetPassword = (token, password) => {
    resetPasswordMutation.mutate({ token, password });
  };

  const updatePassword = (passwords) => {
    updatePasswordMutation.mutate(passwords);
  };

  const verifyEmail = (token) => {
    verifyEmailMutation.mutate(token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    queryClient.clear();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const isAuthenticated = !!user && !!token;
  const isAdmin = user?.role === 'admin';
  const isBarber = user?.role === 'barber';
  const isCustomer = user?.role === 'customer';

  const value = {
    user,
    token,
    isAuthenticated,
    isAdmin,
    isBarber,
    isCustomer,
    isLoading: isLoading || userLoading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updatePassword,
    verifyEmail,
    sendOTP,
    verifyOTP,
    isLoggingIn: loginMutation.isLoading,
    isRegistering: registerMutation.isLoading,
    isResettingPassword: resetPasswordMutation.isLoading,
    isUpdatingPassword: updatePasswordMutation.isLoading,
    isVerifyingEmail: verifyEmailMutation.isLoading,
    isSendingOTP: sendOTPMutation.isLoading,
    isVerifyingOTP: verifyOTPMutation.isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
