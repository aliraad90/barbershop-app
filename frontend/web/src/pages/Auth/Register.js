import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiArrowLeft, FiChevronDown } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { countryCodes } from '../../data/countryCodes';

const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  padding: var(--spacing-lg);
`;

const RegisterCard = styled.div`
  background-color: var(--bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-2xl);
  width: 100%;
  max-width: 500px;
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

const RegisterHeader = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-2xl);
`;

const RegisterTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
`;

const RegisterSubtitle = styled.p`
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

const LoginLink = styled.div`
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


const Register = () => {
  const { t } = useTranslation();
  const { register: registerUser, isRegistering, sendOTP, verifyOTP, isSendingOTP, isVerifyingOTP } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Registration form, 2: OTP verification
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  const [formData, setFormData] = useState(null);
  const [otpMethod, setOtpMethod] = useState('email'); // 'email', 'sms', 'whatsapp'
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]); // Default to US
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCountryDropdown && !event.target.closest('.country-code-select')) {
        setShowCountryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCountryDropdown]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      // Combine country code with phone number
      const fullPhoneNumber = `${selectedCountry.code}${data.phone.replace(/\D/g, '')}`;
      
      const formDataWithPhone = {
        ...data,
        phone: fullPhoneNumber,
        countryCode: selectedCountry.code,
        country: selectedCountry.country
      };
      
      setFormData(formDataWithPhone);
      setStep(2);
      startResendTimer();
      
      // Send OTP using the selected method
      sendOTP({
        email: data.email,
        phone: fullPhoneNumber,
        method: otpMethod,
        userName: `${data.firstName} ${data.lastName}`
      });
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
    }
  };

  const startResendTimer = () => {
    setResendTimer(60);
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
        email: formData.email,
        phone: formData.phone,
        method: otpMethod
      });
      
      // If OTP verification is successful, proceed with registration
      // Note: In a real app, you'd wait for the verifyOTP success callback
      // For now, we'll simulate the flow
      setTimeout(() => {
        registerUser(formData);
        toast.success('Registration successful!');
        navigate('/');
      }, 1000);
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    }
  };

  const resendOTP = () => {
    if (resendTimer > 0) return;
    
    // Resend OTP using the same method
    sendOTP({
      email: formData.email,
      phone: formData.phone,
      method: otpMethod,
      userName: `${formData.firstName} ${formData.lastName}`
    });
    
    startResendTimer();
  };

  if (step === 2) {
    return (
      <RegisterContainer>
        <RegisterCard>
          <RegisterHeader>
            <RegisterTitle>Verify Your Account</RegisterTitle>
            <RegisterSubtitle>
              We've sent a 6-digit code via {otpMethod === 'email' ? 'email' : otpMethod === 'sms' ? 'SMS' : 'WhatsApp'}
            </RegisterSubtitle>
          </RegisterHeader>

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

            <SubmitButton type="submit" disabled={isVerifyingOTP || isRegistering}>
              {isVerifyingOTP || isRegistering ? 'Verifying...' : 'Verify & Register'}
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

          <LoginLink>
            <BackButton to="/login">
              <FiArrowLeft />
              Back to Login
            </BackButton>
          </LoginLink>
        </RegisterCard>
      </RegisterContainer>
    );
  }

  return (
    <RegisterContainer>
      <RegisterCard>
        <BackButton to="/">
          <FiArrowLeft />
          Back to Home
        </BackButton>

        <RegisterHeader>
          <RegisterTitle>{t('auth.register')}</RegisterTitle>
          <RegisterSubtitle>
            Create your account to book appointments and manage your profile
          </RegisterSubtitle>
        </RegisterHeader>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label>{t('auth.firstName')}</Label>
            <InputGroup>
              <InputIcon>
                <FiUser />
              </InputIcon>
              <Input
                type="text"
                hasIcon
                placeholder="Enter your first name"
                className={errors.firstName ? 'error' : ''}
                {...register('firstName', { 
                  required: t('auth.firstNameRequired'),
                  minLength: { value: 2, message: 'First name must be at least 2 characters' }
                })}
              />
            </InputGroup>
            {errors.firstName && <ErrorMessage>{errors.firstName.message}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>{t('auth.lastName')}</Label>
            <InputGroup>
              <InputIcon>
                <FiUser />
              </InputIcon>
              <Input
                type="text"
                hasIcon
                placeholder="Enter your last name"
                className={errors.lastName ? 'error' : ''}
                {...register('lastName', { 
                  required: t('auth.lastNameRequired'),
                  minLength: { value: 2, message: 'Last name must be at least 2 characters' }
                })}
              />
            </InputGroup>
            {errors.lastName && <ErrorMessage>{errors.lastName.message}</ErrorMessage>}
          </FormGroup>

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

          <FormGroup>
            <Label>{t('auth.phone')}</Label>
            <PhoneInputContainer>
              <CountryCodeSelect className="country-code-select">
                <CountryCodeButton
                  type="button"
                  onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                  className={errors.phone ? 'error' : ''}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                    <CountryFlag>{selectedCountry.flag}</CountryFlag>
                    <span>{selectedCountry.code}</span>
                  </div>
                  <FiChevronDown />
                </CountryCodeButton>
                
                {showCountryDropdown && (
                  <CountryCodeDropdown>
                    {countryCodes.map((country) => (
                      <CountryCodeOption
                        key={country.country}
                        type="button"
                        onClick={() => {
                          setSelectedCountry(country);
                          setShowCountryDropdown(false);
                        }}
                      >
                        <CountryFlag>{country.flag}</CountryFlag>
                        <CountryName>{country.name}</CountryName>
                        <CountryCode>{country.code}</CountryCode>
                      </CountryCodeOption>
                    ))}
                  </CountryCodeDropdown>
                )}
              </CountryCodeSelect>
              
              <InputGroup style={{ flex: 1 }}>
                <InputIcon>
                  <FiPhone />
                </InputIcon>
                <PhoneNumberInput
                  type="tel"
                  hasIcon
                  placeholder="Enter your phone number"
                  className={errors.phone ? 'error' : ''}
                  {...register('phone', { 
                    required: t('auth.phoneRequired'),
                    pattern: {
                      value: /^[\d\s-()]+$/,
                      message: t('auth.phoneInvalid')
                    }
                  })}
                />
              </InputGroup>
            </PhoneInputContainer>
            {errors.phone && <ErrorMessage>{errors.phone.message}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>{t('auth.password')}</Label>
            <InputGroup>
              <InputIcon>
                <FiLock />
              </InputIcon>
              <Input
                type="password"
                hasIcon
                placeholder="Enter your password"
                className={errors.password ? 'error' : ''}
                {...register('password', { 
                  required: t('auth.passwordRequired'),
                  minLength: { 
                    value: 6, 
                    message: t('auth.passwordTooShort') 
                  }
                })}
              />
            </InputGroup>
            {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>{t('auth.confirmPassword')}</Label>
            <InputGroup>
              <InputIcon>
                <FiLock />
              </InputIcon>
              <Input
                type="password"
                hasIcon
                placeholder="Confirm your password"
                className={errors.confirmPassword ? 'error' : ''}
                {...register('confirmPassword', { 
                  required: 'Please confirm your password',
                  validate: value => 
                    value === password || t('auth.passwordsDoNotMatch')
                })}
              />
            </InputGroup>
            {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>OTP Verification Method</Label>
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
                <FiPhone />
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

          <SubmitButton type="submit" disabled={isSendingOTP || isRegistering}>
            {isSendingOTP || isRegistering ? 'Creating Account...' : 'Create Account'}
          </SubmitButton>
        </Form>

        <LoginLink>
          {t('auth.alreadyHaveAccount')} <Link to="/login">{t('auth.signIn')}</Link>
        </LoginLink>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register;