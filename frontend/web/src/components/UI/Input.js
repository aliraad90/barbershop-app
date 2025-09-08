import React, { forwardRef } from 'react';
import styled from 'styled-components';

const InputContainer = styled.div`
  position: relative;
  margin-bottom: var(--spacing-lg);
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
`;

const InputWrapper = styled.div`
  position: relative;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-primary);
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  transition: all var(--transition-normal);
  outline: none;
  
  &::placeholder {
    color: var(--text-tertiary);
    font-weight: 400;
  }
  
  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background: var(--bg-primary);
  }
  
  &:hover:not(:focus) {
    border-color: var(--primary-200);
  }
  
  &:disabled {
    background: var(--bg-tertiary);
    color: var(--text-tertiary);
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  ${props => props.error && `
    border-color: var(--danger);
    
    &:focus {
      border-color: var(--danger);
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
  `}
  
  ${props => props.success && `
    border-color: var(--success);
    
    &:focus {
      border-color: var(--success);
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }
  `}
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-primary);
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  transition: all var(--transition-normal);
  outline: none;
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
  
  &::placeholder {
    color: var(--text-tertiary);
    font-weight: 400;
  }
  
  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background: var(--bg-primary);
  }
  
  &:hover:not(:focus) {
    border-color: var(--primary-200);
  }
  
  &:disabled {
    background: var(--bg-tertiary);
    color: var(--text-tertiary);
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  ${props => props.error && `
    border-color: var(--danger);
    
    &:focus {
      border-color: var(--danger);
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
  `}
  
  ${props => props.success && `
    border-color: var(--success);
    
    &:focus {
      border-color: var(--success);
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }
  `}
`;

const Select = styled.select`
  width: 100%;
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-primary);
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  transition: all var(--transition-normal);
  outline: none;
  cursor: pointer;
  
  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background: var(--bg-primary);
  }
  
  &:hover:not(:focus) {
    border-color: var(--primary-200);
  }
  
  &:disabled {
    background: var(--bg-tertiary);
    color: var(--text-tertiary);
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  ${props => props.error && `
    border-color: var(--danger);
    
    &:focus {
      border-color: var(--danger);
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
  `}
  
  ${props => props.success && `
    border-color: var(--success);
    
    &:focus {
      border-color: var(--success);
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }
  `}
`;

const ErrorMessage = styled.span`
  display: block;
  font-size: 0.875rem;
  color: var(--danger);
  margin-top: var(--spacing-sm);
  font-weight: 500;
`;

const SuccessMessage = styled.span`
  display: block;
  font-size: 0.875rem;
  color: var(--success);
  margin-top: var(--spacing-sm);
  font-weight: 500;
`;

const HelpText = styled.span`
  display: block;
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-top: var(--spacing-sm);
  font-weight: 400;
`;

const Input = forwardRef(({ 
  label, 
  error, 
  success, 
  helpText, 
  type = 'text', 
  as, 
  ...props 
}, ref) => {
  const InputComponent = as || (type === 'textarea' ? Textarea : type === 'select' ? Select : StyledInput);
  
  return (
    <InputContainer>
      {label && <Label>{label}</Label>}
      <InputWrapper>
        <InputComponent
          ref={ref}
          type={type}
          error={error}
          success={success}
          {...props}
        />
      </InputWrapper>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
      {helpText && !error && !success && <HelpText>{helpText}</HelpText>}
    </InputContainer>
  );
});

Input.displayName = 'Input';

export default Input;
