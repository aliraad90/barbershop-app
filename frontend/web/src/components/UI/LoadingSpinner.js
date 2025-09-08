import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-xl);
`;

const Spinner = styled.div`
  width: ${props => props.size || '50px'};
  height: ${props => props.size || '50px'};
  border: 4px solid transparent;
  border-top: 4px solid var(--primary);
  border-right: 4px solid var(--accent);
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border: 2px solid transparent;
    border-top: 2px solid var(--primary-100);
    border-radius: 50%;
    animation: ${spin} 2s linear infinite reverse;
  }
`;

const LoadingText = styled.p`
  margin-top: var(--spacing-lg);
  color: var(--text-secondary);
  font-size: 1rem;
  font-weight: 500;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const LoadingSpinner = ({ size, text, fullScreen = false }) => {
  const content = (
    <SpinnerContainer>
      <div style={{ textAlign: 'center' }}>
        <Spinner size={size} />
        {text && <LoadingText>{text}</LoadingText>}
      </div>
    </SpinnerContainer>
  );

  if (fullScreen) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--spacing-2xl)',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border-light)',
          backdropFilter: 'blur(20px)'
        }}>
          {content}
        </div>
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
