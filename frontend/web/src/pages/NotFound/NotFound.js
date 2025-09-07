import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FiHome, FiArrowLeft } from 'react-icons/fi';

const NotFoundContainer = styled.div`
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--spacing-2xl);
`;

const ErrorCode = styled.h1`
  font-size: 8rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: var(--spacing-lg);
  line-height: 1;
  
  @media (max-width: 768px) {
    font-size: 6rem;
  }
`;

const ErrorTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ErrorMessage = styled.p`
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
  max-width: 500px;
  line-height: 1.6;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
  justify-content: center;
`;

const Button = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-xl);
  background-color: ${props => props.primary ? 'var(--primary)' : 'transparent'};
  color: ${props => props.primary ? 'white' : 'var(--primary)'};
  border: 2px solid var(--primary);
  border-radius: var(--radius-md);
  text-decoration: none;
  font-weight: 600;
  transition: all var(--transition-fast);
  
  &:hover {
    background-color: ${props => props.primary ? 'var(--primary-dark)' : 'var(--primary)'};
    color: white;
    transform: translateY(-2px);
  }
`;

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <NotFoundContainer>
      <ErrorCode>404</ErrorCode>
      <ErrorTitle>Page Not Found</ErrorTitle>
      <ErrorMessage>
        Sorry, the page you are looking for doesn't exist or has been moved. 
        Please check the URL or return to the homepage.
      </ErrorMessage>
      <ActionButtons>
        <Button primary to="/">
          <FiHome />
          Go Home
        </Button>
        <Button onClick={() => window.history.back()}>
          <FiArrowLeft />
          Go Back
        </Button>
      </ActionButtons>
    </NotFoundContainer>
  );
};

export default NotFound;
