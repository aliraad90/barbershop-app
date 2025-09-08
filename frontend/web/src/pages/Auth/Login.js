import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft, FiSmartphone, FiPhone, FiChevronDown } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { countryCodes } from '../../data/countryCodes';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  padding: var(--spacing-lg);
`;

const LoginCard = styled.div`
  background-color: var(--bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-2xl);
  width: 100%;
  max-width: 450px;
  position: relative;
`;

const BackButton = styled(Link)`
  position: absolute;
  top: var(--spacing-lg);
  left: var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  transition: color var(--transition-fast);
  
  &:hover {
    color: var(--primary);
  }
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-2xl);
`;

const LoginTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
`;

const LoginSubtitle = styled.p`
  color: var(--text-secondary);
  font-size: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const Label = styled.label`
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.875rem;
`;

const InputGroup = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input.withConfig({
  shouldForwardProp: (prop) => prop !== 'hasIcon',
})`
  width: 100%;
  padding: var(--spacing-md);
  padding-left: ${props => props.hasIcon ? '3rem' : 'var(--spacing-md)'};
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 1rem;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  transition: all var(--transition-fast);
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
  
  &.error {
    border-color: var(--danger);
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: var(--spacing-md);
  color: var(--text-secondary);
  font-size: 1.125rem;
  z-index: 1;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: var(--spacing-md);
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 1.125rem;
  transition: color var(--transition-fast);
  
  &:hover {
    color: var(--text-primary);
  }
`;

const ErrorMessage = styled.span`
  color: var(--danger);
  font-size: 0.875rem;
  margin-top: var(--spacing-xs);
`;

const OTPContainer = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  justify-content: center;
  margin: var(--spacing-lg) 0;
`;

const OTPInput = styled.input`
  width: 50px;
  height: 50px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  transition: all var(--transition-fast);
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
  
  &.error {
    border-color: var(--danger);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: var(--spacing-md);
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  
  &:hover:not(:disabled) {
    background-color: var(--primary-dark);
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoginOptions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: var(--spacing-md) 0;
`;

const RememberMe = styled.label`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: var(--primary);
`;

const ForgotPasswordLink = styled(Link)`
  color: var(--primary);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: var(--spacing-lg) 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: var(--border-color);
  }
  
  span {
    padding: 0 var(--spacing-md);
    color: var(--text-secondary);
    font-size: 0.875rem;
  }
`;

const OTPLoginButton = styled.button`
  width: 100%;
  padding: var(--spacing-md);
  background-color: transparent;
  color: var(--primary);
  border: 2px solid var(--primary);
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  
  &:hover {
    background-color: var(--primary);
    color: white;
  }
`;

const ResendButton = styled.button`
  background: none;
  border: none;
  color: var(--primary);
  cursor: pointer;
  font-size: 0.875rem;
  text-decoration: underline;
  transition: color var(--transition-fast);
  
  &:hover {
    color: var(--primary-dark);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const RegisterLink = styled.div`
  text-align: center;
  margin-top: var(--spacing-lg);
  color: var(--text-secondary);
  
  a {
    color: var(--primary);
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const OTPMethodContainer = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
`;

const OTPMethodOption = styled.button`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  border: 2px solid ${props => props.selected ? 'var(--primary)' : 'var(--border-color)'};
  border-radius: var(--radius-md);
  background-color: ${props => props.selected ? 'rgba(0, 123, 255, 0.1)' : 'var(--bg-secondary)'};
  color: ${props => props.selected ? 'var(--primary)' : 'var(--text-secondary)'};
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: 0.875rem;
  font-weight: 500;
  
  &:hover {
    border-color: var(--primary);
    background-color: rgba(0, 123, 255, 0.1);
    color: var(--primary);
  }
  
  svg {
    font-size: 1.25rem;
  }
`;

const WhatsAppIcon = styled(FaWhatsapp)`
  color: #25D366;
  font-size: 1.25rem;
`;

const PhoneInputContainer = styled.div`
  display: flex;
  gap: var(--spacing-sm);
`;

const CountryCodeSelect = styled.div`
  position: relative;
  min-width: 120px;
`;

const CountryCodeButton = styled.button`
  width: 100%;
  padding: var(--spacing-md);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
  transition: all var(--transition-fast);
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
  
  &.error {
    border-color: var(--danger);
  }
`;

const CountryCodeDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: var(--bg-primary);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  margin-top: var(--spacing-xs);
`;

const CountryCodeOption = styled.button`
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  background: none;
  border: none;
  color: var(--text-primary);
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  transition: background-color var(--transition-fast);
  
  &:hover {
    background-color: var(--bg-secondary);
  }
  
  &:first-child {
    border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 var(--radius-sm) var(--radius-sm);
  }
`;

const CountryFlag = styled.span`
  font-size: 1.25rem;
  width: 24px;
  text-align: center;
`;

const CountryName = styled.span`
  flex: 1;
  font-size: 0.875rem;
`;

const CountryCode = styled.span`
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 600;
`;

const PhoneNumberInput = styled(Input)`
  flex: 1;
  padding-left: var(--spacing-md);
`;


const Login = () => {
  const { t } = useTranslation();
  const { login, isLoggingIn, sendOTP, verifyOTP, isSendingOTP, isVerifyingOTP } = useAuth();
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  const [userEmail, setUserEmail] = useState('');
  const [otpMethod, setOtpMethod] = useState('email'); // 'email', 'sms', 'whatsapp'
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]); // Default to US
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [userPhone, setUserPhone] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm();

  const onSubmit = async (data) => {
    try {
      if (loginMethod === 'password') {
        await login(data);
        toast.success('Login successful!');
        navigate('/');
      } else {
        // OTP login - send OTP first
        setUserEmail(data.email);
        setResendTimer(60);
        startResendTimer();
        
        // Send OTP using the selected method
        sendOTP({
          email: data.email,
          phone: data.phone || '', // You might want to add phone field to login form
          method: otpMethod,
          userName: 'User' // You could get this from user data if available
        });
      }
    } catch (error) {
      toast.error(error.message || 'Login failed');
    }
  };

  const startResendTimer = () => {
    const timer = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOTPChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOTPKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      toast.error('Please enter the complete OTP');
      return;
    }

    try {
      // Verify OTP first
      verifyOTP({
        otp: otpCode,
        email: userEmail,
        phone: '', // You might want to store this from the login form
        method: otpMethod
      });
      
      // If OTP verification is successful, proceed with login
      // Note: In a real app, you'd wait for the verifyOTP success callback
      setTimeout(() => {
        login({ email: userEmail, otp: otpCode });
        toast.success('Login successful!');
        navigate('/');
      }, 1000);
    } catch (error) {
      toast.error('Login failed. Please try again.');
    }
  };

  const resendOTP = () => {
    if (resendTimer > 0) return;
    
    // Resend OTP using the same method
    sendOTP({
      email: userEmail,
      phone: '', // You might want to store this from the login form
      method: otpMethod,
      userName: 'User'
    });
    
    setResendTimer(60);
    startResendTimer();
  };

  if (loginMethod === 'otp' && userEmail) {
    return (
      <LoginContainer>
        <LoginCard>
          <LoginHeader>
            <LoginTitle>Enter OTP</LoginTitle>
            <LoginSubtitle>
              We've sent a 6-digit code via {otpMethod === 'email' ? 'email' : otpMethod === 'sms' ? 'SMS' : 'WhatsApp'} to {userEmail}
            </LoginSubtitle>
          </LoginHeader>

          <Form onSubmit={(e) => { e.preventDefault(); handleVerifyOTP(); }}>
            <OTPContainer>
              {otp.map((digit, index) => (
                <OTPInput
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  onKeyDown={(e) => handleOTPKeyDown(index, e)}
                  className={errors.otp ? 'error' : ''}
                />
              ))}
            </OTPContainer>

            <SubmitButton type="submit" disabled={isVerifyingOTP || isLoggingIn}>
              {isVerifyingOTP || isLoggingIn ? 'Verifying...' : 'Verify & Login'}
            </SubmitButton>

            <div style={{ textAlign: 'center', marginTop: 'var(--spacing-md)' }}>
              <ResendButton 
                onClick={resendOTP} 
                disabled={resendTimer > 0}
              >
                {resendTimer > 0 
                  ? `Resend in ${resendTimer}s` 
                  : 'Resend OTP'
                }
              </ResendButton>
            </div>
          </Form>

          <RegisterLink>
            <BackButton to="/login">
              <FiArrowLeft />
              Back to Login
            </BackButton>
          </RegisterLink>
        </LoginCard>
      </LoginContainer>
    );
  }

  return (
    <LoginContainer>
      <LoginCard>
        <BackButton to="/">
          <FiArrowLeft />
          Back to Home
        </BackButton>

        <LoginHeader>
          <LoginTitle>{t('auth.login')}</LoginTitle>
          <LoginSubtitle>
            Welcome back! Please sign in to your account
          </LoginSubtitle>
        </LoginHeader>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label>{t('auth.email')}</Label>
            <InputGroup>
              <InputIcon>
                <FiMail />
              </InputIcon>
              <Input
                type="email"
                hasIcon
                placeholder="Enter your email"
                className={errors.email ? 'error' : ''}
                {...register('email', { 
                  required: t('auth.emailRequired'),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t('auth.emailInvalid')
                  }
                })}
              />
            </InputGroup>
            {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
          </FormGroup>

          {loginMethod === 'otp' && (
            <FormGroup>
              <Label>OTP Delivery Method</Label>
              <OTPMethodContainer>
                <OTPMethodOption 
                  selected={otpMethod === 'email'}
                  onClick={() => setOtpMethod('email')}
                >
                  <FiMail />
                  <span>Email</span>
                </OTPMethodOption>
                <OTPMethodOption 
                  selected={otpMethod === 'sms'}
                  onClick={() => setOtpMethod('sms')}
                >
                  <FiSmartphone />
                  <span>SMS</span>
                </OTPMethodOption>
                <OTPMethodOption 
                  selected={otpMethod === 'whatsapp'}
                  onClick={() => setOtpMethod('whatsapp')}
                >
                  <WhatsAppIcon />
                  <span>WhatsApp</span>
                </OTPMethodOption>
              </OTPMethodContainer>
            </FormGroup>
          )}

          {loginMethod === 'password' && (
            <FormGroup>
              <Label>{t('auth.password')}</Label>
              <InputGroup>
                <InputIcon>
                  <FiLock />
                </InputIcon>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  hasIcon
                  placeholder="Enter your password"
                  className={errors.password ? 'error' : ''}
                  {...register('password', { 
                    required: t('auth.passwordRequired')
                  })}
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </PasswordToggle>
              </InputGroup>
              {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
            </FormGroup>
          )}

          {loginMethod === 'password' && (
            <LoginOptions>
              <RememberMe>
                <Checkbox type="checkbox" />
                {t('auth.rememberMe')}
              </RememberMe>
              <ForgotPasswordLink to="/forgot-password">
                {t('auth.forgotPassword')}
              </ForgotPasswordLink>
            </LoginOptions>
          )}

          <SubmitButton type="submit" disabled={isSendingOTP || isLoggingIn}>
            {isSendingOTP || isLoggingIn ? 'Signing In...' : 'Sign In'}
          </SubmitButton>

          <Divider>
            <span>or</span>
          </Divider>

          <OTPLoginButton
            type="button"
            onClick={() => setLoginMethod(loginMethod === 'password' ? 'otp' : 'password')}
          >
            <FiSmartphone />
            {loginMethod === 'password' ? 'Login with OTP' : 'Login with Password'}
          </OTPLoginButton>
        </Form>

        <RegisterLink>
          {t('auth.dontHaveAccount')} <Link to="/register">{t('auth.signUp')}</Link>
        </RegisterLink>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;