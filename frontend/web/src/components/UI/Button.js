import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const ButtonBase = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'fullWidth' && prop !== 'size',
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: ${props => {
    switch (props.size) {
      case 'sm': return 'var(--spacing-sm) var(--spacing-md)';
      case 'lg': return 'var(--spacing-lg) var(--spacing-2xl)';
      case 'xl': return 'var(--spacing-xl) var(--spacing-2xl)';
      default: return 'var(--spacing-md) var(--spacing-lg)';
    }
  }};
  font-size: ${props => {
    switch (props.size) {
      case 'sm': return '0.875rem';
      case 'lg': return '1.125rem';
      case 'xl': return '1.25rem';
      default: return '1rem';
    }
  }};
  font-weight: 600;
  border-radius: var(--radius-lg);
  border: none;
  cursor: pointer;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
  text-decoration: none;
  white-space: nowrap;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }
  
  ${props => props.fullWidth && `
    width: 100%;
  `}
`;

const PrimaryButton = styled(ButtonBase)`
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  box-shadow: var(--shadow-md);
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-900) 100%);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: var(--shadow-md);
  }
`;

const SecondaryButton = styled(ButtonBase)`
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
    background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%);
    border-color: var(--primary-200);
    color: var(--primary);
  }
`;

const OutlineButton = styled(ButtonBase)`
  background: transparent;
  color: var(--primary);
  border: 2px solid var(--primary);
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    background: var(--primary);
    color: white;
    box-shadow: var(--shadow-md);
  }
`;

const GhostButton = styled(ButtonBase)`
  background: transparent;
  color: var(--text-primary);
  border: 1px solid transparent;
  
  &:hover:not(:disabled) {
    background: var(--bg-secondary);
    border-color: var(--border-color);
    transform: translateY(-1px);
  }
`;

const DangerButton = styled(ButtonBase)`
  background: linear-gradient(135deg, var(--danger) 0%, var(--danger-light) 100%);
  color: white;
  box-shadow: var(--shadow-md);
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    background: linear-gradient(135deg, var(--danger-light) 0%, var(--danger) 100%);
  }
`;

const SuccessButton = styled(ButtonBase)`
  background: linear-gradient(135deg, var(--success) 0%, var(--success-light) 100%);
  color: white;
  box-shadow: var(--shadow-md);
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    background: linear-gradient(135deg, var(--success-light) 0%, var(--success) 100%);
  }
`;

const ButtonLink = styled(Link).withConfig({
  shouldForwardProp: (prop) => prop !== 'fullWidth' && prop !== 'size',
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: ${props => {
    switch (props.size) {
      case 'sm': return 'var(--spacing-sm) var(--spacing-md)';
      case 'lg': return 'var(--spacing-lg) var(--spacing-2xl)';
      case 'xl': return 'var(--spacing-xl) var(--spacing-2xl)';
      default: return 'var(--spacing-md) var(--spacing-lg)';
    }
  }};
  font-size: ${props => {
    switch (props.size) {
      case 'sm': return '0.875rem';
      case 'lg': return '1.125rem';
      case 'xl': return '1.25rem';
      default: return '1rem';
    }
  }};
  font-weight: 600;
  border-radius: var(--radius-lg);
  text-decoration: none;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  ${props => props.fullWidth && `
    width: 100%;
  `}
`;

const PrimaryButtonLink = styled(ButtonLink)`
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  box-shadow: var(--shadow-md);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-900) 100%);
  }
`;

const SecondaryButtonLink = styled(ButtonLink)`
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
    background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%);
    border-color: var(--primary-200);
    color: var(--primary);
  }
`;

const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false, 
  to, 
  children, 
  ...props 
}) => {
  const buttonProps = { size, fullWidth, ...props };
  
  if (to) {
    const ButtonComponent = variant === 'primary' ? PrimaryButtonLink : SecondaryButtonLink;
    return <ButtonComponent to={to} {...buttonProps}>{children}</ButtonComponent>;
  }
  
  switch (variant) {
    case 'secondary':
      return <SecondaryButton {...buttonProps}>{children}</SecondaryButton>;
    case 'outline':
      return <OutlineButton {...buttonProps}>{children}</OutlineButton>;
    case 'ghost':
      return <GhostButton {...buttonProps}>{children}</GhostButton>;
    case 'danger':
      return <DangerButton {...buttonProps}>{children}</DangerButton>;
    case 'success':
      return <SuccessButton {...buttonProps}>{children}</SuccessButton>;
    default:
      return <PrimaryButton {...buttonProps}>{children}</PrimaryButton>;
  }
};

export default Button;
